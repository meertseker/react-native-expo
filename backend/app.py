from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import json
import re
from datetime import datetime, date
import google.generativeai as genai
from google.cloud import vision
import base64
import requests
from models import db, User, UserForm, Allergy, UserAllergy, MealPlan, Meal, Ingredient, MealIngredient, GroceryItem, ConsumedMeal, FoodRecognition, DailyNutrition
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    load_dotenv()
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app, resources={r"/*": {"origins": ["https://fgqhs80-anonymous-8081.exp.direct", "http://localhost:8081", "*"]}})
    db.init_app(app)
    
    with app.app_context():
        # Only create tables if they don't exist - DON'T drop existing data
        db.create_all()
        print("Database tables initialized successfully.")
    
    return app

app = create_app()

def generate_and_save_meal_plan(user_id):
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")
    
    user_form = user.user_form
    if not user_form:
        raise ValueError("User form not found")
    
    # Correctly access allergy_name through the allergy relationship
    allergies = [ua.allergy.allergy_name for ua in user.user_allergies]
    
    prompt = f"""
    Please generate a 7-day meal plan and grocery list based on the following user details:
    - Current weight: {user_form.current_weight} kg
    - Target weight: {user_form.target_weight} kg
    - Height: {user_form.height} cm
    - Activity frequency: {user_form.activity_frequency}
    - Allergies: {', '.join(allergies) if allergies else 'None'}
    
    Return only a valid JSON object with the following structure:
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
    Do not include any text outside of the JSON object. The response must be a valid JSON object only.
    """
    
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    ai_response = response.text
    print(f"AI Response: {ai_response}")  # Log the response
    
    # Extract JSON if necessary
    json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            meal_data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error after extraction: {e}")
            raise ValueError("Extracted AI response is not valid JSON")
    else:
        raise ValueError("No JSON object found in AI response")
    
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
                meal_plan_id=meal_plan.meal_plan_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(meal)
            db.session.flush()
            
            for ing in meal_info['ingredients']:
                ingredient = Ingredient.query.filter_by(ingredient_name=ing['name']).first()
                if not ingredient:
                    ingredient = Ingredient(
                        ingredient_name=ing['name'],
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.session.add(ingredient)
                    db.session.flush()
                
                meal_ingredient = MealIngredient(
                    meal_id=meal.meal_id,
                    ingredient_id=ingredient.ingredient_id,
                    quantity=ing['quantity'],
                    unit=ing['unit'],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.session.add(meal_ingredient)
    
    for grocery in meal_data['grocery_list']:
        grocery_item = GroceryItem(
            name=grocery['name'],
            quantity=grocery['quantity'],
            unit=grocery['unit'],
            meal_plan_id=meal_plan.meal_plan_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(grocery_item)
    
    db.session.commit()

def analyze_food_image(image_base64):
    """Analyze food image using Google Generative AI for food recognition and calorie estimation"""
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        
        prompt = """
        Analyze this food image and provide detailed nutritional information. Return ONLY a valid JSON object with this exact structure:
        {
          "foods": [
            {
              "name": "Food name",
              "confidence": 0.95,
              "estimated_quantity": 150,
              "unit": "grams",
              "calories": 250,
              "protein": 15.5,
              "carbs": 30.2,
              "fat": 8.1,
              "fiber": 3.2
            }
          ],
          "total_calories": 250,
          "meal_description": "Brief description of the meal"
        }
        
        Be as accurate as possible with portion size estimation. If multiple foods are visible, list each separately.
        Return only the JSON object, no additional text.
        """
        
        # Create the image part for the API
        image_part = {
            "mime_type": "image/jpeg",
            "data": image_data
        }
        
        response = model.generate_content([prompt, image_part])
        ai_response = response.text
        
        print(f"Food Recognition Response: {ai_response}")
        
        # Extract JSON if necessary
        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            try:
                result = json.loads(json_str)
                return result
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                return None
        else:
            return None
            
    except Exception as e:
        print(f"Error analyzing food image: {e}")
        return None

def update_daily_nutrition(user_id, consumed_meal):
    """Update daily nutrition totals for a user"""
    try:
        today = date.today()
        
        # Get or create daily nutrition record
        daily_nutrition = DailyNutrition.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()
        
        if not daily_nutrition:
            # Calculate target calories based on user form
            user = User.query.get(user_id)
            target_calories = 2000  # Default
            if user and user.user_form:
                # Simple BMR calculation (can be enhanced)
                form = user.user_form
                if user.gender == 'male':
                    bmr = 88.362 + (13.397 * form.current_weight) + (4.799 * form.height) - (5.677 * (user.age or 25))
                else:
                    bmr = 447.593 + (9.247 * form.current_weight) + (3.098 * form.height) - (4.330 * (user.age or 25))
                
                # Apply activity multiplier
                activity_multipliers = {
                    'sedentary': 1.2,
                    'light': 1.375,
                    'moderate': 1.55,
                    'active': 1.725,
                    'very_active': 1.9
                }
                multiplier = activity_multipliers.get(form.activity_frequency, 1.5)
                target_calories = bmr * multiplier
            
            daily_nutrition = DailyNutrition(
                user_id=user_id,
                date=today,
                target_calories=target_calories,
                target_protein=target_calories * 0.3 / 4,  # 30% protein
                target_carbs=target_calories * 0.4 / 4,    # 40% carbs
                target_fat=target_calories * 0.3 / 9       # 30% fat
            )
            db.session.add(daily_nutrition)
        
        # Update totals
        daily_nutrition.total_calories += consumed_meal.calories
        daily_nutrition.total_protein += consumed_meal.protein or 0
        daily_nutrition.total_carbs += consumed_meal.carbs or 0
        daily_nutrition.total_fat += consumed_meal.fat or 0
        daily_nutrition.total_fiber += consumed_meal.fiber or 0
        daily_nutrition.meals_consumed += 1
        daily_nutrition.updated_at = datetime.utcnow()
        
        db.session.commit()
        return daily_nutrition
        
    except Exception as e:
        print(f"Error updating daily nutrition: {e}")
        db.session.rollback()
        return None

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_input = data.get('userInput')
        clerk_user_id = data.get('clerk_user_id')  # Optional, to fetch user context
        
        if not user_input:
            return jsonify({"error": "Missing userInput field"}), 400

        # Configure Gemini AI
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Fetch user context if clerk_user_id is provided
        user_context = ""
        if clerk_user_id:
            user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
            if user and user.user_form:
                user_form = user.user_form
                allergies = [ua.allergy.allergy_name for ua in user.user_allergies]
                user_context = f"""
                User details:
                - Current weight: {user_form.current_weight} kg
                - Target weight: {user_form.target_weight} kg
                - Height: {user_form.height} cm
                - Activity frequency: {user_form.activity_frequency}
                - Allergies: {', '.join(allergies) if allergies else 'None'}
                """

        # Construct prompt
        prompt = f"""
        You are GainAI, a meal planning assistant. Respond to the user's message: "{user_input}"
        {user_context}
        
        If the user asks for a recipe or meal suggestion, return a JSON object with the following structure:
        {{
          "name": "Recipe Name",
          "prepTime": "30 minutes",
          "difficulty": "Easy",
          "tags": ["Vegan", "Quick"]
        }}
        
        For general conversation or if no recipe is requested, return a plain text response in Turkish.
        If appropriate, include a JSON array of up to 3 response options for the user to select, like:
        {{
          "text": "Your response text here",
          "options": ["Option 1", "Option 2", "Option 3"]
        }}
        
        Return only the JSON object or plain text response. Do not include markdown or extra text.
        """
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        ai_response = response.text
        print(f"AI Response: {ai_response}")

        # Try to parse as JSON
        try:
            response_data = json.loads(ai_response)
            return jsonify(response_data), 200
        except json.JSONDecodeError:
            # If not JSON, return as plain text
            return jsonify({"text": ai_response}), 200

    except Exception as e:
        print(f"Error in chatbot: {e}")
        return jsonify({"text": "Bağlantı hatası. Lütfen daha sonra tekrar deneyin."}), 500

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
                    clerk_user_id=clerk_user_id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
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
                user_form.updated_at = datetime.utcnow()
            else:
                user_form = UserForm(
                    user_id=user.id,
                    current_weight=form_data['current_weight'],
                    target_weight=form_data['target_weight'],
                    height=form_data['height'],
                    activity_frequency=form_data['activity_frequency'],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.session.add(user_form)

            current_allergies = {ua.allergy.allergy_name for ua in user.user_allergies}
            submitted_allergies = set(data['allergies'])

            for allergy_name in submitted_allergies - current_allergies:
                allergy = Allergy.query.filter_by(allergy_name=allergy_name).first()
                if not allergy:
                    allergy = Allergy(
                        allergy_name=allergy_name,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.session.add(allergy)
                    db.session.flush()
                
                user_allergy = UserAllergy(
                    user_id=user.id,
                    allergy_id=allergy.allergy_id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
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
        print(f"Error saving user data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/createMealPlan', methods=['POST'])
def create_meal_plan():
    return jsonify({"message": "Meal plan created successfully!"}), 200

@app.route('/ali')
def ali():
    return 'Hello, Ali!'

@app.route('/getMealPlan', methods=['POST'])
def get_meal_plan():
    try:
        data = request.get_json()
        clerk_user_id = data.get('clerk_user_id')
        
        if not clerk_user_id:
            return jsonify({"error": "clerk_user_id is required"}), 400
            
        # Find the user
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Get the active meal plan for this user
        meal_plan = MealPlan.query.filter_by(user_id=user.id, is_active=True).first()
        if not meal_plan:
            return jsonify({"error": "No active meal plan found for this user"}), 404
        
        # Structure the meal plan data
        result = {
            "meal_plan": {
                "meal_plan_id": meal_plan.meal_plan_id,
                "created_at": meal_plan.created_at.isoformat() if meal_plan.created_at else None,
                "days": []
            },
            "grocery_list": []
        }
        
        # Get all meals for this plan, organized by day
        meals = Meal.query.filter_by(meal_plan_id=meal_plan.meal_plan_id).all()
        days = {}
        
        for meal in meals:
            if meal.day not in days:
                days[meal.day] = []
            
            meal_data = {
                "meal_id": meal.meal_id,
                "meal_type": meal.meal_type,
                "meal_name": meal.meal_name,
                "ingredients": []
            }
            
            # Get ingredients for this meal
            meal_ingredients = MealIngredient.query.filter_by(meal_id=meal.meal_id).all()
            for mi in meal_ingredients:
                ingredient = Ingredient.query.get(mi.ingredient_id)
                if ingredient:
                    meal_data["ingredients"].append({
                        "ingredient_id": ingredient.ingredient_id,
                        "ingredient_name": ingredient.ingredient_name,
                        "quantity": mi.quantity,
                        "unit": mi.unit
                    })
            
            days[meal.day].append(meal_data)
        
        # Convert days dict to list sorted by day number
        for day_num in sorted(days.keys()):
            result["meal_plan"]["days"].append({
                "day": day_num,
                "meals": days[day_num]
            })
        
        # Get grocery items
        grocery_items = GroceryItem.query.filter_by(meal_plan_id=meal_plan.meal_plan_id).all()
        for item in grocery_items:
            result["grocery_list"].append({
                "grocery_id": item.grocery_item_id,
                "name": item.name,
                "quantity": item.quantity,
                "unit": item.unit
            })
        
        return jsonify(result), 200
    
    except Exception as e:
        print(f"Error fetching meal plan: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/scanMeal', methods=['POST'])
def scan_meal():
    """Scan and analyze a meal image"""
    try:
        data = request.get_json()
        
        required_fields = ['clerk_user_id', 'image_base64']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        clerk_user_id = data['clerk_user_id']
        image_base64 = data['image_base64']
        meal_type = data.get('meal_type', 'unknown')
        
        # Find user
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Analyze image with AI
        analysis_result = analyze_food_image(image_base64)
        if not analysis_result:
            return jsonify({"error": "Failed to analyze food image"}), 400
        
        # Create consumed meal record
        consumed_meal = ConsumedMeal(
            user_id=user.id,
            meal_name=analysis_result.get('meal_description', 'Scanned Meal'),
            meal_type=meal_type,
            calories=analysis_result.get('total_calories', 0),
            protein=sum(food.get('protein', 0) for food in analysis_result.get('foods', [])),
            carbs=sum(food.get('carbs', 0) for food in analysis_result.get('foods', [])),
            fat=sum(food.get('fat', 0) for food in analysis_result.get('foods', [])),
            fiber=sum(food.get('fiber', 0) for food in analysis_result.get('foods', [])),
            recognition_confidence=analysis_result.get('foods', [{}])[0].get('confidence', 0) if analysis_result.get('foods') else 0,
            source='scan'
        )
        db.session.add(consumed_meal)
        db.session.flush()
        
        # Create food recognition records
        for food in analysis_result.get('foods', []):
            food_recognition = FoodRecognition(
                consumed_meal_id=consumed_meal.consumed_meal_id,
                food_name=food.get('name', 'Unknown Food'),
                confidence_score=food.get('confidence', 0),
                estimated_quantity=food.get('estimated_quantity'),
                estimated_unit=food.get('unit'),
                calories_per_serving=food.get('calories')
            )
            db.session.add(food_recognition)
        
        db.session.commit()
        
        # Update daily nutrition
        daily_nutrition = update_daily_nutrition(user.id, consumed_meal)
        
        # Return response
        response_data = {
            "success": True,
            "consumed_meal_id": consumed_meal.consumed_meal_id,
            "analysis": analysis_result,
            "nutrition_summary": {
                "calories": consumed_meal.calories,
                "protein": consumed_meal.protein,
                "carbs": consumed_meal.carbs,
                "fat": consumed_meal.fat,
                "fiber": consumed_meal.fiber
            }
        }
        
        if daily_nutrition:
            response_data["daily_progress"] = {
                "total_calories": daily_nutrition.total_calories,
                "target_calories": daily_nutrition.target_calories,
                "calories_remaining": (daily_nutrition.target_calories or 0) - daily_nutrition.total_calories,
                "meals_consumed": daily_nutrition.meals_consumed
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error scanning meal: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/getDailyNutrition', methods=['POST'])
def get_daily_nutrition():
    """Get daily nutrition progress for a user"""
    try:
        data = request.get_json()
        clerk_user_id = data.get('clerk_user_id')
        target_date = data.get('date')  # YYYY-MM-DD format, defaults to today
        
        if not clerk_user_id:
            return jsonify({"error": "clerk_user_id is required"}), 400
        
        # Find user
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Parse date
        if target_date:
            try:
                query_date = datetime.strptime(target_date, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        else:
            query_date = date.today()
        
        # Get daily nutrition
        daily_nutrition = DailyNutrition.query.filter_by(
            user_id=user.id,
            date=query_date
        ).first()
        
        # Get consumed meals for the day
        consumed_meals = ConsumedMeal.query.filter(
            ConsumedMeal.user_id == user.id,
            db.func.date(ConsumedMeal.consumed_at) == query_date
        ).all()
        
        # Prepare response
        response_data = {
            "date": query_date.isoformat(),
            "nutrition": {
                "total_calories": daily_nutrition.total_calories if daily_nutrition else 0,
                "total_protein": daily_nutrition.total_protein if daily_nutrition else 0,
                "total_carbs": daily_nutrition.total_carbs if daily_nutrition else 0,
                "total_fat": daily_nutrition.total_fat if daily_nutrition else 0,
                "total_fiber": daily_nutrition.total_fiber if daily_nutrition else 0,
                "target_calories": daily_nutrition.target_calories if daily_nutrition else 2000,
                "target_protein": daily_nutrition.target_protein if daily_nutrition else 150,
                "target_carbs": daily_nutrition.target_carbs if daily_nutrition else 200,
                "target_fat": daily_nutrition.target_fat if daily_nutrition else 67,
                "meals_consumed": daily_nutrition.meals_consumed if daily_nutrition else 0
            },
            "consumed_meals": []
        }
        
        # Add consumed meals details
        for meal in consumed_meals:
            meal_data = {
                "consumed_meal_id": meal.consumed_meal_id,
                "meal_name": meal.meal_name,
                "meal_type": meal.meal_type,
                "calories": meal.calories,
                "protein": meal.protein,
                "carbs": meal.carbs,
                "fat": meal.fat,
                "fiber": meal.fiber,
                "consumed_at": meal.consumed_at.isoformat(),
                "source": meal.source,
                "recognition_confidence": meal.recognition_confidence
            }
            response_data["consumed_meals"].append(meal_data)
        
        # Calculate progress percentages
        nutrition = response_data["nutrition"]
        response_data["progress"] = {
            "calories_percent": min((nutrition["total_calories"] / nutrition["target_calories"]) * 100, 100) if nutrition["target_calories"] > 0 else 0,
            "protein_percent": min((nutrition["total_protein"] / nutrition["target_protein"]) * 100, 100) if nutrition["target_protein"] > 0 else 0,
            "carbs_percent": min((nutrition["total_carbs"] / nutrition["target_carbs"]) * 100, 100) if nutrition["target_carbs"] > 0 else 0,
            "fat_percent": min((nutrition["total_fat"] / nutrition["target_fat"]) * 100, 100) if nutrition["target_fat"] > 0 else 0,
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error getting daily nutrition: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/logMealManually', methods=['POST'])
def log_meal_manually():
    """Manually log a meal without scanning"""
    try:
        data = request.get_json()
        
        required_fields = ['clerk_user_id', 'meal_name', 'calories']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        clerk_user_id = data['clerk_user_id']
        
        # Find user
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Create consumed meal record
        consumed_meal = ConsumedMeal(
            user_id=user.id,
            meal_name=data['meal_name'],
            meal_type=data.get('meal_type', 'unknown'),
            calories=data['calories'],
            protein=data.get('protein', 0),
            carbs=data.get('carbs', 0),
            fat=data.get('fat', 0),
            fiber=data.get('fiber', 0),
            source='manual'
        )
        db.session.add(consumed_meal)
        db.session.commit()
        
        # Update daily nutrition
        daily_nutrition = update_daily_nutrition(user.id, consumed_meal)
        
        response_data = {
            "success": True,
            "consumed_meal_id": consumed_meal.consumed_meal_id,
            "message": "Meal logged successfully"
        }
        
        if daily_nutrition:
            response_data["daily_progress"] = {
                "total_calories": daily_nutrition.total_calories,
                "target_calories": daily_nutrition.target_calories,
                "calories_remaining": (daily_nutrition.target_calories or 0) - daily_nutrition.total_calories
            }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error logging meal manually: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)