#!/usr/bin/env python3
import os
import mysql.connector
import json

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", "root"),
    "database": os.environ.get("DB_NAME", "propic_db"),
}

PRODUCTS = [
    {
        "name": "eucalyptus + rosemary foaming hand wash",
        "description": "biodegradable formula made without parabens or phthalates. leaves hands soft, clean + sublimely scented.",
        "price": 3.79,
        "category": "foaming hand wash",
        "stock": 100,
        "featured": True,
        "rating": 4.8,
        "review_count": 24,
        "original_price": None,
        "fragrance": "herbaceous",
        "badge": "",
        "color_code": "#527d00",
        "image_url": "/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp",
        "image_urls": json.dumps(["/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp"])
    },
    {
        "name": "eucalyptus + rosemary all-purpose cleaner",
        "description": "grease + grime don't stand a chance. biodegradable formula with plant-based cleaning power.",
        "price": 4.59,
        "category": "all-purpose cleaner",
        "stock": 120,
        "featured": True,
        "rating": 4.8,
        "review_count": 30,
        "original_price": None,
        "fragrance": "herbaceous",
        "badge": "",
        "color_code": "#527d00",
        "image_url": "/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp",
        "image_urls": json.dumps(["/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp"])
    },
    {
        "name": "lemon + freesia foaming hand wash",
        "description": "zesty citrus blends with sweet freesia. plant-based cleaning power that smells like sunshine.",
        "price": 3.79,
        "category": "foaming hand wash",
        "stock": 80,
        "featured": True,
        "rating": 4.8,
        "review_count": 31,
        "original_price": None,
        "fragrance": "citrus",
        "badge": "",
        "color_code": "#f3a53d",
        "image_url": "/brand/products/Sea + Surf Body Wash Image.webp",
        "image_urls": json.dumps(["/brand/products/Sea + Surf Body Wash Image.webp"])
    },
    {
        "name": "lemon + freesia all-purpose cleaner",
        "description": "bright, sunshiney scents meet serious cleaning muscle. naturally derived, tough on dirt.",
        "price": 4.59,
        "category": "all-purpose cleaner",
        "stock": 90,
        "featured": True,
        "rating": 4.8,
        "review_count": 32,
        "original_price": None,
        "fragrance": "citrus",
        "badge": "",
        "color_code": "#f3a53d",
        "image_url": "/brand/products/Simply Nourish Body Wash Image.webp",
        "image_urls": json.dumps(["/brand/products/Simply Nourish Body Wash Image.webp"])
    },
    {
        "name": "sandalwood + cedar foaming hand wash",
        "description": "warm sandalwood and fresh cedar. a luxurious foaming experience that leaves hands clean and dry-free.",
        "price": 3.79,
        "category": "foaming hand wash",
        "stock": 70,
        "featured": True,
        "rating": 4.8,
        "review_count": 23,
        "original_price": None,
        "fragrance": "woody",
        "badge": "",
        "color_code": "#f06100",
        "image_url": "/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp",
        "image_urls": json.dumps(["/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp"])
    },
    {
        "name": "sandalwood + cedar all-purpose cleaner",
        "description": "earthy, woody scent profile for daily surface cleaning. leaves a streak-free clean and calming aroma.",
        "price": 4.59,
        "category": "all-purpose cleaner",
        "stock": 85,
        "featured": True,
        "rating": 4.8,
        "review_count": 25,
        "original_price": None,
        "fragrance": "woody",
        "badge": "",
        "color_code": "#f06100",
        "image_url": "/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp",
        "image_urls": json.dumps(["/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp"])
    },
    {
        "name": "skin spritz face + body mist",
        "description": "instantly refreshing facial and body spray. formulated with natural humectants for deep dewiness.",
        "price": 29.00,
        "category": "body + hair mist",
        "stock": 40,
        "featured": True,
        "rating": 4.5,
        "review_count": 47,
        "original_price": None,
        "fragrance": "watery",
        "badge": "new",
        "color_code": "#51a9c1",
        "image_url": "/brand/products/whats_new_-_ulta.webp",
        "image_urls": json.dumps(["/brand/products/whats_new_-_ulta.webp"])
    },
    {
        "name": "skin spritz face mist",
        "description": "lightweight, refreshing mist that re-hydrates skin over or under makeup. dermatologist tested.",
        "price": 15.99,
        "category": "body + hair mist",
        "stock": 45,
        "featured": True,
        "rating": 4.5,
        "review_count": 45,
        "original_price": None,
        "fragrance": "watery",
        "badge": "new",
        "color_code": "#51a9c1",
        "image_url": "/brand/products/whats_new_-_ulta.webp",
        "image_urls": json.dumps(["/brand/products/whats_new_-_ulta.webp"])
    },
    {
        "name": "foaming handwash starter set",
        "description": "reusable glass bottle + foaming hand wash concentrate. the perfect sustainable addition to your sink.",
        "price": 10.72,
        "category": "foaming hand wash",
        "stock": 60,
        "featured": False,
        "rating": 4.7,
        "review_count": 18,
        "original_price": 11.28,
        "fragrance": "fragrance free",
        "badge": "sale",
        "color_code": "#e0e0e0",
        "image_url": "/brand/products/Rectangle_5_03c2f127-29ea-478f-a7b7-add531e227e7.webp",
        "image_urls": json.dumps(["/brand/products/Rectangle_5_03c2f127-29ea-478f-a7b7-add531e227e7.webp"])
    },
    {
        "name": "antibacterial bathroom cleaning duo",
        "description": "bathroom cleaner spray + tub and tile refill. kills 99.9% of common household bacteria.",
        "price": 8.63,
        "category": "bathroom cleaner",
        "stock": 55,
        "featured": False,
        "rating": 4.9,
        "review_count": 22,
        "original_price": 9.00,
        "fragrance": "citrus",
        "badge": "sale",
        "color_code": "#f3a53d",
        "image_url": "/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp",
        "image_urls": json.dumps(["/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp"])
    },
    {
        "name": "smoothing hair bundle",
        "description": "smoothing shampoo, conditioner, and gloss serum. professional botanical care for frizzy or dry hair.",
        "price": 20.88,
        "category": "shampoo + conditioner",
        "stock": 30,
        "featured": False,
        "rating": 4.6,
        "review_count": 15,
        "original_price": None,
        "fragrance": "floral",
        "badge": "",
        "color_code": "#d0005e",
        "image_url": "/brand/products/hydrating-serum-new--desktop.webp",
        "image_urls": json.dumps(["/brand/products/hydrating-serum-new--desktop.webp"])
    },
    {
        "name": "volumizing shampoo + conditioner bundle",
        "description": "adds fullness, body and bounce to fine hair. infused with rosemary extract and light proteins.",
        "price": 18.98,
        "category": "shampoo + conditioner",
        "stock": 35,
        "featured": False,
        "rating": 4.8,
        "review_count": 28,
        "original_price": 19.98,
        "fragrance": "floral",
        "badge": "sale",
        "color_code": "#d0005e",
        "image_url": "/brand/products/hydrating-serum-new--desktop.webp",
        "image_urls": json.dumps(["/brand/products/hydrating-serum-new--desktop.webp"])
    }
]

def main():
    import db
    db.init_db()
    
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Clear existing products to ensure clean seed
        print("Clearing existing products...")
        cursor.execute("DELETE FROM order_items")
        cursor.execute("DELETE FROM products")
        
        # Insert premium products
        insert_query = """
        INSERT INTO products (
            name, description, price, image_url, image_urls, category, stock, featured,
            rating, review_count, original_price, fragrance, badge, color_code
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        for p in PRODUCTS:
            cursor.execute(insert_query, (
                p["name"],
                p["description"],
                p["price"],
                p["image_url"],
                p["image_urls"],
                p["category"],
                p["stock"],
                p["featured"],
                p["rating"],
                p["review_count"],
                p["original_price"],
                p["fragrance"],
                p["badge"],
                p["color_code"]
            ))
            
        conn.commit()
        print(f"Successfully seeded {len(PRODUCTS)} premium products!")
        
        cursor.close()
    except Exception as e:
        print(f"Error seeding products: {e}")
    finally:
        if conn and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    main()
