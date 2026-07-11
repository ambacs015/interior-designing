import os
import uuid
import json
import datetime
from functools import wraps
import bcrypt
import jwt
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from database import db
from config import Config

api_bp = Blueprint('api', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# JWT Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({'message': 'Token is missing or invalid format!'}), 401
            
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = db.get_user_by_email(data['email'])
            if not current_user:
                raise Exception('User not found')
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@api_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    existing_user = db.get_user_by_email(email)
    if existing_user:
        return jsonify({'message': 'Email address is already registered'}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    success = db.create_user(name, email, hashed_password)
    if success:
        return jsonify({
            'message': 'Registration successful',
            'user': {'name': name, 'email': email}
        }), 201
    else:
        return jsonify({'message': 'Registration failed'}), 500

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    user = db.get_user_by_email(email)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Generate JWT token
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {'name': user['name'], 'email': user['email']}
        }), 200
    
    return jsonify({'message': 'Invalid email or password'}), 401

@api_bp.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Ensure unique name to prevent collisions
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        
        # Create uploads folder if not exists
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)
            
        file_path = os.path.join(Config.UPLOAD_FOLDER, unique_name)
        file.save(file_path)
        
        url = f"http://localhost:5000/uploads/{unique_name}"
        return jsonify({'message': 'File uploaded successfully', 'url': url}), 200

    return jsonify({'message': 'File type not allowed'}), 400

