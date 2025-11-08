import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

class HealthPerformanceModel:
    """
    Machine Learning model to predict academic performance based on health metrics
    Uses Linear Regression to correlate sleep, stress, and heart rate with quiz scores
    """
    
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = 'health_performance_model.pkl'
        self.scaler_path = 'scaler.pkl'
        
        # Load pre-trained model if exists
        self.load_model()
        
        # If no model exists, train with sample data
        if not self.is_trained:
            self.train_with_sample_data()
    
    def train_with_sample_data(self):
        """Train model with sample data for demonstration"""
        # Sample training data
        # Features: [sleep_hours, stress_level, heart_rate]
        # Target: quiz_score (percentage)
        
        X_train = np.array([
            [8, 3, 70],   # Good sleep, low stress -> high score
            [7, 4, 75],
            [6, 5, 80],
            [5, 7, 85],   # Poor sleep, high stress -> low score
            [4, 8, 90],
            [9, 2, 65],   # Excellent sleep, very low stress -> high score
            [7.5, 3, 72],
            [6.5, 6, 82],
            [5.5, 7, 88],
            [8.5, 2, 68],
            [7, 5, 78],
            [6, 6, 83],
            [5, 8, 92],
            [8, 4, 73],
            [7.5, 4, 74],
            [6.5, 5, 81],
            [9, 1, 63],
            [4.5, 9, 95],
            [8, 3, 71],
            [7, 4, 76]
        ])
        
        y_train = np.array([
            85, 80, 70, 55, 45,  # Scores corresponding to health metrics
            92, 82, 65, 50, 90,
            75, 68, 48, 78, 81,
            72, 95, 40, 84, 79
        ])
        
        # Train the model
        self.train(X_train, y_train)
    
    def train(self, X, y=None):
        """
        Train the model with provided data
        X can be either numpy array or list of dicts
        """
        try:
            # Handle different input formats
            if isinstance(X, list) and len(X) > 0 and isinstance(X[0], dict):
                # Convert list of dicts to numpy array
                X_array = np.array([
                    [d['sleep_hours'], d['stress_level'], d['heart_rate']] 
                    for d in X
                ])
                y_array = np.array([d['score'] for d in X])
            else:
                X_array = np.array(X)
                y_array = np.array(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X_array)
            
            # Train model
            self.model.fit(X_scaled, y_array)
            self.is_trained = True
            
            # Save model
            self.save_model()
            
            return True
        except Exception as e:
            print(f"Training error: {e}")
            return False
    
    def predict(self, features):
        """
        Predict academic performance based on health metrics
        features: dict with keys 'sleep_hours', 'stress_level', 'heart_rate', 'avg_score'
        """
        if not self.is_trained:
            self.train_with_sample_data()
        
        # Prepare features
        X = np.array([[
            features['sleep_hours'],
            features['stress_level'],
            features['heart_rate']
        ]])
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Make prediction
        predicted_score = self.model.predict(X_scaled)[0]
        
        # Ensure score is within valid range
        predicted_score = max(0, min(100, predicted_score))
        
        # Determine category
        if predicted_score >= 80:
            category = 'Excellent'
        elif predicted_score >= 70:
            category = 'Good'
        elif predicted_score >= 60:
            category = 'Average'
        else:
            category = 'Needs Improvement'
        
        # Calculate confidence based on feature quality
        confidence = self.calculate_confidence(features)
        
        return {
            'expected_score': predicted_score,
            'category': category,
            'confidence': confidence
        }
    
    def calculate_confidence(self, features):
        """Calculate prediction confidence based on feature quality"""
        confidence = 100
        
        # Reduce confidence for extreme values
        if features['sleep_hours'] < 5 or features['sleep_hours'] > 10:
            confidence -= 15
        
        if features['stress_level'] > 8:
            confidence -= 20
        
        if features['heart_rate'] < 50 or features['heart_rate'] > 110:
            confidence -= 15
        
        return max(50, confidence)  # Minimum 50% confidence
    
    def save_model(self):
        """Save trained model to disk"""
        try:
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            print("Model saved successfully")
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def load_model(self):
        """Load trained model from disk"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.is_trained = True
                print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.is_trained = False

# Test the model
if __name__ == '__main__':
    model = HealthPerformanceModel()
    
    # Test prediction
    test_features = {
        'sleep_hours': 6,
        'stress_level': 7,
        'heart_rate': 85,
        'avg_score': 65
    }
    
    prediction = model.predict(test_features)
    print(f"\nTest Prediction:")
    print(f"Expected Score: {prediction['expected_score']:.2f}")
    print(f"Category: {prediction['category']}")
    print(f"Confidence: {prediction['confidence']:.2f}%")
