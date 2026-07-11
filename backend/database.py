import os
import json
import sqlite3
import mysql.connector
from mysql.connector import errorcode
from config import Config

class Database:
    def __init__(self):
        self.db_type = 'sqlite'  # Default fallback
        self.mysql_conn = None
        self.sqlite_conn = None
        self.init_db()

    def get_connection(self):
        """Attempts to connect to MySQL first. Falls back to SQLite if fails."""
        # Try MySQL
        try:
            conn = mysql.connector.connect(
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD
            )
            
            # Create database if not exists
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_NAME}")
            conn.database = Config.DB_NAME
            self.db_type = 'mysql'
            return conn
        except mysql.connector.Error as err:
            print(f"[WARN] MySQL Connection Failed: {err}. Falling back to SQLite...")
            
            # Use SQLite
            self.db_type = 'sqlite'
            conn = sqlite3.connect(Config.SQLITE_PATH, check_same_thread=False)
            return conn

    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        if self.db_type == 'mysql':
            # Create MySQL tables
            try:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS rooms (
                        id VARCHAR(255) PRIMARY KEY,
                        email VARCHAR(255) NOT NULL,
                        room_type VARCHAR(100) NOT NULL,
                        style VARCHAR(100) NOT NULL,
                        original_image LONGTEXT NOT NULL,
                        redesigned_image LONGTEXT NOT NULL,
                        date VARCHAR(100) NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS recommendations (
                        id VARCHAR(255) PRIMARY KEY,
                        room_id VARCHAR(255) NOT NULL,
                        palette TEXT NOT NULL,
                        furniture TEXT NOT NULL,
                        lighting TEXT NOT NULL,
                        decor TEXT NOT NULL,
                        budget TEXT NOT NULL
                    )
                """)
                conn.commit()
                print("[INFO] MySQL tables initialized successfully.")
            except mysql.connector.Error as err:
                print(f"[ERROR] Failed to initialize MySQL tables: {err}")
        else:
            # Create SQLite tables
            try:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS rooms (
                        id TEXT PRIMARY KEY,
                        email TEXT NOT NULL,
                        room_type TEXT NOT NULL,
                        style TEXT NOT NULL,
                        original_image TEXT NOT NULL,
                        redesigned_image TEXT NOT NULL,
                        date TEXT NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS recommendations (
                        id TEXT PRIMARY KEY,
                        room_id TEXT NOT NULL,
                        palette TEXT NOT NULL,
                        furniture TEXT NOT NULL,
                        lighting TEXT NOT NULL,
                        decor TEXT NOT NULL,
                        budget TEXT NOT NULL
                    )
                """)
                conn.commit()
                print(f"[INFO] SQLite tables initialized successfully at {Config.SQLITE_PATH}.")
            except sqlite3.Error as err:
                print(f"[ERROR] Failed to initialize SQLite tables: {err}")
        
        conn.close()

    # User Methods
    def create_user(self, name, email, password):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if self.db_type == 'mysql':
                query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
                cursor.execute(query, (name, email, password))
            else:
                query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
                cursor.execute(query, (name, email, password))
            conn.commit()
            return True
        except Exception as err:
            print(f"[DB ERROR] create_user failed: {err}")
            return False
        finally:
            conn.close()

    def get_user_by_email(self, email):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if self.db_type == 'mysql':
                query = "SELECT name, email, password FROM users WHERE email = %s"
                cursor.execute(query, (email,))
            else:
                query = "SELECT name, email, password FROM users WHERE email = ?"
                cursor.execute(query, (email,))
            
            row = cursor.fetchone()
            if row:
                return {'name': row[0], 'email': row[1], 'password': row[2]}
            return None
        except Exception as err:
            print(f"[DB ERROR] get_user_by_email failed: {err}")
            return None
        finally:
            conn.close()

    # Room / Design Methods
    def save_design(self, design, rec_details):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # 1. Save Room
            if self.db_type == 'mysql':
                query = """
                    INSERT INTO rooms (id, email, room_type, style, original_image, redesigned_image, date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    design['id'],
                    design['email'],
                    design['roomType'],
                    design['style'],
                    design['originalImage'],
                    design['redesignedImage'],
                    design['date']
                ))
                
                # 2. Save Recommendation details
                query_rec = """
                    INSERT INTO recommendations (id, room_id, palette, furniture, lighting, decor, budget)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query_rec, (
                    'rec-' + design['id'],
                    design['id'],
                    json.dumps(rec_details['palette']),
                    json.dumps(rec_details['furniture']),
                    json.dumps(rec_details['lighting']),
                    json.dumps(rec_details['decor']),
                    json.dumps(rec_details['budget'])
                ))
            else:
                query = """
                    INSERT INTO rooms (id, email, room_type, style, original_image, redesigned_image, date)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """
                cursor.execute(query, (
                    design['id'],
                    design['email'],
                    design['roomType'],
                    design['style'],
                    design['originalImage'],
                    design['redesignedImage'],
                    design['date']
                ))
                
                # 2. Save Recommendation details
                query_rec = """
                    INSERT INTO recommendations (id, room_id, palette, furniture, lighting, decor, budget)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """
                cursor.execute(query_rec, (
                    'rec-' + design['id'],
                    design['id'],
                    json.dumps(rec_details['palette']),
                    json.dumps(rec_details['furniture']),
                    json.dumps(rec_details['lighting']),
                    json.dumps(rec_details['decor']),
                    json.dumps(rec_details['budget'])
                ))
            conn.commit()
            return True
        except Exception as err:
            print(f"[DB ERROR] save_design failed: {err}")
            return False
        finally:
            conn.close()

    def get_designs_by_user(self, email):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if self.db_type == 'mysql':
                query = """
                    SELECT r.id, r.room_type, r.style, r.original_image, r.redesigned_image, r.date, 
                           rec.palette, rec.furniture, rec.lighting, rec.decor, rec.budget
                    FROM rooms r
                    LEFT JOIN recommendations rec ON r.id = rec.room_id
                    WHERE r.email = %s
                    ORDER BY r.date DESC
                """
                cursor.execute(query, (email,))
            else:
                query = """
                    SELECT r.id, r.room_type, r.style, r.original_image, r.redesigned_image, r.date, 
                           rec.palette, rec.furniture, rec.lighting, rec.decor, rec.budget
                    FROM rooms r
                    LEFT JOIN recommendations rec ON r.id = rec.room_id
                    WHERE r.email = ?
                    ORDER BY r.date DESC
                """
                cursor.execute(query, (email,))
            
            rows = cursor.fetchall()
            designs = []
            for row in rows:
                designs.append({
                    'id': row[0],
                    'roomType': row[1],
                    'style': row[2],
                    'originalImage': row[3],
                    'redesignedImage': row[4],
                    'date': row[5],
                    'palette': json.loads(row[6]) if row[6] else [],
                    'furniture': json.loads(row[7]) if row[7] else [],
                    'lighting': json.loads(row[8]) if row[8] else [],
                    'decor': json.loads(row[9]) if row[9] else [],
                    'budget': json.loads(row[10]) if row[10] else []
                })
            return designs
        except Exception as err:
            print(f"[DB ERROR] get_designs_by_user failed: {err}")
            return []
        finally:
            conn.close()

db = Database()
