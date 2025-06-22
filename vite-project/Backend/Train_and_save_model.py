# backend/train_and_save_model.py
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib # To save the model and scaler

print("Loading data and training your Logistic Regression model...")

try:
    df = pd.read_csv("diabetes.csv")
except FileNotFoundError:
    print("Error: diabetes.csv not found!")
    print("Please ensure 'diabetes.csv' is in the same directory as this script (backend/ folder).")
    exit() 

x = df.drop("Outcome", axis=1)
y = df['Outcome']              


feature_names = x.columns.tolist()
print(f"Detected Features (order matters!): {feature_names}")


scaler = StandardScaler()
x_scale = scaler.fit_transform(x)


x_train, x_test, y_train, y_test = train_test_split(x_scale, y, test_size=0.2, random_state=42) # Added random_state for reproducibility


model = LogisticRegression()
model.fit(x_train, y_train)

print(f"Model accuracy on test set: {model.score(x_test, y_test):.4f}")

joblib.dump(model, 'logistic_regression_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("\nModel (logistic_regression_model.pkl) and Scaler (scaler.pkl) saved successfully!")
print("Now, make sure your 'app.py' has the correct FEATURE_ORDER based on these features:")
print(f"FEATURE_ORDER = {feature_names}")
print("\nThen, proceed to Step 3 to run the Flask API.")