import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from routes.api import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React Frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    # Expose Uploads Folder Static Routes
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/health', methods=['GET'])
    def health():
        return {"status": "healthy", "database": "active"}, 200

    return app

if __name__ == '__main__':
    # Ensure uploads directory exists
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)
        
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
