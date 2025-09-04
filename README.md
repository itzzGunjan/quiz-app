A modern, responsive quiz application built with React that fetches trivia questions from the Open Trivia Database API. Test your knowledge with timed questions, track your progress, and see detailed results!
Core Features
              Interactive Quiz Interface: Clean, user-friendly design that works on desktop and mobile
              Timed Questions: 30-second timer per question with auto-advance
              Progress Tracking: Visual progress bar and real-time score display
              Fully Responsive: Optimized for all screen sizes
              Modern UI: Beautiful gradient backgrounds and smooth animation
Advanced Features

 API Integration: Fetches real trivia questions from Open Trivia Database
 Difficulty Levels: Easy, Medium, Hard, or Mixed difficulty options
Smart Fallback: Local questions if API is unavailable
Detailed Results: Complete breakdown of answers with explanations
Accessibility: Keyboard navigation and screen reader support
Error Handling: Graceful handling of network issues and edge cases
Installation

Clone or Download the Project
bash# Option 1: If you have the files
cd your-quiz-app-folder

# Option 2: Create new React app and add the code
npx create-react-app quiz-app
cd quiz-app

Replace App.js

Copy the quiz app code from the provided file
Replace the contents of src/App.js with the quiz app code


Install Dependencies (if creating new project)
bashnpm install
# or
yarn install

Start the Development Server
bashnpm start
# or
yarn start

Open Your Browser

Navigate to http://localhost:3000
The app should load with the quiz start screen
API Configuration
The app uses the Open Trivia Database API. You can modify the API parameters in the code:
const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple${difficultyParam}`);
Customizable Settings

Question Count: Change the amount parameter (default: 8)
Timer Duration: Modify setTimeLeft(30) to change seconds per question
Difficulty Options: Add/remove difficulty levels in the select dropdown
Fallback Questions: Add your own questions to the fallbackQuestions array
Open Trivia Database

URL: https://opentdb.com/
Endpoint: https://opentdb.com/api.php
Type: Free, no authentication required
Rate Limits: Reasonable usage (no explicit limits)

API Parameters Used

amount: Number of questions (default: 8)
type: Question type (fixed to "multiple" for multiple choice)
difficulty: easy, medium, or hard (optional)

API Response Handling

Decodes HTML entities (&quot;, &#039;, etc.)
Shuffles answer options randomly
Handles various API response codes
Falls back to local questions on failure

🛠 Development
Available Scripts
bash# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (advanced)
npm run eject
