from flask import Flask, request, jsonify
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from cosine_similarity import cosine_similarity
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
        return jsonify({'message': 'Login successful', 'fillPreferences': False,'userId': user_id}), 200
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
        
@app.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                p.price, 
                p.image_url,
                GROUP_CONCAT(i.interest_name) AS categories
            FROM 
                Products p
            JOIN 
                productinterests pi ON p.product_id = pi.product_id
            JOIN 
                interests i ON pi.interest_id = i.interest_id
            GROUP BY 
                p.product_id;
        """)
        products = cursor.fetchall()
        return jsonify(products)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("""SELECT interest_name FROM interests;""");
        interests_list = cursor.fetchall()
        
        
        # Convert to list of interest names
        categories = [item['interest_name'] for item in interests_list]
        print(categories)
        # Get user interests by name
        cursor.execute("""
            SELECT i.interest_name 
            FROM user_interests ui
            JOIN interests i ON ui.interest_id = i.interest_id
            WHERE ui.user_id = %s
        """, (user_id,))
        user_interests = [row['interest_name'] for row in cursor.fetchall()]
        if not user_interests:
            return jsonify({'message': 'No interests found for user'}), 404

        # Convert user interests to a vector
        user_vector = [1 if category in user_interests else 0 for category in categories]
        print(user_vector);
        # Fetch all products and their categories
        cursor.execute("""
            SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                p.price, 
                p.image_url,
                GROUP_CONCAT(i.interest_name) AS categories
            FROM 
                Products p
            JOIN 
                productinterests pi ON p.product_id = pi.product_id
            JOIN 
                interests i ON pi.interest_id = i.interest_id
            GROUP BY 
                p.product_id;
        """)
        products = cursor.fetchall()

        # Convert products' categories to vectors and calculate cosine similarity
        product_scores = []
        for product in products:
            product_categories = product['categories'].split(',')
            product_vector = [1 if category in product_categories else 0 for category in categories]
            similarity = cosine_similarity(user_vector, product_vector)
            print(similarity)
            if similarity > 0:
                product_scores.append((product, similarity))

        # Sort products by similarity and get top 5
        top_products = sorted(product_scores, key=lambda x: x[1], reverse=True)[:5]

        # Extract only product data for response
        top_products_data = [product for product, score in top_products]

        return jsonify(top_products_data)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Server error'}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)
