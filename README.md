# Vue 3 Project

A modern Vue 3 application with API integration.

## Features

- Vue 3 with Composition API
- Vite for fast development
- Vue Router for routing
- Pinia for state management
- Axios for HTTP requests
- Auto-generated API clients

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── api/           # API clients
│   ├── components/    # Vue components
│   ├── views/         # Page views
│   ├── router/        # Router configuration
│   ├── store/         # Pinia stores
│   └── common/        # Common utilities
├── swagger/           # Swagger documentation files
└── public/            # Static assets
```

## API Usage

The project includes auto-generated API clients for microservices:

```javascript
import apiClient from '../api/apiClient'

// Use the API
const questions = await apiClient.getQuestions()
const user = await apiClient.getCurrentUser()
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8102
VITE_APP_TITLE=Vue Project