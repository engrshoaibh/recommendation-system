from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'recommendation_db'
}

def get_user_profiles():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT UserID, Interests FROM Users")
    user_profiles = cursor.fetchall()
    cursor.close()
    conn.close()
    return pd.DataFrame(user_profiles)

def get_item_profiles():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT ItemID, Description FROM Products")
    item_profiles = cursor.fetchall()
    cursor.close()
    conn.close()
    return pd.DataFrame(item_profiles)

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = request.json['user_id']
    user_profiles = get_user_profiles()
    item_profiles = get_item_profiles()

    vectorizer = TfidfVectorizer()
    user_tfidf = vectorizer.fit_transform(user_profiles['Interests'])
    item_tfidf = vectorizer.transform(item_profiles['Description'])

    user_interests = user_profiles[user_profiles['UserID'] == user_id]['Interests'].iloc[0]
    user_vector = vectorizer.transform([user_interests])
    similarity = cosine_similarity(user_vector, item_tfidf).flatten()
    recommendations = item_profiles.iloc[similarity.argsort()[-3:][::-1]]
    
    return jsonify(recommendations.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
