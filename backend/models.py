from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
print("DATABASE_URL from .env:", os.getenv('DATABASE_URL'))

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Helper function to generate UUIDs
def generate_uuid():
    return str(uuid.uuid4())

# Users table
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    clerk_user_id = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user_form = db.relationship('UserForm', backref='user', uselist=False, cascade='all, delete-orphan')
    user_allergies = db.relationship('UserAllergy', backref='user', lazy=True, cascade='all, delete-orphan')
    meal_plans = db.relationship('MealPlan', backref='user', lazy=True, cascade='all, delete-orphan')

# User form information
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

# Allergies master table
class Allergy(db.Model):
    __tablename__ = 'allergies'
    
    allergy_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    allergy_name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user_allergies = db.relationship('UserAllergy', backref='allergy', lazy=True, cascade='all, delete-orphan')

# User allergies - association table
class UserAllergy(db.Model):
    __tablename__ = 'user_allergies'
    
    user_allergy_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    allergy_id = db.Column(db.String(36), db.ForeignKey('allergies.allergy_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'allergy_id', name='unique_user_allergy'),)

# Meal plans
class MealPlan(db.Model):
    __tablename__ = 'meal_plans'
    
    meal_plan_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    meals = db.relationship('Meal', backref='meal_plan', lazy=True, cascade='all, delete-orphan')
    grocery_items = db.relationship('GroceryItem', backref='meal_plan', lazy=True, cascade='all, delete-orphan')

# Meals table
class Meal(db.Model):
    __tablename__ = 'meals'
    
    meal_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    meal_name = db.Column(db.String(100), nullable=False)
    meal_plan_id = db.Column(db.String(36), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    ingredients = db.relationship('MealIngredient', backref='meal', lazy=True, cascade='all, delete-orphan')

# Ingredients master table
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
    
    # Relationship
    meal_ingredients = db.relationship('MealIngredient', backref='ingredient', lazy=True, cascade='all, delete-orphan')

# Meal and ingredient association table
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

# Grocery items
class GroceryItem(db.Model):
    __tablename__ = 'grocery_items'
    
    grocery_item_id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float(), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    meal_plan_id = db.Column(db.String(36), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

# Function to create database tables
def create_tables():
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")

if __name__ == '__main__':
    create_tables()