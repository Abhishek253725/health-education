from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from model import HealthPerformanceModel
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize ML model
ml_model = HealthPerformanceModel()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'AI Service is running',
        'model_trained': ml_model.is_trained
    })

@app.route('/analyze', methods=['POST'])
def analyze_student():
    """
    Analyze student health and performance data
    Returns predictions and personalized insights
    """
    try:
        data = request.json
        
        # Extract features
        sleep_hours = data.get('sleepHours', 7)
        stress_level = data.get('stressLevel', 5)
        heart_rate = data.get('heartRate', 75)
        recent_scores = data.get('recentScores', [])
        
        # Prepare features for prediction
        features = {
            'sleep_hours': sleep_hours,
            'stress_level': stress_level,
            'heart_rate': heart_rate,
            'avg_score': np.mean(recent_scores) if recent_scores else 70
        }
        
        # Get prediction
        prediction = ml_model.predict(features)
        
        # Generate insights
        insights = generate_insights(features, prediction)
        
        # Generate recommendations
        recommendations = generate_recommendations(features)
        
        return jsonify({
            'prediction': {
                'expectedScore': round(prediction['expected_score'], 2),
                'performanceCategory': prediction['category'],
                'confidence': round(prediction['confidence'], 2)
            },
            'insights': insights,
            'recommendations': recommendations,
            'healthStatus': assess_health_status(features)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train_model():
    """
    Train the ML model with new data
    """
    try:
        data = request.json
        training_data = data.get('trainingData', [])
        
        if not training_data:
            return jsonify({'error': 'No training data provided'}), 400
        
        ml_model.train(training_data)
        
        return jsonify({
            'message': 'Model trained successfully',
            'samples': len(training_data)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_insights(features, prediction):
    """Generate personalized insights based on data"""
    insights = []
    
    # Sleep analysis
    if features['sleep_hours'] < 6:
        insights.append({
            'type': 'warning',
            'category': 'Sleep',
            'message': f"You're getting only {features['sleep_hours']:.1f} hours of sleep. This may impact your academic performance.",
            'impact': 'High'
        })
    elif features['sleep_hours'] >= 7 and features['sleep_hours'] <= 9:
        insights.append({
            'type': 'success',
            'category': 'Sleep',
            'message': f"Great! You're getting {features['sleep_hours']:.1f} hours of sleep, which is optimal for learning.",
            'impact': 'Positive'
        })
    
    # Stress analysis
    if features['stress_level'] > 7:
        insights.append({
            'type': 'danger',
            'category': 'Stress',
            'message': f"High stress level detected ({features['stress_level']}/10). This could significantly affect your concentration.",
            'impact': 'High'
        })
    elif features['stress_level'] <= 4:
        insights.append({
            'type': 'success',
            'category': 'Stress',
            'message': "Your stress levels are well-managed. Keep up the good work!",
            'impact': 'Positive'
        })
    
    # Heart rate analysis
    if features['heart_rate'] > 100:
        insights.append({
            'type': 'warning',
            'category': 'Heart Rate',
            'message': f"Elevated heart rate detected ({features['heart_rate']} bpm). Consider relaxation techniques.",
            'impact': 'Medium'
        })
    
    # Performance correlation
    if features['sleep_hours'] < 6 and features['avg_score'] < 70:
        insights.append({
            'type': 'info',
            'category': 'Correlation',
            'message': "Low sleep hours may be contributing to lower academic scores. Improving sleep could boost performance by 15-20%.",
            'impact': 'High'
        })
    
    if features['stress_level'] > 7 and features['avg_score'] < 70:
        insights.append({
            'type': 'info',
            'category': 'Correlation',
            'message': "High stress is likely affecting your academic performance. Stress management could improve scores significantly.",
            'impact': 'High'
        })
    
    return insights

def generate_recommendations(features):
    """Generate actionable recommendations"""
    recommendations = []
    
    # Sleep recommendations
    if features['sleep_hours'] < 7:
        recommendations.append({
            'category': 'Sleep',
            'priority': 'High',
            'action': 'Increase sleep duration',
            'details': [
                'Aim for 7-9 hours of sleep per night',
                'Maintain a consistent sleep schedule',
                'Avoid screens 1 hour before bedtime',
                'Create a relaxing bedtime routine'
            ]
        })
    
    # Stress management
    if features['stress_level'] > 6:
        recommendations.append({
            'category': 'Stress Management',
            'priority': 'High',
            'action': 'Reduce stress levels',
            'details': [
                'Practice deep breathing exercises (5 minutes daily)',
                'Take short breaks during study sessions (Pomodoro technique)',
                'Engage in physical activity for 30 minutes daily',
                'Talk to a counselor or trusted adult'
            ]
        })
    
    # Study habits
    if features['avg_score'] < 70:
        recommendations.append({
            'category': 'Study Habits',
            'priority': 'Medium',
            'action': 'Improve study techniques',
            'details': [
                'Use active recall and spaced repetition',
                'Study in 25-minute focused sessions',
                'Create mind maps for complex topics',
                'Form study groups with peers'
            ]
        })
    
    # Physical health
    if features['heart_rate'] > 90:
        recommendations.append({
            'category': 'Physical Health',
            'priority': 'Medium',
            'action': 'Monitor cardiovascular health',
            'details': [
                'Practice relaxation techniques',
                'Stay hydrated throughout the day',
                'Limit caffeine intake',
                'Consult a healthcare provider if symptoms persist'
            ]
        })
    
    # General wellness
    recommendations.append({
        'category': 'General Wellness',
        'priority': 'Low',
        'action': 'Maintain balanced lifestyle',
        'details': [
            'Eat nutritious meals at regular times',
            'Stay socially connected with friends',
            'Pursue hobbies and interests',
            'Practice gratitude and positive thinking'
        ]
    })
    
    return recommendations

def assess_health_status(features):
    """Assess overall health status"""
    score = 100
    issues = []
    
    # Deduct points for health issues
    if features['sleep_hours'] < 6:
        score -= 20
        issues.append('Insufficient sleep')
    elif features['sleep_hours'] < 7:
        score -= 10
    
    if features['stress_level'] > 7:
        score -= 25
        issues.append('High stress')
    elif features['stress_level'] > 5:
        score -= 15
    
    if features['heart_rate'] > 100 or features['heart_rate'] < 60:
        score -= 15
        issues.append('Abnormal heart rate')
    
    # Determine status
    if score >= 80:
        status = 'Excellent'
        color = '#00C9A7'
    elif score >= 60:
        status = 'Good'
        color = '#FFD166'
    elif score >= 40:
        status = 'Fair'
        color = '#FFA500'
    else:
        status = 'Needs Attention'
        color = '#FF6B6B'
    
    return {
        'score': score,
        'status': status,
        'color': color,
        'issues': issues
    }

if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
