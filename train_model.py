import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pymongo
import joblib

# Load the dataset for training (dataset.json)
with open('dataset.json', 'r') as file:
    dataset = json.load(file)

# Prepare the data for training
df = pd.DataFrame(dataset)
X = df[['price', 'stock', 'sales']]  # Features for training
y = df['category']  # Target (category) for training

# Encode the target labels (category) for model training
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Train-test split for evaluation (using 80% for training and 20% for testing)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train a RandomForestClassifier model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model on the test set
y_pred = model.predict(X_test)
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the trained model and label encoder
joblib.dump(model, 'product_category_model.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')

# Load the test dataset (test.json) for predictions
with open('test.json', 'r') as file:
    test_data = json.load(file)

# Prepare the test data
test_df = pd.DataFrame(test_data)
X_test_final = test_df[['price', 'stock', 'sales']]  # Features for testing

# Predict the categories for the test dataset
predicted_categories = model.predict(X_test_final)

# Decode the predicted categories
decoded_categories = label_encoder.inverse_transform(predicted_categories)

# Add the predicted category column to the test dataset
test_df['category'] = decoded_categories

# Save the final dataset with predicted categories
final_dataset_path = 'final_test_with_categories.json'
test_df.to_json(final_dataset_path, orient='records', lines=True)
print(f"Final dataset with predicted categories saved to '{final_dataset_path}'.")

# MongoDB Atlas connection setup
client = pymongo.MongoClient("mongodb+srv://admin:admin123@cluster0.zhv4b.mongodb.net/")
db = client['smart_expiry_db']
collection = db['products']

# Insert the final dataset into MongoDB
final_data = test_df.to_dict(orient='records')
collection.insert_many(final_data)
print(f"Final data inserted into MongoDB Atlas under the 'products' collection.")

