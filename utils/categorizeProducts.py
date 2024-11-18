import pymongo
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client['smart_expiry_db']
collection = db['products']

# Fetch products from MongoDB
products = list(collection.find())
df = pd.DataFrame(products)

# Use sales and expiry date to categorize
# Example logic: you can expand the features for categorization
X = df[['sales', 'expiryDate']]  # Assuming 'sales' and 'expiryDate' are columns

# Using KMeans for categorization (You can modify this logic)
kmeans = KMeans(n_clusters=3)
df['category'] = kmeans.fit_predict(X)

# Update category back to MongoDB
for index, row in df.iterrows():
    collection.update_one({'_id': row['_id']}, {'$set': {'category': row['category']}})
