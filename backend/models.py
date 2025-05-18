from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()
print("DATABASE_URL from .env:", os.getenv('DATABASE_URL')) 
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# UUID üretmek için yardımcı fonksiyon
def generate_uuid():
    return str(uuid.uuid4())

# Kullanıcılar tablosu
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(), nullable=True)
    clerk_user_id = db.Column(db.String(), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişkiler
    user_form = db.relationship('UserForm', backref='user', uselist=False, cascade='all, delete-orphan')
    user_allergies = db.relationship('UserAllergy', backref='user', lazy=True, cascade='all, delete-orphan')
    meal_plans = db.relationship('MealPlan', backref='user', lazy=True, cascade='all, delete-orphan')

# Kullanıcı form bilgileri
class UserForm(db.Model):
    __tablename__ = 'user_forms'
    
    user_form_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(), db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    current_weight = db.Column(db.Float(), nullable=False)
    target_weight = db.Column(db.Float(), nullable=False)
    height = db.Column(db.Float(), nullable=False)
    activity_frequency = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

# Alerjiler ana tablosu
class Allergy(db.Model):
    __tablename__ = 'allergies'
    
    allergy_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    allergy_name = db.Column(db.String(), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişki
    user_allergies = db.relationship('UserAllergy', backref='allergy', lazy=True, cascade='all, delete-orphan')

# Kullanıcı alerjileri - ilişki tablosu
class UserAllergy(db.Model):
    __tablename__ = 'user_allergies'
    
    user_allergy_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    allergy_id = db.Column(db.String(), db.ForeignKey('allergies.allergy_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'allergy_id', name='unique_user_allergy'),)

# Yemek planları
class MealPlan(db.Model):
    __tablename__ = 'meal_plans'
    
    meal_plan_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişkiler
    meals = db.relationship('Meal', backref='meal_plan', lazy=True, cascade='all, delete-orphan')
    grocery_items = db.relationship('GroceryItem', backref='meal_plan', lazy=True, cascade='all, delete-orphan')

# Yemekler tablosu
class Meal(db.Model):
    __tablename__ = 'meals'
    
    meal_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    meal_name = db.Column(db.String(), nullable=False)
    meal_plan_id = db.Column(db.String(), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişkiler
    ingredients = db.relationship('MealIngredient', backref='meal', lazy=True, cascade='all, delete-orphan')

# Malzemeler ana tablosu
class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    ingredient_name = db.Column(db.String(), unique=True, nullable=False)
    calories_per_100 = db.Column(db.Float(), nullable=True)
    protein_per_100 = db.Column(db.Float(), nullable=True)
    fat_per_100 = db.Column(db.Float(), nullable=True)
    carb_per_100 = db.Column(db.Float(), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # İlişki
    meal_ingredients = db.relationship('MealIngredient', backref='ingredient', lazy=True, cascade='all, delete-orphan')

# Yemek ve malzeme ilişki tablosu
class MealIngredient(db.Model):
    __tablename__ = 'meal_ingredients'
    
    meal_ingredient_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    meal_id = db.Column(db.String(), db.ForeignKey('meals.meal_id', ondelete='CASCADE'), nullable=False)
    ingredient_id = db.Column(db.String(), db.ForeignKey('ingredients.ingredient_id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Float(), nullable=False)
    unit = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('meal_id', 'ingredient_id', name='unique_meal_ingredient'),)

# Market alışveriş öğeleri
class GroceryItem(db.Model):
    __tablename__ = 'grocery_items'
    
    grocery_item_id = db.Column(db.String(), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(), nullable=False)
    quantity = db.Column(db.Float(), nullable=False)
    unit = db.Column(db.String(), nullable=False)
    meal_plan_id = db.Column(db.String(), db.ForeignKey('meal_plans.meal_plan_id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

# Veritabanı tablolarını oluşturmak için
def create_tables():
    with app.app_context():
        db.create_all()
        print("Tables created successfully.")

if __name__ == '__main__':
    create_tables()