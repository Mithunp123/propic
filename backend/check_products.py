import os
import db

def main():
    db.init_db()
    products = db.get_all_products(include_out_of_stock=True)
    print(f"Total products in DB: {len(products)}")
    for p in products[:5]:
        print(f"- {p['id']}: {p['name']} ({p['category']}) - ${p['price']} - stock: {p['stock']}")

if __name__ == '__main__':
    main()
