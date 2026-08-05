# AI Placement Mentor 🎯

AI Placement Mentor is a full-stack AI-powered career guidance platform designed to help students prepare for placements.

## 🚀 Live Demo

Frontend:
https://peppy-salamander-428568.netlify.app

Backend API:
https://ai-mentor-backend-8ubh.onrender.com

API Documentation:
https://ai-mentor-backend-8ubh.onrender.com/docs

## ✨ Features

- User Registration & Login
- Resume Analysis
- AI Career Roadmap
- Daily Tasks
- AI Chat Assistant
- Mock Interview
- Interview History
- Analytics Dashboard
- User Profile

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- Axios
- React Router

**Backend**
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- REST APIs

**AI**
- Google Gemini API

**Database**
- SQLite

**Deployment**
- Netlify
- Render

## 🏗️ Architecture

React Frontend
↓
FastAPI REST API
↓
SQLAlchemy
↓
Database

AI features are integrated through the Google Gemini API.

## ⚙️ Local Setup

### Backend

```bash
cd ai-mentor-backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload