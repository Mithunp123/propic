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
        "name": "lemon + pine floor cleaner",
        "description": "powerful plant-based formula for spotless, shining floors. safe for wood, tile, and laminate.",
        "price": 6.99,
        "category": "Floor Cleaners",
        "stock": 100,
        "featured": True,
        "rating": 4.8,
        "review_count": 124,
        "original_price": None,
        "fragrance": "citrus",
        "badge": "best seller",
        "color_code": "#f3a53d",
        "image_url": "/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp",
        "image_urls": json.dumps(["/brand/products/a87ef715583177b3724044b57ca2a92195892e2d.webp"])
    },
    {
        "name": "eucalyptus streak-free glass spray",
        "description": "crystal clear shine without the harsh chemicals. cuts through grease and grime on glass and mirrors.",
        "price": 5.49,
        "category": "Glass Cleaners",
        "stock": 120,
        "featured": True,
        "rating": 4.7,
        "review_count": 89,
        "original_price": None,
        "fragrance": "herbaceous",
        "badge": "",
        "color_code": "#51a9c1",
        "image_url": "/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp",
        "image_urls": json.dumps(["/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp"])
    },
    {
        "name": "lavender multi-surface everyday cleaner",
        "description": "your go-to for daily wipe downs. safe on countertops, tables, and walls with a soothing lavender scent.",
        "price": 4.99,
        "category": "Multi-Surface Sprays",
        "stock": 80,
        "featured": True,
        "rating": 4.9,
        "review_count": 210,
        "original_price": 5.99,
        "fragrance": "floral",
        "badge": "sale",
        "color_code": "#7800bf",
        "image_url": "/brand/products/Sea + Surf Body Wash Image.webp",
        "image_urls": json.dumps(["/brand/products/Sea + Surf Body Wash Image.webp"])
    },
    {
        "name": "tea tree bathroom grime fighter",
        "description": "tough on soap scum, hard water stains, and grime. leaves your bathroom sparkling and smelling fresh.",
        "price": 7.49,
        "category": "Bathroom Cleaners",
        "stock": 90,
        "featured": True,
        "rating": 4.6,
        "review_count": 55,
        "original_price": None,
        "fragrance": "herbaceous",
        "badge": "new",
        "color_code": "#527d00",
        "image_url": "/brand/products/Simply Nourish Body Wash Image.webp",
        "image_urls": json.dumps(["/brand/products/Simply Nourish Body Wash Image.webp"])
    },
    {
        "name": "orange zest heavy duty degreaser",
        "description": "tackles the toughest baked-on kitchen messes. natural citrus extracts cut through heavy grease.",
        "price": 8.99,
        "category": "Kitchen Cleaners",
        "stock": 70,
        "featured": False,
        "rating": 4.8,
        "review_count": 42,
        "original_price": None,
        "fragrance": "citrus",
        "badge": "",
        "color_code": "#f06100",
        "image_url": "/brand/products/Rectangle_5_03c2f127-29ea-478f-a7b7-add531e227e7.webp",
        "image_urls": json.dumps(["/brand/products/Rectangle_5_03c2f127-29ea-478f-a7b7-add531e227e7.webp"])
    },
    {
        "name": "cedarwood daily toilet bowl cleaner",
        "description": "keeps the bowl fresh between deep cleans. natural enzymes break down stains without bleach.",
        "price": 5.99,
        "category": "Bathroom Cleaners",
        "stock": 85,
        "featured": False,
        "rating": 4.5,
        "review_count": 34,
        "original_price": None,
        "fragrance": "woody",
        "badge": "",
        "color_code": "#d0005e",
        "image_url": "/brand/products/hydrating-serum-new--desktop.webp",
        "image_urls": json.dumps(["/brand/products/hydrating-serum-new--desktop.webp"])
    },
    {
        "name": "unscented deep clean carpet powder",
        "description": "absorbs odors and lifts dirt from deep within carpet fibers. simply sprinkle, wait, and vacuum.",
        "price": 9.99,
        "category": "Floor Cleaners",
        "stock": 40,
        "featured": False,
        "rating": 4.4,
        "review_count": 18,
        "original_price": None,
        "fragrance": "fragrance free",
        "badge": "",
        "color_code": "#e0e0e0",
        "image_url": "/brand/products/whats_new_-_ulta.webp",
        "image_urls": json.dumps(["/brand/products/whats_new_-_ulta.webp"])
    },
    {
        "name": "mint + lime dish soap concentrate",
        "description": "ultra-concentrated grease-cutting power for your dishes. one drop goes a long way.",
        "price": 4.49,
        "category": "Kitchen Cleaners",
        "stock": 150,
        "featured": True,
        "rating": 4.9,
        "review_count": 312,
        "original_price": None,
        "fragrance": "citrus",
        "badge": "popular",
        "color_code": "#527d00",
        "image_url": "/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp",
        "image_urls": json.dumps(["/brand/products/3ea4251ebeb625eaf3d4c2c013aebc35ac6e2786_1.webp"])
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