@api_bp.route('/recommendation', methods=['POST'])
@token_required
def get_recommendation(current_user):
    data = request.get_json() or {}
    style = data.get('style', 'Modern')
    room_type = data.get('roomType', 'Living Room')
    
    # In a real scenario, you would pass the image and prompt to the Gemini API here.
    # For example:
    # api_key = os.environ.get('GEMINI_API_KEY')
    # Use api_key to interact with the LLM and get a dynamic recommendation.
    # We return the placeholder structure below.
    
    # Custom details mapping based on style
    details_map = {
        'Modern': {
            'palette': [
                { 'name': "Olive Velvet", 'hex': "#4B5320", 'type': "Accent Wall", 'finish': "Matte" },
                { 'name': "Off-White Mist", 'hex': "#F5F5F0", 'type': "Main Walls", 'finish': "Eggshell" },
                { 'name': "Warm Charcoal", 'hex': "#2C3539", 'type': "Doors & Trim", 'finish': "Satin" }
            ],
            'furniture': [
                "Low-profile grey sectional sofa positioned against the main wall.",
                "Solid oak coffee table with black steel hairpin legs in the center.",
                "Floating wood shelves on the accent wall for books and small ceramic pots."
            ],
            'lighting': [
                "Dimmable warm brass pendant light centered over the seating area.",
                "Slender matte-black floor lamp next to the sectional for task reading.",
                "Warm white LED strip backlight recessed behind the floating shelves."
            ],
            'decor': [
                "Tall fiddle leaf fig plant in a concrete planter for a splash of nature.",
                "Textured cream wool area rug placed partially under the sectional.",
                "Monochromatic abstract canvas art hanging on the off-white wall."
            ],
            'budget': [
                { 'item': "Premium Low-VOC Paint (3 Gallons)", 'cost': 180 },
                { 'item': "Oak & Iron Coffee Table", 'cost': 350 },
                { 'item': "Textured Wool Area Rug (8x10)", 'cost': 420 },
                { 'item': "Mid-Century Pendant Light", 'cost': 240 },
                { 'item': "Floating Oak Shelves & Hardware", 'cost': 120 }
            ],
            'conceptImage': "/images/modern_living_room.png"
        },
        'Luxury': {
            'palette': [
                { 'name': "Palatial Navy", 'hex': "#0F1E36", 'type': "Accent Wall", 'finish': "Matte" },
                { 'name': "Champagne Cream", 'hex': "#F3E5AB", 'type': "Main Walls", 'finish': "Satin" },
                { 'name': "Metallic Gold", 'hex': "#D4AF37", 'type': "Trim / Accents", 'finish': "Gloss" }
            ],
            'furniture': [
                "Velvet high-back bed frame with deep button tufting against navy wall.",
                "Pair of mirrored glass nightstands on either side of the bed frame.",
                "Plush gold velvet accent armchair placed in the window corner nook."
            ],
            'lighting': [
                "Gilded crystal pendant chandelier suspended in the center of the room.",
                "Matching brass bedside lamps with warm ambient linen shades.",
                "Soft yellow LED under-bed glow strips for high-end night pathing."
            ],
            'decor': [
                "Double-layer silk curtains in champagne and navy blue draping the window.",
                "Heavy gold-framed vanity mirror hanging above the chest of drawers.",
                "Faux fur white rug layering the base of the velvet armchair."
            ],
            'budget': [
                { 'item': "Rich Velvet Bed Frame & Tufted Headboard", 'cost': 850 },
                { 'item': "Palatial Navy Wall Paint & Gold Foil Accents", 'cost': 290 },
                { 'item': "mirrored nightstands (pair)", 'cost': 480 },
                { 'item': "Gilded Pendant Chandelier", 'cost': 650 },
                { 'item': "Double-layer Silk Curtains & Rods", 'cost': 320 }
            ],
            'conceptImage': "/images/luxury_bedroom.png"
        },
        'Minimalist': {
            'palette': [
                { 'name': "Soft Alabaster", 'hex': "#F2F0EB", 'type': "All Walls", 'finish': "Flat Matte" },
                { 'name': "Natural Pine", 'hex': "#E3D3C4", 'type': "Flooring / Accents", 'finish': "Satin" },
                { 'name': "Soft Charcoal", 'hex': "#3A3A3C", 'type': "Contrast Trim", 'finish': "Matte" }
            ],
            'furniture': [
                "Wall-mounted floating oak desk keeping the floor completely clear.",
                "Ergonomic white office chair with hidden wheels and structure.",
                "Concealed handleless floor-to-ceiling white storage cabinet units."
            ],
            'lighting': [
                "Ultra-thin recessed circular ceiling lights providing clean daylight glow.",
                "Sleek LED desk lamp with touch controls and integrated charger.",
                "Indirect LED backlight strips hidden along the storage panel seams."
            ],
            'decor': [
                "Single medium peace lily plant in a white matte ceramic pot on desk.",
                "Beige linen seat cushions for natural textures.",
                "Neat storage bins matching the cabinet compartments exactly."
            ],
            'budget': [
                { 'item': "Floating Oak Study Desk", 'cost': 280 },
                { 'item': "Ergonomic Matte White Chair", 'cost': 220 },
                { 'item': "Recessed Circular LED Ceiling Lights", 'cost': 180 },
                { 'item': "Alabaster Wall Paint & Accessories", 'cost': 140 },
                { 'item': "Concealed Storage Organizers", 'cost': 95 }
            ],
            'conceptImage': "/images/minimalist_office.png"
        }
    }
    
    style_data = details_map.get(style, details_map['Modern'])
    
    # Map into the format expected by the frontend
    recommendations = []
    for cat in ['furniture', 'lighting', 'decor']:
        for item in style_data[cat]:
            recommendations.append({
                'category': cat,
                'suggestion': item,
                'link': '#'
            })
            
    for color in style_data['palette']:
        recommendations.append({
            'category': 'palette',
            'suggestion': f"Use {color['name']} ({color['hex']}) for {color['type']} with {color['finish']} finish.",
            'link': '#'
        })

    # Customize recommendation slightly by room type if needed
    return jsonify({
        'style': style,
        'roomType': room_type,
        'redesign_image': style_data['conceptImage'],
        'recommendations': recommendations,
        'raw_style_data': style_data
    }), 200

@api_bp.route('/designs', methods=['GET'])
@token_required
def get_designs(current_user):
    # Only return designs for the currently authenticated user
    designs = db.get_designs_by_user(current_user['email'])
    return jsonify({'designs': designs}), 200

