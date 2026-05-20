#!/usr/bin/env python3
"""
Script to populate the database with sample PROPIC products.
Run this after creating the database tables.
"""

import os
from pathlib import Path
import mysql.connector

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", "Vikas@5599"),
    "database": os.environ.get("DB_NAME", "propic_db"),
}

SAMPLE_PRODUCTS = [
    {
        "name": "All-Purpose Surface Cleaner",
        "description": "Powerful cleaning solution for all surfaces. Removes dirt, grime, and stains with ease.",
        "price": 299,
        "category": "Cleaning",
        "stock": 50,
        "featured": True,
    },
    {
        "name": "Glass & Window Cleaner",
        "description": "Crystal clear finish for windows, mirrors, and glass surfaces. Leaves no streaks.",
        "price": 199,
        "category": "Cleaning",
        "stock": 35,
        "featured": True,
    },
    {
        "name": "Bathroom Disinfectant",
        "description": "Kills 99.9% of germs and bacteria. Safe for all bathroom surfaces.",
        "price": 349,
        "category": "Cleaning",
        "stock": 40,
        "featured": True,
    },
    {
        "name": "Kitchen Degreaser",
        "description": "Cuts through tough grease and oils. Perfect for stovetops and cookware.",
        "price": 329,
        "category": "Cleaning",
        "stock": 45,
        "featured": True,
    },
    {
        "name": "Floor Cleaner Concentrate",
        "description": "Powerful concentrate that covers large areas. Works on all floor types.",
        "price": 249,
        "category": "Cleaning",
        "stock": 60,
        "featured": False,
    },
    {
        "name": "Organic Hand Sanitizer",
        "description": "Gentle on skin with organic ingredients. 70% alcohol-based formula.",
        "price": 179,
        "category": "Personal Care",
        "stock": 100,
        "featured": True,
    },
    {
        "name": "Eco-Friendly Dish Soap",
        "description": "Plant-based formula that's tough on grease and gentle on hands.",
        "price": 149,
        "category": "Personal Care",
        "stock": 80,
        "featured": True,
    },
    {
        "name": "Laundry Detergent Liquid",
        "description": "Removes tough stains while being gentle on fabrics. Fresh scent included.",
        "price": 349,
        "category": "Cleaning",
        "stock": 55,
        "featured": False,
    },
    {
        "name": "Air Freshener Spray",
        "description": "Eliminates odors and freshens the air. Available in multiple scents.",
        "price": 129,
        "category": "Essentials",
        "stock": 120,
        "featured": False,
    },
    {
        "name": "Antibacterial Wipes",
        "description": "Convenient wipes for quick cleaning and disinfection on the go.",
        "price": 99,
        "category": "Personal Care",
        "stock": 150,
        "featured": False,
    },
    {
        "name": "Toilet Bowl Cleaner",
        "description": "Powerful formula that removes stains and keeps your toilet fresh.",
        "price": 189,
        "category": "Cleaning",
        "stock": 40,
        "featured": False,
    },
    {
        "name": "Stainless Steel Polish",
        "description": "Brings shine to stainless steel appliances. Protects and polishes.",
        "price": 219,
        "category": "Essentials",
        "stock": 30,
        "featured": False,
    },
]


def main():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check if products already exist
        cursor.execute("SELECT COUNT(*) as count FROM products")
        result = cursor.fetchone()
        
        if result[0] > 0:
            print(f"Database already has {result[0]} products. Skipping sample data insertion.")
            cursor.close()
            conn.close()
            return
        
        # Insert sample products
        insert_query = """
        INSERT INTO products (name, description, price, category, stock, featured)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        for product in SAMPLE_PRODUCTS:
            cursor.execute(insert_query, (
                product["name"],
                product["description"],
                product["price"],
                product["category"],
                product["stock"],
                product["featured"],
            ))
        
        conn.commit()
        print(f"Successfully inserted {len(SAMPLE_PRODUCTS)} sample products into the database.")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise


if __name__ == "__main__":
    main()
