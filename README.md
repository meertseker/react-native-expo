# GainAI - Your Personal AI Nutrition Coach

<div align="center">
  <img src="assets/logo.png" alt="GainAI Logo" width="200" />
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.9-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
</div>

## 📱 About GainAI

GainAI is a comprehensive nutrition and meal planning mobile application that combines AI-powered assistance with practical tools to help users achieve their health and fitness goals. Built with React Native and Expo, it offers a seamless experience across iOS and Android platforms.

## 🌟 Key Features

### For Users

#### 🤖 AI-Powered Nutrition Assistant
- **Personal AI Coach**: Get instant answers to nutrition questions, meal suggestions, and dietary advice
- **Smart Recommendations**: Receive personalized meal plans based on your preferences, allergies, and goals
- **Real-time Chat**: Interactive chat interface for continuous support and guidance

#### 📸 Food Tracking Made Easy
- **Meal Scanner**: Take photos of your meals for instant nutritional analysis
- **Manual Logging**: Quick and easy manual food entry with comprehensive database
- **Progress Tracking**: Visual charts and statistics to monitor your nutrition journey

#### 🍽️ Personalized Meal Planning
- **Custom Meal Plans**: Tailored weekly meal plans based on:
  - Dietary preferences (Vegan, Vegetarian, Keto, Paleo, etc.)
  - Food allergies and intolerances
  - Cooking skill level
  - Available time for meal preparation
  - Caloric and macro goals
- **Flexible Scheduling**: Set meal times and frequency that work for your lifestyle
- **Recipe Library**: Access to hundreds of healthy, easy-to-follow recipes

#### 🛒 Smart Grocery Management
- **Auto-Generated Lists**: Grocery lists created from your meal plans
- **Organized by Aisle**: Items categorized for efficient shopping
- **Budget Tracking**: Keep track of grocery expenses
- **Pantry Management**: Track what you have at home

#### 📊 Progress & Analytics
- **Visual Progress**: Charts showing weight, measurements, and nutrition trends
- **Goal Tracking**: Set and monitor multiple health goals
- **Weekly Reports**: Comprehensive summaries of your nutrition and activity
- **Achievement System**: Earn badges and rewards for consistency

#### ⚙️ Customization & Settings
- **Profile Management**: Complete control over personal information and preferences
- **Notification Preferences**: Customize reminders for meals, water intake, and goals
- **Privacy Controls**: Manage data sharing and privacy settings
- **Theme Options**: Light/dark mode support

## 🚀 Getting Started

### For End Users

1. **Download the App**
   - iOS: Available on App Store (coming soon)
   - Android: Available on Google Play Store (coming soon)

2. **Create Your Account**
   - Sign up with email or social login
   - Secure authentication powered by Clerk

3. **Quick Start Options**
   - **Express Setup**: Get started in under 2 minutes with smart defaults
   - **Detailed Setup**: Complete 8-step onboarding for fully personalized experience

4. **Start Your Journey**
   - Explore AI chat for immediate assistance
   - Generate your first meal plan
   - Track your first meal
   - Set your health goals

### User Journey Flow

```
1. Welcome Screen
   ├── Login (existing users)
   └── Sign Up (new users)
       └── Onboarding Options
           ├── Quick Start (2 min)
           │   ├── Basic Info
           │   ├── Main Goal
           │   └── Start Using App
           └── Full Setup (8 steps)
               ├── Personal Information
               ├── Allergy Selection
               ├── Dietary Preferences
               ├── Meal Frequency
               ├── Cooking Skills
               ├── Meal Timing
               ├── Review Plan
               └── Generate First Plan

2. Main App Navigation
   ├── Home Dashboard
   │   ├── Today's Meals
   │   ├── Quick Actions
   │   └── Progress Summary
   ├── Meal Plans
   │   ├── Current Plan
   │   ├── Plan History
   │   └── Generate New Plan
   ├── AI Chat
   │   ├── Nutrition Q&A
   │   ├── Meal Suggestions
   │   └── Recipe Help
   ├── Grocery
   │   ├── Shopping Lists
   │   ├── Pantry Tracker
   │   └── Budget Manager
   └── Settings
       ├── Profile
       ├── Preferences
       └── Account Management
```

## 💻 Technical Documentation

### Tech Stack

