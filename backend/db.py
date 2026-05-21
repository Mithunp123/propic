import os
import json
from contextlib import contextmanager
from pathlib import Path

import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "propic_db"),
    "pool_name": "propic_pool",
    "pool_size": int(os.environ.get("DB_POOL_SIZE", "5")),
    "pool_reset_session": True,
}


try:
    connection_pool = pooling.MySQLConnectionPool(**DB_CONFIG)
except mysql.connector.Error as err:
    print(f"Error creating connection pool: {err}")
    connection_pool = None


@contextmanager
def get_db_connection():
    connection = None
    try:
        if not connection_pool:
            raise mysql.connector.Error("Database connection pool is not available")
        connection = connection_pool.get_connection()
        yield connection
    finally:
        if connection and connection.is_connected():
            connection.close()


@contextmanager
def get_db_cursor(commit=False):
    with get_db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        try:
            yield cursor
            if commit:
                connection.commit()
        except mysql.connector.Error:
            connection.rollback()
            raise
        finally:
            cursor.close()


def init_db():
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url VARCHAR(500),
                category VARCHAR(100),
                stock INT DEFAULT 0,
                featured BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
        )

        # Helper to safely add column if it doesn't exist
        columns_to_add = [
            ("image_urls", "TEXT AFTER image_url"),
            ("rating", "DECIMAL(3, 2) DEFAULT 5.00 AFTER featured"),
            ("review_count", "INT DEFAULT 0 AFTER rating"),
            ("original_price", "DECIMAL(10, 2) NULL AFTER review_count"),
            ("fragrance", "VARCHAR(100) NULL AFTER original_price"),
            ("badge", "VARCHAR(50) NULL AFTER fragrance"),
            ("color_code", "VARCHAR(50) NULL AFTER badge")
        ]

        for col_name, col_def in columns_to_add:
            cursor.execute(
                f"""
                SELECT COUNT(*) AS column_count
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND table_name = 'products'
                  AND column_name = '{col_name}'
                """
            )
            if cursor.fetchone()["column_count"] == 0:
                cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_def}")

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS orders (
                order_id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(20) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                pincode VARCHAR(10) NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                payment_method VARCHAR(20) DEFAULT 'cod',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_phone (phone)
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
            """
        )


def _product_rows(query, params=None):
    with get_db_cursor() as cursor:
        cursor.execute(query, params or ())
        return cursor.fetchall()


def _product_row(query, params=None):
    with get_db_cursor() as cursor:
        cursor.execute(query, params or ())
        return cursor.fetchone()


def serialize_product(product):
    if not product:
        return None
    product = dict(product)
    if product.get("price") is not None:
        product["price"] = float(product["price"])
    if product.get("rating") is not None:
        product["rating"] = float(product["rating"])
    if product.get("original_price") is not None:
        product["original_price"] = float(product["original_price"])

    raw_image_urls = product.get("image_urls")
    image_urls = []
    if isinstance(raw_image_urls, list):
        image_urls = [str(url) for url in raw_image_urls if url]
    elif isinstance(raw_image_urls, str) and raw_image_urls.strip():
        try:
            parsed_urls = json.loads(raw_image_urls)
            if isinstance(parsed_urls, list):
                image_urls = [str(url) for url in parsed_urls if url]
            elif parsed_urls:
                image_urls = [str(parsed_urls)]
        except json.JSONDecodeError:
            image_urls = [raw_image_urls]

    primary_image_url = product.get("image_url")
    if primary_image_url:
        image_urls = [primary_image_url, *[url for url in image_urls if url != primary_image_url]]
    elif image_urls:
        primary_image_url = image_urls[0]

    product["image_url"] = primary_image_url
    product["image_urls"] = image_urls
    return product


def serialize_order(order):
    if not order:
        return None
    order = dict(order)
    if order.get("total_amount") is not None:
        order["total_amount"] = float(order["total_amount"])
    return order


def get_featured_products(limit=8):
    query = """
        SELECT *
        FROM products
        WHERE featured = TRUE AND stock > 0
        ORDER BY created_at DESC
        LIMIT %s
    """
    products = _product_rows(query, (limit,))
    if not products:
        query = """
            SELECT *
            FROM products
            WHERE stock > 0
            ORDER BY created_at DESC
            LIMIT %s
        """
        products = _product_rows(query, (limit,))
    return [serialize_product(product) for product in products]


def get_top_selling_products(limit=4):
    query = """
        SELECT p.*, COALESCE(SUM(oi.quantity), 0) AS total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        WHERE p.stock > 0
        GROUP BY p.id
        ORDER BY total_sold DESC, p.created_at DESC
        LIMIT %s
    """
    products = _product_rows(query, (limit,))
    # If no orders yet, fallback to featured or newest products
    if not products or all(p.get("total_sold", 0) == 0 for p in products):
        return get_featured_products(limit)
    return [serialize_product(product) for product in products]


def get_all_products(include_out_of_stock=False):
    query = """
        SELECT *
        FROM products
    """
    if not include_out_of_stock:
        query += " WHERE stock > 0"
    query += " ORDER BY featured DESC, created_at DESC"
    return [serialize_product(product) for product in _product_rows(query)]


def get_product_by_id(product_id):
    product = _product_row("SELECT * FROM products WHERE id = %s", (product_id,))
    return serialize_product(product)


def add_product(name, description, price, image_url, image_urls, category, stock, featured=False,
                rating=None, review_count=0, original_price=None, fragrance=None, badge=None, color_code=None):
    image_urls_json = json.dumps(image_urls or ([image_url] if image_url else []))
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            INSERT INTO products (name, description, price, image_url, image_urls, category, stock, featured,
                                 rating, review_count, original_price, fragrance, badge, color_code)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (name, description, price, image_url, image_urls_json, category, stock, featured,
             rating, review_count, original_price, fragrance, badge, color_code),
        )
        return cursor.lastrowid


def update_product(product_id, name, description, price, image_url, image_urls, category, stock, featured,
                   rating=None, review_count=0, original_price=None, fragrance=None, badge=None, color_code=None):
    image_urls_json = json.dumps(image_urls or ([image_url] if image_url else []))
    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            """
            UPDATE products
            SET name = %s, description = %s, price = %s, image_url = %s,
                image_urls = %s, category = %s, stock = %s, featured = %s,
                rating = %s, review_count = %s, original_price = %s,
                fragrance = %s, badge = %s, color_code = %s
            WHERE id = %s
            """,
            (name, description, price, image_url, image_urls_json, category, stock, featured,
             rating, review_count, original_price, fragrance, badge, color_code, product_id),
        )
        return cursor.rowcount


def delete_product(product_id):
    with get_db_cursor(commit=True) as cursor:
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        return cursor.rowcount


def get_previous_order_by_phone(phone):
    order = _product_row(
        """
        SELECT phone, first_name, last_name, email, address, pincode
        FROM orders
        WHERE phone = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (phone,),
    )
    return dict(order) if order else None


