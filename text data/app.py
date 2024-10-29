# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pickle  # For loading your ML model
# import pymongo  # For MongoDB connection

# app = Flask(__name__)
# CORS(app)

# # Load your pre-trained model
# with open('model.pkl', 'rb') as model_file:
#     model = pickle.load(model_file)

# # MongoDB configuration
# client = pymongo.MongoClient("your_mongodb_uri")  # Replace with your MongoDB URI
# db = client['your_database_name']  # Replace with your MongoDB database name
# collection = db['chat_messages']  # Replace with your MongoDB collection name

# @app.route('/api/classify', methods=['POST'])
# def classify_message():
#     data = request.get_json()
#     text = data.get('text')

#     # Process the text and predict using your model
#     processed_text = preprocess_text(text)  # Add your text preprocessing steps here
#     prediction = model.predict([processed_text])  # Make prediction
#     classification = 'trafficking' if prediction[0] == 1 else 'not trafficking'

#     # Save to MongoDB
#     new_message = {
#         'text': text,
#         'classification': classification
#     }
#     collection.insert_one(new_message)

#     return jsonify({'classification': classification})

# def preprocess_text(text):
#     # Add your text preprocessing logic here (e.g., tokenization, vectorization)
#     return text  # Modify this line based on your preprocessing logic

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from textclass import predict_trafficking

app = Flask(__name__)
CORS(app)

@app.route('/')
def serve_frontend():
    return render_template('index.html')  # Serve the frontend HTML

@app.route('/api/classify', methods=['POST'])
def classify_message():
    data = request.get_json()
    text = data.get('text')

    # Log the input text for debugging
    print(f"Received text for classification: {text}")

    # Classify text using predict_trafficking from textclass.py
    classification = predict_trafficking(text)

    # Log the classification result for debugging
    print(f"Classification result: {classification}")

    return jsonify({'classification': classification})

if __name__ == '__main__':
    app.run(debug=True)