#### Frontend
- **Framework**: React Native 0.79.2 with Expo SDK 53
- **Language**: TypeScript 5.8.3
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **Styling**: NativeWind (TailwindCSS for React Native) v4.1.23
- **Authentication**: Clerk v2.11.6
- **UI Components**: 
  - Expo Vector Icons
  - Lucide React Icons
  - React Native Animatable
  - Lottie React Native

#### Backend
- **Framework**: Python Flask
- **Database**: SQLAlchemy ORM
- **API**: RESTful API architecture
- **Authentication**: JWT tokens with Clerk integration

### Project Structure

```
react-native-expo/
├── App.tsx                    # Main app entry point with navigation
├── screens/                   # Main screen components
│   ├── Home.tsx              # Dashboard screen
│   ├── Chat.tsx              # AI chat interface
│   ├── MealPlan.tsx          # Meal planning screen
│   ├── Progress.tsx          # Progress tracking
│   ├── Grocery.tsx           # Grocery management
│   ├── Settings.tsx          # User settings
│   ├── MealScanner.tsx       # Camera-based meal logging
│   ├── ManualMealLog.tsx     # Manual food entry
│   ├── SignUp.tsx            # Registration screen
│   └── LoginScreen.tsx       # Login screen
├── components/               # Reusable components
│   ├── Tabs.tsx             # Bottom navigation
│   ├── MealPlanForm/        # Onboarding flow components
│   │   ├── UserInfo.tsx
│   │   ├── AllergySelection.tsx
│   │   ├── DietaryPreferences.tsx
│   │   ├── MealFrequency.tsx
│   │   ├── CookingSkills.tsx
│   │   ├── MealTiming.tsx
│   │   ├── ReviewPlan.tsx
│   │   └── FinalMealForm.tsx
│   ├── QuickStartOnboarding.tsx
│   ├── UserMealPlans.tsx
│   └── MealPlanDetails.tsx
├── contexts/                 # React Context providers
│   ├── MealPlanFormContext.tsx
│   └── MealPlanContext.tsx
├── services/                 # API and external services
├── assets/                   # Images, fonts, etc.
└── backend/                  # Flask backend
    ├── app.py               # Main Flask application
    ├── models.py            # Database models
    └── requirements.txt     # Python dependencies
```

### Installation & Development

#### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

#### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/gainai.git
cd gainai/react-native-expo

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run ios       # iOS Simulator
npm run android   # Android Emulator
npm run web       # Web browser
```

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Backend API
EXPO_PUBLIC_API_URL=http://localhost:5000

# Other configurations
EXPO_PUBLIC_APP_NAME=GainAI
```

### Available Scripts

```bash
# Development
npm start          # Start Expo development server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier

# Building
npm run prebuild   # Generate native projects
expo build:ios     # Build iOS app
expo build:android # Build Android app

# Testing
npm test           # Run tests (when configured)
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Meal Plans
- `GET /api/meal-plans` - Get user's meal plans
- `POST /api/meal-plans` - Create new meal plan
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan

#### Food Tracking
- `POST /api/meals/scan` - Analyze meal from photo
- `POST /api/meals/manual` - Log meal manually
- `GET /api/meals/history` - Get meal history

#### AI Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/history` - Get chat history

## 🔒 Security & Privacy

- **Secure Authentication**: Industry-standard authentication with Clerk
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Privacy First**: User data never shared without explicit consent
- **GDPR Compliant**: Full compliance with data protection regulations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.gainai.com](https://docs.gainai.com)
- **Email**: support@gainai.com
- **Discord**: [Join our community](https://discord.gg/gainai)
- **FAQ**: Check our [Frequently Asked Questions](FAQ.md)

## 🎯 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Wearable device integration
- [ ] Social features and challenges
- [ ] Advanced AI meal recommendations
- [ ] Barcode scanning
- [ ] Restaurant menu integration

### Version 3.0 (Q4 2024)
- [ ] Personal trainer integration
- [ ] Video recipes and tutorials
- [ ] Meal prep planning
- [ ] Family account support
- [ ] Nutrition coaching marketplace

## 👥 Team

- **Product Manager**: Leading product vision and strategy
- **UX/UI Designer**: Creating intuitive user experiences
- **Frontend Developers**: Building the React Native app
- **Backend Developers**: Developing the Flask API
- **AI/ML Engineers**: Implementing intelligent features
- **QA Engineers**: Ensuring quality and reliability

---

<div align="center">
  Made with ❤️ by the GainAI Team
  
  [Website](https://gainai.com) • [Blog](https://blog.gainai.com) • [Twitter](https://twitter.com/gainai)
</div> 