def get_orders_by_phone(phone):
    orders = _product_rows(
        """
        SELECT order_id, first_name, last_name, email, address, pincode,
               total_amount, status, payment_method, created_at, phone
        FROM orders
        WHERE phone = %s
        ORDER BY created_at DESC
        LIMIT 10
        """,
        (phone,),
    )
    return [serialize_order(order) for order in orders]


def create_order(phone, first_name, last_name, email, address, pincode, cart_items, total_amount, payment_method="cod"):
    with get_db_cursor(commit=True) as cursor:
        status = "pending_payment" if payment_method == "upi" else "pending"
        cursor.execute(
            """
            INSERT INTO orders (phone, first_name, last_name, email, address, pincode, total_amount, status, payment_method)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (phone, first_name, last_name, email, address, pincode, total_amount, status, payment_method),
        )
        order_id = cursor.lastrowid

        for item in cart_items:
            cursor.execute(
                """
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
                """,
                (order_id, item["id"], item["quantity"], item["price"]),
            )
        return order_id


def get_order_details(order_id):
    order = _product_row(
        """
        SELECT order_id, phone, first_name, last_name, email, address, pincode,
               total_amount, status, payment_method, created_at
        FROM orders
        WHERE order_id = %s
        """,
        (order_id,),
    )
    if not order:
        return None

    items = _product_rows(
        """
        SELECT oi.quantity, oi.price, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = %s
        """,
        (order_id,),
    )

    order = serialize_order(order)
    order["order_items"] = [
        {"quantity": item["quantity"], "price": float(item["price"]), "name": item["name"], "image_url": item["image_url"]}
        for item in items
    ]
    return order


def get_all_orders():
    orders = _product_rows(
        """
        SELECT order_id AS id, phone, first_name, last_name, email, address, pincode,
               total_amount, status, payment_method, created_at
        FROM orders
        ORDER BY created_at DESC
        """
    )
    return [serialize_order(order) for order in orders]


def get_order_by_id(order_id):
    order = _product_row(
        """
        SELECT order_id AS id, phone, first_name, last_name, email, address, pincode,
               total_amount, status, payment_method, created_at
        FROM orders
        WHERE order_id = %s
        """,
        (order_id,),
    )
    return serialize_order(order)


def get_order_items(order_id):
    items = _product_rows(
        """
        SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price,
               p.name AS product_name, p.image_url AS product_image, p.category AS product_category
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = %s
        """,
        (order_id,),
    )
    serialized = []
    for item in items:
        row = dict(item)
        row["price"] = float(row["price"])
        serialized.append(row)
    return serialized


def update_order_status(order_id, status):
    with get_db_cursor(commit=True) as cursor:
        cursor.execute("UPDATE orders SET status = %s WHERE order_id = %s", (status, order_id))
        return cursor.rowcount