# Dictation App

A full-stack web application for English dictation practice and learning, built with React, TypeScript, and Node.js.

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   └── api/         # API integration
│   └── public/          # Static assets
│
└── server/          # Backend Node.js application
    ├── controllers/    # Request handlers
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── middlewares/   # Express middlewares
    └── utils/         # Utility functions
```

## Features

- 🎯 Interactive English dictation exercises
- 📊 Progress tracking and scoring system
- 🎥 Video-based learning materials
- 🔐 User authentication and profile management
- 📝 Transcript-based learning progress
- 📈 Performance analytics and statistics

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router v7
- Axios
- ApexCharts for data visualization
- Full Calendar integration
- React DnD for drag-and-drop functionality

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- OpenAI Integration
- FFmpeg for media processing

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Most endpoints require authentication using JWT tokens:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Key Endpoints

#### Authentication
```http
POST /auth/register   # User registration
POST /auth/login      # User login
```

#### Video Progress
```http
GET /progress/:videoId    # Get progress for a video
POST /progress/:videoId   # Update progress

Request body:
{
  "currentTranscriptIndex": number,
  "transcriptScore": number
}

Response:
{
  "data": {
    "currentTranscriptIndex": number,
    "transcriptsCompleted": number,
    "totalScore": number,
    "completed": boolean,
    "totalTranscripts": number
  }
}
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/vanhuyhvh2k4/dictation-app.git
cd dictation-app
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configuration

1. Create a .env file in the server directory with:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### Running the Application

1. Start the server
```bash
cd server
npm run dev
```

2. Start the client
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## License

This project is licensed under the MIT License
      "title": "string",
      "duration": number,
      "thumbnail": "string"
    }
  }
}
```

#### Get All User Progress
```http
GET /progress
Authorization: Bearer token

Response:
{
  "data": [
    {
      "currentTime": number,
      "completed": boolean,
      "score": number|null,
      "lastWatched": string,
      "video": {
        "title": "string",
        "duration": number,
        "thumbnail": "string"
      }
    }
  ]
}
```

### Dictation

#### Submit Sentence
```http
POST /dictation/submit
Authorization: Bearer token
Content-Type: application/json

{
  "transcriptId": number,
  "userText": "string"
}

Response:
{
  "transcriptId": number,
  "result": {
    "score": number,
    "correctCount": number,
    "total": number,
    "detail": [
      {
        "word": "string",
        "ok": boolean,
        "userWord": "string|null"
      }
    ]
  }
}
```

### Videos

#### Get All Videos
```http
GET /videos
Authorization: Bearer token

Response:
{
  "data": [
    {
      "id": number,
      "title": "string",
      "description": "string",
      "url": "string",
      "thumbnail": "string",
      "duration": number
    }
  ]
}
```

#### Get Video Details
```http
GET /videos/:id
Authorization: Bearer token

Response:
{
  "data": {
    "id": number,
    "title": "string",
    "description": "string",
    "url": "string",
    "thumbnail": "string",
    "duration": number,
    "transcripts": [
      {
        "id": number,
        "text": "string",
        "startTime": number,
        "endTime": number
      }
    ]
  }
}
```

## Error Handling

All endpoints may return error responses in the following format:
```json
{
  "message": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 500: Internal Server Error

## Best Practices

1. Always include the Authorization header for protected endpoints
2. Handle API errors appropriately in your client application
3. For video progress updates:
   - Update periodically (e.g., every 30 seconds)
   - Always update when pausing or leaving the video
   - Mark as completed when reaching the end
4. Store the JWT token securely (e.g., in HTTP-only cookies)

## Example Usage

### JavaScript/TypeScript with Axios
```typescript
import axios from 'axios';

// Configure axios with base URL and auth header
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Update video progress
const updateProgress = async (videoId: number, currentTime: number) => {
  try {
    const response = await api.post(`/progress/${videoId}`, {
      currentTime,
      completed: false
    });
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

// Get video progress
const getProgress = async (videoId: number) => {
  try {
    const response = await api.get(`/progress/${videoId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};
```