# AlgoVortex REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints expect the header:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new student account.
- **Request Body**:
  ```json
  {
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "username": "janedoe",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": 3, "username": "janedoe", "email": "jane@example.com", "role": "user" }
  }
  ```

### `POST /api/auth/login`
Authenticates a user by email or username.
- **Request Body**:
  ```json
  {
    "identifier": "demo@algovortex.com",
    "password": "GrindEra@2026"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": 2, "username": "algovortex_coder", "email": "demo@algovortex.com", "role": "user" }
  }
  ```

### `GET /api/auth/me` *(Protected)*
Returns currently authenticated user profile with problem solved counts.

### `POST /api/auth/update-profile` *(Protected)*
Updates user bio, full name, or GitHub username.

---

## 2. Problems (`/api/problems`)

### `GET /api/problems`
Fetches paginated problem list with optional filters.
- **Query Parameters**:
  - `search` (string)
  - `topic` (string slug, e.g. `arrays-hashing`, `stack`, `trees`)
  - `difficulty` (`Easy` | `Medium` | `Hard`)
  - `status` (`solved` | `unsolved`)
  - `page` (number, default: 1)
  - `limit` (number, default: 20)

### `GET /api/problems/:slugOrId`
Fetches full problem details, constraints, examples, progressive hints, editorial markdown, and public sample test cases.

### `POST /api/problems/:id/bookmark` *(Protected)*
Toggles bookmark state for the problem.

### `GET /api/problems/user/bookmarks` *(Protected)*
Retrieves all bookmarked questions for current user.

---

## 3. Code Execution & Submissions (`/api/execute`)

### `POST /api/execute/run`
Executes code against **sample test cases only** in an isolated subprocess.
- **Request Body**:
  ```json
  {
    "problemId": 1,
    "language": "python",
    "code": "import sys\n..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": {
      "verdict": "Accepted",
      "totalTestCases": 2,
      "passedCount": 2,
      "executionTimeMs": 45,
      "memoryKb": 18900,
      "testResults": [
        {
          "testCaseIndex": 1,
          "isSample": true,
          "passed": true,
          "input": "4\n2 7 11 15\n9",
          "userOutput": "0 1",
          "expectedOutput": "0 1"
        }
      ]
    }
  }
  ```

### `POST /api/execute/submit` *(Protected)*
Evaluates code against **ALL sample and hidden test cases**.
- If accepted, marks problem solved, updates user streak, records submission in DB.
- Keeps hidden test expected output private.

---

## 4. User Dashboard (`/api/dashboard`) *(Protected)*
Returns:
- Easy, Medium, and Hard statistics
- 365-day submission activity heatmap
- Current streak and longest streak
- Topic-wise progress breakdown
- Recent submissions history
- Recommended next problems

---

## 5. AI Coding Tutor (`/api/ai`)

### `GET /api/ai/status`
Checks local Ollama service and reports available models.

### `POST /api/ai/chat`
Conversational DSA guidance.
- **Modes**: `hint`, `debug`, `complexity`, `explain`, `chat`
- **Request Body**:
  ```json
  {
    "problemTitle": "Two Sum",
    "problemTopic": "Arrays & Hashing",
    "currentCode": "def twoSum(...): ...",
    "language": "python",
    "mode": "hint",
    "message": "Give me an intuition hint without full code"
  }
  ```

---

## 6. Leaderboard & Roadmaps

### `GET /api/leaderboard`
Returns user rankings calculated as:
$$\text{Score} = (\text{Easy} \times 20) + (\text{Medium} \times 50) + (\text{Hard} \times 100)$$

### `GET /api/roadmap`
Returns curated roadmaps (Beginner 0 to 1, SDE Sheet 75, Advanced Graphs & DP).
