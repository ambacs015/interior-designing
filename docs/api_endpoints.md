# AI Interior Designer REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### 1. User Registration
* **Endpoint**: `/register`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "name": "Kiran Kumar",
    "email": "kiran@example.com",
    "password": "password123"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "message": "Registration successful",
    "user": {
      "name": "Kiran Kumar",
      "email": "kiran@example.com"
    }
  }
  ```

### 2. User Login
* **Endpoint**: `/login`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "email": "kiran@example.com",
    "password": "password123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "name": "Kiran Kumar",
      "email": "kiran@example.com"
    }
  }
  ```

---

## Design Management

### 3. Upload Room Image
* **Endpoint**: `/upload`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **Payload**: File under key `file` (PNG, JPG, JPEG)
* **Success Response (200 OK)**:
  ```json
  {
    "message": "File uploaded successfully",
    "url": "http://localhost:5000/uploads/uuid_filename.png"
  }
  ```

### 4. Fetch AI Design Recommendations
* **Endpoint**: `/recommendation`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "style": "Modern",
    "roomType": "Living Room"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "style": "Modern",
    "roomType": "Living Room",
    "recommendation": {
      "palette": [
        { "name": "Olive Velvet", "hex": "#4B5320", "type": "Accent Wall", "finish": "Matte" },
        ...
      ],
      "furniture": [ ... ],
      "lighting": [ ... ],
      "decor": [ ... ],
      "budget": [
        { "item": "...", "cost": 120 }
      ],
      "conceptImage": "/images/modern_living_room.png"
    }
  }
  ```

### 5. Save Design History
* **Endpoint**: `/designs/save`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "email": "kiran@example.com",
    "design": {
      "id": "design-12345",
      "style": "Modern",
      "roomType": "Living Room",
      "date": "July 11, 2026",
      "originalImage": "http://...",
      "redesignedImage": "http://..."
    }
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "message": "Design saved successfully"
  }
  ```

### 6. Retrieve Saved Designs
* **Endpoint**: `/designs`
* **Method**: `GET`
* **Query Parameters**: `?email=kiran@example.com`
* **Success Response (200 OK)**:
  ```json
  {
    "designs": [
      {
        "id": "design-12345",
        "roomType": "Living Room",
        "style": "Modern",
        "originalImage": "http://...",
        "redesignedImage": "http://...",
        "date": "July 11, 2026",
        "palette": [ ... ],
        "furniture": [ ... ],
        "lighting": [ ... ],
        "decor": [ ... ],
        "budget": [ ... ]
      }
    ]
  }
  ```