@api_bp.route('/designs/save', methods=['POST'])
@token_required
def save_design(current_user):
    data = request.get_json() or {}
    design = data.get('design')
    
    if not design:
        return jsonify({'message': 'Missing design payload'}), 400
        
    # Enforce saving under the authenticated user's email
    design['email'] = current_user['email']
    
    # Get details mapping to populate recommendation table
    style = design.get('style', 'Modern')
    
    # Retrieve the details from our map for database storage
    details_map = {
        'Modern': {
            'palette': [
                { 'name': "Olive Velvet", 'hex': "#4B5320", 'type': "Accent Wall", 'finish': "Matte" },
                { 'name': "Off-White Mist", 'hex': "#F5F5F0", 'type': "Main Walls", 'finish': "Eggshell" },
                { 'name': "Warm Charcoal", 'hex': "#2C3539", 'type': "Doors & Trim", 'finish': "Satin" }
            ],
            'furniture': ["Low-profile sectional", "Oak coffee table", "Floating oak shelves"],
            'lighting': ["warm brass pendant", "matte black floor lamp", "LED backlights"],
            'decor': ["Fiddle leaf fig plant", "Cream area rug", "Monochromatic canvas art"],
            'budget': [
                { 'item': "Paint", 'cost': 180 },
                { 'item': "Coffee Table", 'cost': 350 },
                { 'item': "Area Rug", 'cost': 420 },
                { 'item': "Pendant Light", 'cost': 240 },
                { 'item': "Shelves", 'cost': 120 }
            ]
        },
        'Luxury': {
            'palette': [
                { 'name': "Palatial Navy", 'hex': "#0F1E36", 'type': "Accent Wall", 'finish': "Matte" },
                { 'name': "Champagne Cream", 'hex': "#F3E5AB", 'type': "Main Walls", 'finish': "Satin" },
                { 'name': "Metallic Gold", 'hex': "#D4AF37", 'type': "Trim / Accents", 'finish': "Gloss" }
            ],
            'furniture': ["Velvet headboard bed", "Mirrored nightstands", "Gold accent armchair"],
            'lighting': ["Crystal chandelier", "Bedside brass lamps", "Soft yellow under-bed LED"],
            'decor': ["Silk curtains", "Gold vanity mirror", "Faux fur rug"],
            'budget': [
                { 'item': "Bed frame", 'cost': 850 },
                { 'item': "Paint", 'cost': 290 },
                { 'item': "Nightstands", 'cost': 480 },
                { 'item': "Chandelier", 'cost': 650 },
                { 'item': "Curtains", 'cost': 320 }
            ]
        },
        'Minimalist': {
            'palette': [
                { 'name': "Soft Alabaster", 'hex': "#F2F0EB", 'type': "All Walls", 'finish': "Flat Matte" },
                { 'name': "Natural Pine", 'hex': "#E3D3C4", 'type': "Flooring / Accents", 'finish': "Satin" },
                { 'name': "Soft Charcoal", 'hex': "#3A3A3C", 'type': "Contrast Trim", 'finish': "Matte" }
            ],
            'furniture': ["Floating study desk", "Ergonomic desk chair", "Handleless cabinets"],
            'lighting': ["Recessed ceiling LEDs", "LED desk lamp", "Indirect led backlight"],
            'decor': ["Peace lily plant", "Linen cushions", "Storage bins"],
            'budget': [
                { 'item': "Desk", 'cost': 280 },
                { 'item': "Chair", 'cost': 220 },
                { 'item': "Ceiling LEDs", 'cost': 180 },
                { 'item': "Paint", 'cost': 140 },
                { 'item': "Organizers", 'cost': 95 }
            ]
        }
    }
    
    style_data = details_map.get(style, details_map['Modern'])
    
    # Save design to SQL database (MySQL or SQLite fallback)
    success = db.save_design(design, style_data)
    if success:
        return jsonify({'message': 'Design saved successfully'}), 201
    else:
        return jsonify({'message': 'Failed to save design'}), 500
