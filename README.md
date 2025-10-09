# Dictation App API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

#### Sign In
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "token": "string"
  }
}
```

### Video Progress Tracking

#### Update Video Progress
```http
POST /progress/:videoId
Authorization: Bearer token
Content-Type: application/json

{
  "currentTime": number,    // Current time in seconds
  "completed": boolean      // Optional: mark as completed
}

Response:
{
  "message": "Progress updated successfully",
  "data": {
    "id": number,
    "userId": number,
    "videoId": number,
    "currentTime": number,
    "completed": boolean,
    "score": number|null,
    "lastWatched": string
  }
}
```

#### Get Progress for a Specific Video
```http
GET /progress/:videoId
Authorization: Bearer token

Response:
{
  "data": {
    "currentTime": number,
    "completed": boolean,
    "score": number|null,
    "video": {
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