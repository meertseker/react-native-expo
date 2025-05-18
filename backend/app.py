from flask import request, jsonify, Flask
from google import genai
import os
from dotenv import load_dotenv
from models import db, User, UserForm, Allergy, UserAllergy  # Adjust import path


def create_app():
    app = Flask(__name__)
    load_dotenv()
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Configure Gemini AI
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")
    
    return app

app = create_app()

@app.route('/chatbot', methods=['GET'])
def chatbot():
    prompt = "What is the capital of France?"
    response = client.models.generate_content(
    model="gemini-2.0-flash", contents=prompt
)
    return response.text


@app.route('/saveUserMealPlanForm', methods=['POST'])
def save_user_meal_plan_form():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user', 'form', 'allergies']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Start transaction
        with db.session.begin_nested():
            # 1. Handle User Data
            user_data = data['user']
            clerk_user_id = user_data.get('clerk_user_id')
            
            if not clerk_user_id:
                return jsonify({"error": "clerk_user_id is required"}), 400

            # Find or create user
            user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
            if not user:
                user = User(
                    name=user_data['name'],
                    age=user_data.get('age'),
                    gender=user_data.get('gender'),
                    clerk_user_id=clerk_user_id
                )
                db.session.add(user)
                db.session.flush()

            # 2. Handle User Form
            form_data = data['form']
            user_form = UserForm.query.filter_by(user_id=user.id).first()
            if user_form:
                # Update existing form
                user_form.current_weight = form_data['current_weight']
                user_form.target_weight = form_data['target_weight']
                user_form.height = form_data['height']
                user_form.activity_frequency = form_data['activity_frequency']
            else:
                # Create new form
                user_form = UserForm(
                    user_id=user.id,
                    current_weight=form_data['current_weight'],
                    target_weight=form_data['target_weight'],
                    height=form_data['height'],
                    activity_frequency=form_data['activity_frequency']
                )
                db.session.add(user_form)

            # 3. Handle Allergies
            current_allergies = {a.allergy_name for a in user.user_allergies}
            submitted_allergies = set(data['allergies'])

            # Add new allergies
            for allergy_name in submitted_allergies - current_allergies:
                allergy = Allergy.query.filter_by(allergy_name=allergy_name).first()
                if not allergy:
                    allergy = Allergy(allergy_name=allergy_name)
                    db.session.add(allergy)
                    db.session.flush()
                
                user_allergy = UserAllergy(user_id=user.id, allergy_id=allergy.allergy_id)
                db.session.add(user_allergy)

            # Remove old allergies
            for allergy_name in current_allergies - submitted_allergies:
                allergy = Allergy.query.filter_by(allergy_name=allergy_name).first()
                if allergy:
                    UserAllergy.query.filter_by(
                        user_id=user.id, 
                        allergy_id=allergy.allergy_id
                    ).delete()

        db.session.commit()
        return jsonify({
            "message": "User data saved successfully",
            "user_id": user.id,
            "form_id": user_form.user_form_id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/createMealPlan', methods=['POST'])
def create_meal_plan():
    return "Meal plan created successfully!"


@app.route('/ali')
def ali():
    return 'Hello, Ali!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

