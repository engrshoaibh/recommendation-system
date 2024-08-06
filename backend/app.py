from flask import Flask, request, jsonify
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'recommendation_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

def get_db_connection():
    connection = mysql.connector.connect(
        user=app.config['MYSQL_DATABASE_USER'],
        password=app.config['MYSQL_DATABASE_PASSWORD'],
        host=app.config['MYSQL_DATABASE_HOST'],
        database=app.config['MYSQL_DATABASE_DB']
    )
    return connection

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    # Generate hashed password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Insert the new user into the users table
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    if not user:
        return jsonify({'message': 'User not found'}), 400
    
    user_id, user_email, user_password = user
    if bcrypt.check_password_hash(user_password, password):
        cursor.execute("SELECT * FROM user_interests WHERE user_id = %s", (user_id,))
        preferences = cursor.fetchall()
        if not preferences:
            return jsonify({'message': 'Login successful', 'fillPreferences': True, 'userId': user_id}), 200
        return jsonify({'message': 'Login successful', 'fillPreferences': False}), 200
    return jsonify({'message': 'Incorrect password'}), 400


@app.route('/interests', methods=['GET'])
def get_interests():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM interests")
        interests = cursor.fetchall()
        interests_list = [{'interest_id': row[0], 'interest_name': row[1]} for row in interests]
        return jsonify({'success': True, 'data': interests_list}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()
        
@app.route('/user_interests', methods=['POST'])
def save_user_interests():
    data = request.json
    if 'user_id' not in data or 'interests' not in data:
        return jsonify({'success': False, 'message': 'Invalid data format'}), 400

    user_id = data['user_id']
    interests = data['interests']

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Delete existing interests for the user
        cursor.execute("DELETE FROM user_interests WHERE user_id = %s", (user_id,))
        
        # Insert new interests
        for interest_id in interests:
            cursor.execute("INSERT INTO user_interests (user_id, interest_id) VALUES (%s, %s)", (user_id, interest_id))
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Interests saved successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)
