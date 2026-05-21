import os
from uuid import uuid4
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import waitress
from werkzeug.utils import secure_filename


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
# Load environment variables before importing modules that read env at import-time.
load_dotenv(BASE_DIR / ".env")

import db

ADMIN_ACCESS_TOKEN = os.environ.get("ADMIN_ACCESS_TOKEN", "")


def _save_product_uploads(uploads):
    upload_dir = BASE_DIR / "static" / "uploads" / "products"
    upload_dir.mkdir(parents=True, exist_ok=True)

    image_urls = []
    for upload in uploads:
        if not upload or not upload.filename:
            continue

        original_name = secure_filename(upload.filename) or "product-image"
        filename = f"{uuid4().hex}_{original_name}"
        filepath = upload_dir / filename
        upload.save(filepath)
        image_urls.append(f"/static/uploads/products/{filename}")

    return image_urls


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.secret_key = os.environ.get("SECRET_KEY", "change-me-in-production")

    db.init_db()

    def require_admin_token():
        if not ADMIN_ACCESS_TOKEN:
            return True
        provided = request.headers.get("X-Admin-Token", "")
        return provided == ADMIN_ACCESS_TOKEN

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.get("/api/products")
    def api_products():
        return jsonify(db.get_all_products())

    @app.get("/api/products/featured")
    def api_featured_products():
        limit = int(request.args.get("limit", 8))
        return jsonify(db.get_featured_products(limit=limit))

    @app.get("/api/products/bestselling")
    def api_bestselling_products():
        limit = int(request.args.get("limit", 4))
        return jsonify(db.get_top_selling_products(limit=limit))

    @app.get("/api/products/<int:product_id>")
    def api_product_detail(product_id):
        product = db.get_product_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product)

    @app.post("/api/orders")
    def api_create_order():
        payload = request.get_json(force=True, silent=True) or {}
        required_fields = ["phone", "first_name", "last_name", "email", "address", "pincode", "cart_items", "total_amount"]
        missing = [field for field in required_fields if field not in payload or payload[field] in (None, "", [])]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        order_id = db.create_order(
            phone=payload["phone"],
            first_name=payload["first_name"],
            last_name=payload["last_name"],
            email=payload["email"],
            address=payload["address"],
            pincode=payload["pincode"],
            cart_items=payload["cart_items"],
            total_amount=float(payload["total_amount"]),
            payment_method=payload.get("payment_method", "cod"),
        )
        if not order_id:
            return jsonify({"error": "Unable to create order"}), 500
        return jsonify({"order_id": order_id})

    @app.get("/api/orders/<int:order_id>")
    def api_order_detail(order_id):
        order = db.get_order_details(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        return jsonify(order)

    @app.get("/api/orders/track")
    def api_track_orders():
        phone = request.args.get("phone", "").strip()
        if not phone:
            return jsonify({"error": "phone is required"}), 400
        return jsonify(db.get_orders_by_phone(phone))

    @app.post("/api/orders/verify")
    def api_verify_order():
        payload = request.get_json(force=True, silent=True) or {}
        phone = payload.get("phone", "").strip()
        pincode = payload.get("pincode", "").strip()
        if not phone or not pincode:
            return jsonify({"error": "phone and pincode are required"}), 400

        orders = db.get_orders_by_phone(phone)
        if orders and orders[0]["pincode"] == pincode:
            return jsonify({"verified": True, "orders": orders})
        return jsonify({"verified": False, "error": "Incorrect pincode"}), 401

    @app.get("/api/admin/summary")
    def api_admin_summary():
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        products = db.get_all_products(include_out_of_stock=True)
        orders = db.get_all_orders()
        return jsonify(
            {
                "total_products": len(products),
                "total_orders": len(orders),
                "total_revenue": round(sum(order["total_amount"] for order in orders), 2),
                "pending_orders": len([order for order in orders if order["status"] == "pending"]),
                "low_stock_products": len([product for product in products if product["stock"] < 10]),
            }
        )

    @app.get("/api/admin/products")
    def api_admin_products():
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        return jsonify(db.get_all_products(include_out_of_stock=True))

    @app.post("/api/admin/products")
    def api_admin_add_product():
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401

        name = request.form.get("name")
        price = request.form.get("price")
        if not name or not price:
            return jsonify({"error": "name and price are required"}), 400

        uploaded_images = _save_product_uploads(request.files.getlist("images") or request.files.getlist("image"))
        image_url = uploaded_images[0] if uploaded_images else None

        original_price_raw = request.form.get("original_price")
        rating_raw = request.form.get("rating")
        review_count_raw = request.form.get("review_count")

        product_id = db.add_product(
            name=name,
            description=request.form.get("description"),
            price=float(price),
            image_url=image_url,
            image_urls=uploaded_images,
            category=request.form.get("category"),
            stock=int(request.form.get("stock", 0)),
            featured=request.form.get("featured") == "on",
            rating=float(rating_raw) if rating_raw else None,
            review_count=int(review_count_raw) if review_count_raw else 0,
            original_price=float(original_price_raw) if original_price_raw else None,
            fragrance=request.form.get("fragrance") or None,
            badge=request.form.get("badge") or None,
            color_code=request.form.get("color_code") or None,
        )
        return jsonify({"product_id": product_id}), 201

    @app.put("/api/admin/products/<int:product_id>")
    def api_admin_update_product(product_id):
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401

        current = db.get_product_by_id(product_id)
        if not current:
            return jsonify({"error": "Product not found"}), 404

        payload = request.form if request.form else (request.get_json(force=True, silent=True) or {})
        current_images = current.get("image_urls") or ([] if not current.get("image_url") else [current.get("image_url")])
        uploaded_images = _save_product_uploads(request.files.getlist("images") or request.files.getlist("image"))
        image_urls = current_images + uploaded_images if uploaded_images else current_images
        image_url = image_urls[0] if image_urls else None

        original_price_raw = payload.get("original_price", current.get("original_price"))
        rating_raw = payload.get("rating", current.get("rating"))
        review_count_raw = payload.get("review_count", current.get("review_count", 0))

        db.update_product(
            product_id=product_id,
            name=payload.get("name", current["name"]),
            description=payload.get("description", current.get("description")),
            price=float(payload.get("price", current["price"])),
            image_url=image_url,
            image_urls=image_urls,
            category=payload.get("category", current.get("category")),
            stock=int(payload.get("stock", current.get("stock", 0))),
            featured=str(payload.get("featured", current.get("featured", False))).lower() in {"1", "true", "on"},
            rating=float(rating_raw) if rating_raw is not None else None,
            review_count=int(review_count_raw) if review_count_raw is not None else 0,
            original_price=float(original_price_raw) if original_price_raw is not None else None,
            fragrance=payload.get("fragrance", current.get("fragrance")) or None,
            badge=payload.get("badge", current.get("badge")) or None,
            color_code=payload.get("color_code", current.get("color_code")) or None,
        )
        return jsonify({"ok": True})

    @app.delete("/api/admin/products/<int:product_id>")
    def api_admin_delete_product(product_id):
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        deleted = db.delete_product(product_id)
        return jsonify({"deleted": deleted > 0})

    @app.get("/api/admin/orders")
    def api_admin_orders():
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        return jsonify(db.get_all_orders())

    @app.get("/api/admin/orders/<int:order_id>")
    def api_admin_order_detail(order_id):
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        order = db.get_order_by_id(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
        return jsonify({"order": order, "items": db.get_order_items(order_id)})

    @app.patch("/api/admin/orders/<int:order_id>/status")
    def api_admin_update_order_status(order_id):
        if not require_admin_token():
            return jsonify({"error": "Unauthorized"}), 401
        payload = request.get_json(force=True, silent=True) or {}
        status = payload.get("status")
        if not status:
            return jsonify({"error": "status is required"}), 400
        updated = db.update_order_status(order_id, status)
        return jsonify({"updated": updated > 0})

    @app.get("/")
    def spa_index():
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return send_from_directory(FRONTEND_DIST, "index.html")
        return jsonify({"message": "PROPIC API is running"})

    @app.get("/api/media/<path:filepath>")
    def api_media(filepath):
        """Serve media files (images, etc.)"""
        try:
            full_path = BASE_DIR / "static" / filepath
            if full_path.exists() and full_path.is_file():
                return send_from_directory(BASE_DIR / "static", filepath)
            return jsonify({"error": "File not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.get("/static/<path:filepath>")
    def serve_static(filepath):
        """Serve static files"""
        return send_from_directory(BASE_DIR / "static", filepath)

    @app.get("/assets/<path:filename>")
    def spa_assets(filename):
        asset_path = FRONTEND_DIST / "assets" / filename
        if asset_path.exists():
            return send_from_directory(FRONTEND_DIST / "assets", filename)
        return jsonify({"error": "Asset not found"}), 404

    @app.get("/<path:path>")
    def spa_fallback(path):
        if path.startswith("api/"):
            return jsonify({"error": "Not found"}), 404

        file_path = FRONTEND_DIST / path
        if file_path.exists() and file_path.is_file():
            return send_from_directory(FRONTEND_DIST, path)

        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return send_from_directory(FRONTEND_DIST, "index.html")

        return jsonify({"message": "PROPIC API is running"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5010")))