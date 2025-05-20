from models import db, User, UserForm, Allergy, UserAllergy, MealPlan, Meal, Ingredient, MealIngredient, GroceryItem
from datetime import datetime

def save_user_data(data):
    """
    Saves user-related data from a JSON object into the database.
    
    Args:
        data (dict): A dictionary containing user data with nested structures for
                     user form, allergies, meal plans, meals, ingredients, and grocery items.
    """
    user_data = data['user']
    
    # Save User
    user = User(
        id=user_data['id'],
        name=user_data['name'],
        age=user_data['age'],
        gender=user_data['gender'],
        clerk_user_id=user_data['clerk_user_id'],
        created_at=datetime.fromisoformat(user_data['created_at']),
        updated_at=datetime.fromisoformat(user_data['updated_at'])
    )
    db.session.add(user)
    
    # Save User Form
    user_form_data = user_data['user_form']
    user_form = UserForm(
        user_form_id=user_form_data['user_form_id'],
        user_id=user.id,
        current_weight=user_form_data['current_weight'],
        target_weight=user_form_data['target_weight'],
        height=user_form_data['height'],
        activity_frequency=user_form_data['activity_frequency'],
        created_at=datetime.fromisoformat(user_form_data['created_at']),
        updated_at=datetime.fromisoformat(user_form_data['updated_at'])
    )
    db.session.add(user_form)
    
    # Save User Allergies
    for ua_data in user_data['user_allergies']:
        allergy_data = ua_data['allergy']
        # Check for existing allergy by name
        allergy = Allergy.query.filter_by(allergy_name=allergy_data['allergy_name']).first()
        if not allergy:
            allergy = Allergy(
                allergy_name=allergy_data['allergy_name'],
                created_at=datetime.fromisoformat(allergy_data['created_at']),
                updated_at=datetime.fromisoformat(allergy_data['updated_at'])
            )
            db.session.add(allergy)
        user_allergy = UserAllergy(
            user_allergy_id=ua_data['user_allergy_id'],
            user_id=user.id,
            allergy_id=allergy.allergy_id,
            created_at=datetime.fromisoformat(ua_data['created_at']),
            updated_at=datetime.fromisoformat(ua_data['updated_at'])
        )
        db.session.add(user_allergy)
    
    # Save Meal Plans
    for mp_data in user_data['meal_plans']:
        meal_plan = MealPlan(
            meal_plan_id=mp_data['meal_plan_id'],
            user_id=user.id,
            is_active=mp_data['is_active'],
            created_at=datetime.fromisoformat(mp_data['created_at']),
            updated_at=datetime.fromisoformat(mp_data['updated_at'])
        )
        db.session.add(meal_plan)
        
        # Save Meals
        for meal_data in mp_data['meals']:
            meal = Meal(
                meal_id=meal_data['meal_id'],
                meal_name=meal_data['meal_name'],
                meal_plan_id=meal_plan.meal_plan_id,
                created_at=datetime.fromisoformat(meal_data['created_at']),
                updated_at=datetime.fromisoformat(meal_data['updated_at'])
            )
            db.session.add(meal)
            
            # Save Meal Ingredients
            for mi_data in meal_data['ingredients']:
                ingredient_data = mi_data['ingredient']
                # Check for existing ingredient by name
                ingredient = Ingredient.query.filter_by(ingredient_name=ingredient_data['ingredient_name']).first()
                if not ingredient:
                    ingredient = Ingredient(
                        ingredient_name=ingredient_data['ingredient_name'],
                        calories_per_100=ingredient_data['calories_per_100'],
                        protein_per_100=ingredient_data['protein_per_100'],
                        fat_per_100=ingredient_data['fat_per_100'],
                        carb_per_100=ingredient_data['carb_per_100'],
                        created_at=datetime.fromisoformat(ingredient_data['created_at']),
                        updated_at=datetime.fromisoformat(ingredient_data['updated_at'])
                    )
                    db.session.add(ingredient)
                meal_ingredient = MealIngredient(
                    meal_ingredient_id=mi_data['meal_ingredient_id'],
                    meal_id=meal.meal_id,
                    ingredient_id=ingredient.ingredient_id,
                    quantity=mi_data['quantity'],
                    unit=mi_data['unit'],
                    created_at=datetime.fromisoformat(mi_data['created_at']),
                    updated_at=datetime.fromisoformat(mi_data['updated_at'])
                )
                db.session.add(meal_ingredient)
        
        # Save Grocery Items
        for gi_data in mp_data['grocery_items']:
            grocery_item = GroceryItem(
                grocery_item_id=gi_data['grocery_item_id'],
                name=gi_data['name'],
                quantity=gi_data['quantity'],
                unit=gi_data['unit'],
                meal_plan_id=meal_plan.meal_plan_id,
                created_at=datetime.fromisoformat(gi_data['created_at']),
                updated_at=datetime.fromisoformat(gi_data['updated_at'])
            )
            db.session.add(grocery_item)
    
    # Commit all changes to the database
    db.session.commit()