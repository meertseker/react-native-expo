from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import json
from google import genai
from models import db, User, UserForm, Allergy, UserAllergy, MealPlan, Meal, Ingredient, MealIngredient, GroceryItem

def create_app():
    app = Flask(__name__)
    load_dotenv()
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")
    
    return app

app = create_app()

def generate_and_save_meal_plan(user_id):
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")
    
    user_form = user.user_form
    if not user_form:
        raise ValueError("User form not found")
    
    allergies = [ua.allergy.allergy_name for ua in user.user_allergies]
    
    prompt = f"""
    Generate a 7-day meal plan and grocery list in JSON format for a user with the following details:
    - Current weight: {user_form.current_weight} kg
    - Target weight: {user_form.target_weight} kg
    - Height: {user_form.height} cm
    - Activity frequency: {user_form.activity_frequency}
    - Allergies: {', '.join(allergies) if allergies else 'None'}
    
    Please ensure that ingredient names are consistent across the meal plan and grocery list.
    The JSON should have the following structure:
    {{
      "meal_plans": [
        {{
          "day": 1,
          "meals": [
            {{
              "meal_type": "breakfast",
              "name": "Oatmeal with Fruits",
              "ingredients": [
                {{"name": "Rolled Oats", "quantity": 50, "unit": "g"}},
                {{"name": "Banana", "quantity": 1, "unit": "piece"}}
              ]
            }},
            ...
          ]
        }},
        ...
      ],
      "grocery_list": [
        {{"name": "Rolled Oats", "quantity": 350, "unit": "g"}},
        {{"name": "Banana", "quantity": 7, "unit": "pieces"}},
        ...
      ]
    }}
    """
    
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    ai_response = response.text
    
    try:
        meal_data = json.loads(ai_response)
    except json.JSONDecodeError:
        raise ValueError("AI response is not valid JSON")
    
    if 'meal_plans' not in meal_data or 'grocery_list' not in meal_data:
        raise ValueError("Invalid AI response structure")
    
    meal_plan = MealPlan(user_id=user_id, is_active=True)
    db.session.add(meal_plan)
    db.session.flush()
    
    for day_data in meal_data['meal_plans']:
        for meal_info in day_data['meals']:
            meal = Meal(
                meal_name=meal_info['name'],
                meal_type=meal_info['meal_type'],
                day=day_data['day'],
                meal_plan_id=meal_plan.meal_plan_id
            )
            db.session.add(meal)
            db.session.flush()
            
            for ing in meal_info['ingredients']:
                ingredient = Ingredient.query.filter_by(ingredient_name=ing['name']).first()
                if not ingredient:
                    ingredient = Ingredient(ingredient_name=ing['name'])
                    db.session.add(ingredient)
                    db.session.flush()
                
                meal_ingredient = MealIngredient(
                    meal_id=meal.meal_id,
                    ingredient_id=ingredient.ingredient_id,
                    quantity=ing['quantity'],
                    unit=ing['unit']
                )
                db.session.add(meal_ingredient)
    
    for grocery in meal_data['grocery_list']:
        grocery_item = GroceryItem(
            name=grocery['name'],
            quantity=grocery['quantity'],
            unit=grocery['unit'],
            meal_plan_id=meal_plan.meal_plan_id
        )
        db.session.add(grocery_item)
    
    db.session.commit()

@app.route('/chatbot', methods=['GET'])
def chatbot():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    prompt = "What is the capital of France?"
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    return response.text

@app.route('/saveUserMealPlanForm', methods=['POST'])
def save_user_meal_plan_form():
    try:
        data = request.get_json()
        
        required_fields = ['user', 'form', 'allergies']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        with db.session.begin_nested():
            user_data = data['user']
            clerk_user_id = user_data.get('clerk_user_id')
            
            if not clerk_user_id:
                return jsonify({"error": "clerk_user_id is required"}), 400

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

            form_data = data['form']
            user_form = UserForm.query.filter_by(user_id=user.id).first()
            if user_form:
                user_form.current_weight = form_data['current_weight']
                user_form.target_weight = form_data['target_weight']
                user_form.height = form_data['height']
                user_form.activity_frequency = form_data['activity_frequency']
            else:
                user_form = UserForm(
                    user_id=user.id,
                    current_weight=form_data['current_weight'],
                    target_weight=form_data['target_weight'],
                    height=form_data['height'],
                    activity_frequency=form_data['activity_frequency']
                )
                db.session.add(user_form)

            current_allergies = {a.allergy_name for a in user.user_allergies}
            submitted_allergies = set(data['allergies'])

            for allergy_name in submitted_allergies - current_allergies:
                allergy = Allergy.query.filter_by(allergy_name=allergy_name).first()
                if not allergy:
                    allergy = Allergy(allergy_name=allergy_name)
                    db.session.add(allergy)
                    db.session.flush()
                
                user_allergy = UserAllergy(user_id=user.id, allergy_id=allergy.allergy_id)
                db.session.add(user_allergy)

            for allergy_name in current_allergies - submitted_allergies:
                allergy = Allergy.query.filter_by(allergy_name=allergy_name).first()
                if allergy:
                    UserAllergy.query.filter_by(
                        user_id=user.id, 
                        allergy_id=allergy.allergy_id
                    ).delete()

        db.session.commit()
        
        try:
            generate_and_save_meal_plan(user.id)
            return jsonify({
                "message": "User data and meal plan saved successfully",
                "user_id": user.id,
                "form_id": user_form.user_form_id
            }), 200
        except Exception as e:
            print(f"Error generating meal plan: {e}")
            return jsonify({
                "message": "User data saved, but meal plan generation failed",
                "user_id": user.id,
                "form_id": user_form.user_form_id,
                "error": str(e)
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