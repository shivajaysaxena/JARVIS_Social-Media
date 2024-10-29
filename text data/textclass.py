# # -*- coding: utf-8 -*-
# """textClass.ipynb

# Automatically generated by Colab.

# Original file is located at
#     https://colab.research.google.com/drive/1c1Zf9iC2_nKUaFZanDMEIniTzuy7xxLE
# """

# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import accuracy_score, classification_report
# import xgboost as xgb

# # Load the dataset
# file_path = 'data.csv'
# data = pd.read_csv(file_path)

# # Preprocess the data: Text feature and Category label
# X = data['Text']
# y = data['Category']

# # Convert the text data into numerical features using TF-IDF
# vectorizer = TfidfVectorizer(stop_words='english')
# X_transformed = vectorizer.fit_transform(X)

# # Encode the labels (Trafficking = 1, Not Trafficking = 0)
# label_encoder = LabelEncoder()
# y_encoded = label_encoder.fit_transform(y)

# # Split the data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X_transformed, y_encoded, test_size=0.2, random_state=42)

# # Train an XGBoost classifier
# model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
# model.fit(X_train, y_train)

# # Predict on the test set
# y_pred = model.predict(X_test)

# # Evaluate the model
# accuracy = accuracy_score(y_test, y_pred)
# # report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)

# print(f"Accuracy: {accuracy * 100:.2f}%")
# # print("\nClassification Report:\n", report)

# # Function to predict if a statement is trafficking-related
# def predict_trafficking(statement):
#     statement_transformed = vectorizer.transform([statement])
#     prediction = model.predict(statement_transformed)
#     prediction_label = label_encoder.inverse_transform(prediction)
#     return prediction_label[0]

# # Example usage:
# statement = "Can I get some weed, maybe an ounce?"
# print(f"Prediction for the statement: '{statement}' is: {predict_trafficking(statement)}")

import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
import string
import re

# Load the dataset
file_path = 'data2.csv'
data = pd.read_csv(file_path)

# Preprocess the data: Text feature and Category label
def clean_text(text):
    # Lowercase, remove punctuation, and strip whitespace
    text = text.lower()
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text.strip()

X = data['Text'].apply(clean_text)
y = data['Category']

# Convert the text data into numerical features using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 3))  # Use unigrams, bigrams, and trigrams
X_transformed = vectorizer.fit_transform(X)

# Encode the labels (Trafficking = 1, Not Trafficking = 0)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_transformed, y_encoded, test_size=0.2, random_state=42)

# Logistic Regression with hyperparameter tuning
logistic_model = LogisticRegression(max_iter=1000)
logistic_model.fit(X_train, y_train)

# Random Forest with hyperparameter tuning
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Create a voting classifier
voting_model = VotingClassifier(estimators=[('lr', logistic_model), ('rf', rf_model)], voting='soft')
voting_model.fit(X_train, y_train)

# Predict on the test set
y_pred_voting = voting_model.predict(X_test)

# Evaluate the Voting Classifier
accuracy_voting = accuracy_score(y_test, y_pred_voting)
print(f"Voting Classifier Accuracy: {accuracy_voting * 100:.2f}%")
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred_voting))
print("\nClassification Report:\n", classification_report(y_test, y_pred_voting, target_names=label_encoder.classes_))

# Function to predict if a statement is trafficking-related
def predict_trafficking(statement):
    statement_transformed = vectorizer.transform([clean_text(statement)])
    prediction = voting_model.predict(statement_transformed)
    prediction_label = label_encoder.inverse_transform(prediction)
    return prediction_label[0]

# Example usage:
statement = "my name"
print(f"Voting Classifier Prediction for the statement: '{statement}' is: {predict_trafficking(statement)}")