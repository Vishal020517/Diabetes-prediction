# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS # Used to handle cross-origin requests from your React app
import joblib # For loading your saved model and scaler
import numpy as np
import pandas as pd # Essential for creating DataFrame to ensure consistent feature order

app = Flask(__name__)
CORS(app) # Enable CORS for all routes. This allows your React app (e.g., on localhost:3000)
          # to make requests to this Flask app (e.g., on localhost:5000).

# --- Define Paths for your saved model and scaler ---
MODEL_PATH = 'logistic_regression_model.pkl'
SCALER_PATH = 'scaler.pkl'

# --- Load the trained model and scaler when the Flask app starts ---
model = None
scaler = None
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print(f"Model ({MODEL_PATH}) and scaler ({SCALER_PATH}) loaded successfully!")
except FileNotFoundError:
    print(f"Error: Model or scaler file not found at {MODEL_PATH} or {SCALER_PATH}.")
    print("Please ensure 'logistic_regression_model.pkl' and 'scaler.pkl' are in the 'backend' folder.")
    print("Did you run 'python train_and_save_model.py' first?")
except Exception as e:
    print(f"An unexpected error occurred while loading model or scaler: {e}")
    # Consider raising the exception if the app absolutely cannot function without these

# --- Define the exact order of features your model was trained on ---
# This is CRUCIAL. The order here MUST match the column order in your diabetes.csv
# excluding the 'Outcome' column, and must match the 'name' attributes in your React form inputs.
FEATURE_ORDER = [
    'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
]

# --- Home route for basic API check ---
@app.route('/')
def home():
    """A simple route to confirm the API is running."""
    return "Welcome to the Diabetes Prediction API! Send POST requests to /predict."

# --- Prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives user input, makes a diabetes prediction using the loaded ML model,
    and returns the result.
    """
    # 1. Check if model and scaler were loaded successfully
    if model is None or scaler is None:
        return jsonify({'error': 'Prediction service is not ready. Model or scaler could not be loaded.'}), 500

    try:
        # 2. Get JSON data from the incoming request (sent from React frontend)
        data = request.get_json(force=True) # force=True allows parsing even without correct Content-Type header

        # 3. Input Validation: Check if all required features are present
        missing_keys = [key for key in FEATURE_ORDER if key not in data or data[key] is None]
        if missing_keys:
            return jsonify({'error': 'Missing required input features', 'missing': missing_keys}), 400

        # 4. Data Preparation: Convert input values to correct types and format for the model
        input_values = []
        for feature in FEATURE_ORDER:
            try:
                # Attempt to convert to float. If not possible, it's invalid input.
                input_values.append(float(data[feature]))
            except (ValueError, TypeError):
                return jsonify({'error': f'Invalid data type for feature "{feature}". Expected a number.'}), 400

        # Create a Pandas DataFrame from the input values.
        # This step is vital to ensure the feature order and structure matches what the scaler and model expect.
        input_df = pd.DataFrame([input_values], columns=FEATURE_ORDER)

        # 5. Preprocessing: Apply the SAME scaler used during model training
        input_scaled = scaler.transform(input_df)

        # 6. Prediction: Use the loaded model to make a prediction
        # predict_proba returns probabilities for each class [prob_class_0, prob_class_1]
        prediction_proba = model.predict_proba(input_scaled)[:, 1] # Get probability of diabetes (class 1)
        prediction_class = model.predict(input_scaled)[0] # Get the predicted class (0 or 1)

        # 7. Prepare Response: Construct the result to send back to the frontend
        message = "High risk of diabetes. It's strongly recommended to consult a healthcare professional for further evaluation." \
                  if prediction_class == 1 \
                  else "Low risk of diabetes. Continue to maintain a healthy lifestyle."

        result = {
            'prediction_probability': float(prediction_proba[0]), # Convert numpy float to standard Python float
            'prediction_class': int(prediction_class), # Convert numpy int to standard Python int
            'message': message
        }

        return jsonify(result), 200 # Return the result as JSON with a 200 OK status

    except Exception as e:
        # Catch any unexpected errors that occur during the prediction process
        print(f"An unhandled error occurred during prediction: {str(e)}")
        # Log the full traceback in a production environment for better debugging
        return jsonify({'error': f'An internal server error occurred. Please try again later. Details: {str(e)}'}), 500

# --- Run the Flask application ---
if __name__ == '__main__':
    # 'debug=True' provides helpful error messages in development, but should be 'False' in production.
    # 'port=5000' is where your Flask app will listen. Ensure it doesn't conflict with other services.
    app.run(debug=True, port=5000)