from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    clerk_user_id = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user_form = db.relationship('UserForm', backref='user', uselist=False, cascade='all, delete-orphan')
    user_allergies = db.relationship('UserAllergy', backref='user', lazy=True, cascade='all, delete-orphan')
    meal_plans = db.relationship('MealPlan', backref='user', lazy=True, cascade='all, delete-orphan')
    consumed_meals = db.relationship('ConsumedMeal', backref='user', lazy=True, cascade='all, delete-orphan')
    daily_nutrition = db.relationship('DailyNutrition', backref='user', lazy=True, cascade='all, delete-orphan')

class UserForm(db.Model):
    __tablename__ = 'user_forms'
    
    user_form_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    current_weight = db.Column(db.Float(), nullable=False)
    target_weight = db.Column(db.Float(), nullable=False)
    height = db.Column(db.Float(), nullable=False)
    activity_frequency = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

class Allergy(db.Model):
    __tablename__ = 'allergies'
    
    allergy_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    allergy_name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user_allergies = db.relationship('UserAllergy', backref='allergy', lazy=True, cascade='all, delete-orphan')

class UserAllergy(db.Model):
    __tablename__ = 'user_allergies'
    
    user_allergy_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    allergy_id = db.Column(db.String(36), db.ForeignKey('allergies.allergy_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'allergy_id', name='unique_user_allergy'),)

class MealPlan(db.Model):
    __tablename__ = 'meal_plans'
    
    meal_plan_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    meals = db.relationship('Meal', backref='meal_plan', lazy=True, cascade='all, delete-orphan')
    grocery_items = db.relationship('GroceryItem', backref='meal_plan', lazy=True, cascade='all, delete-orphan')

class Meal(db.Model):
    __tablename__ = 'meals'
    
    meal_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    meal_name = db.Column(db.String(100), nullable=False)
    meal_type = db.Column(db.String(50), nullable=False)  # e.g., breakfast, lunch
    day = db.Column(db.Integer, nullable=False)  # day of the meal plan
    meal_plan_id = db.Column(db.String(36), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    ingredients = db.relationship('MealIngredient', backref='meal', lazy=True, cascade='all, delete-orphan')

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    ingredient_name = db.Column(db.String(100), unique=True, nullable=False)
    calories_per_100 = db.Column(db.Float(), nullable=True)
    protein_per_100 = db.Column(db.Float(), nullable=True)
    fat_per_100 = db.Column(db.Float(), nullable=True)
    carb_per_100 = db.Column(db.Float(), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    meal_ingredients = db.relationship('MealIngredient', backref='ingredient', lazy=True, cascade='all, delete-orphan')

class MealIngredient(db.Model):
    __tablename__ = 'meal_ingredients'
    
    meal_ingredient_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    meal_id = db.Column(db.String(36), db.ForeignKey('meals.meal_id', ondelete='CASCADE'), nullable=False)
    ingredient_id = db.Column(db.String(36), db.ForeignKey('ingredients.ingredient_id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Float(), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('meal_id', 'ingredient_id', name='unique_meal_ingredient'),)

class GroceryItem(db.Model):
    __tablename__ = 'grocery_items'
    
    grocery_item_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float(), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    meal_plan_id = db.Column(db.String(36), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

class ConsumedMeal(db.Model):
    __tablename__ = 'consumed_meals'
    
    consumed_meal_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    meal_name = db.Column(db.String(200), nullable=False)
    meal_type = db.Column(db.String(50), nullable=True)  # breakfast, lunch, dinner, snack
    calories = db.Column(db.Float(), nullable=False)
    protein = db.Column(db.Float(), nullable=True, default=0)
    carbs = db.Column(db.Float(), nullable=True, default=0)
    fat = db.Column(db.Float(), nullable=True, default=0)
    fiber = db.Column(db.Float(), nullable=True, default=0)
    image_url = db.Column(db.String(500), nullable=True)  # URL of the scanned image
    recognition_confidence = db.Column(db.Float(), nullable=True)  # Google Vision API confidence
    source = db.Column(db.String(50), default='scan')  # 'scan', 'manual', 'planned'
    consumed_at = db.Column(db.DateTime(), default=datetime.utcnow)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    food_items = db.relationship('FoodRecognition', backref='consumed_meal', lazy=True, cascade='all, delete-orphan')

class FoodRecognition(db.Model):
    __tablename__ = 'food_recognitions'
    
    recognition_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    consumed_meal_id = db.Column(db.String(36), db.ForeignKey('consumed_meals.consumed_meal_id', ondelete='CASCADE'), nullable=False)
    food_name = db.Column(db.String(200), nullable=False)
    confidence_score = db.Column(db.Float(), nullable=False)
    estimated_quantity = db.Column(db.Float(), nullable=True)
    estimated_unit = db.Column(db.String(20), nullable=True)
    calories_per_serving = db.Column(db.Float(), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

class DailyNutrition(db.Model):
    __tablename__ = 'daily_nutrition'
    
    daily_nutrition_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    total_calories = db.Column(db.Float(), default=0)
    total_protein = db.Column(db.Float(), default=0)
    total_carbs = db.Column(db.Float(), default=0)
    total_fat = db.Column(db.Float(), default=0)
    total_fiber = db.Column(db.Float(), default=0)
    target_calories = db.Column(db.Float(), nullable=True)
    target_protein = db.Column(db.Float(), nullable=True)
    target_carbs = db.Column(db.Float(), nullable=True)
    target_fat = db.Column(db.Float(), nullable=True)
    meals_planned = db.Column(db.Integer, default=0)
    meals_consumed = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'date', name='unique_user_daily_nutrition'),)