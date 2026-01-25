# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

APIs.is is a JSON API service that scrapes and transforms data from publicly available Icelandic websites. It's an Express-based Node.js application using Babel for ES6 transpilation.

## Common Commands

```bash
# Install dependencies
npm install

# Run development server (with nodemon)
npm run dev

# Run production server (port 3100)
npm start

# Run with debug output
DEBUG=server,config npm start

# Run all tests
npm test

# Run a single endpoint's tests
NODE_ENV=integration mocha --timeout 10000 --compilers js:babel-core/register ./test.js ./endpoints/<endpoint>/tests/integration_test.js

# Lint
npm run lint

# Re-record mock data for tests (makes real HTTP requests)
RECORD_MOCK_DATA=true npm test
```

## Architecture

### Entry Point
- `index.js` - Bootstraps Babel and loads `server.js`
- `server.js` - Express app configuration, middleware setup, and auto-loads all endpoints

### Endpoints
Endpoints are automatically loaded from `endpoints/` subdirectories. Each endpoint follows this structure:
```
endpoints/<name>/
├── index.js              # Route handlers, imports app from ../../server
└── tests/
    └── integration_test.js  # Integration tests using helpers from lib/test_helpers.js
```

Endpoints define routes by importing `app` from `../../server` and registering handlers:
```javascript
import app from '../../server'
app.get('/path', (req, res) => res.json({ results: [...] }))
```

### Middleware Stack (lib/)
- `cache.js` - Redis caching layer, `res.cache(timeout)` enables caching for a response
- `cors.js` - CORS headers for cross-origin requests
- `redis.js` - Redis client connection

### Configuration (config/)
- `default.json` - Base config (port 3100)
- `integration.json` - Test config (port 3101, testing: true)
- Environment-specific configs loaded via `NODE_ENV`

### Testing
Tests use Mocha with `nock` for HTTP mocking. The `mock-data.json` file contains recorded HTTP responses. Use test helpers from `lib/test_helpers.js`:
- `testRequestParams(path, form)` - Generate request options
- `testRequestHandlerForFields(done, fields, callback, canBeEmpty)` - Assert response structure

## Code Style

ESLint with Airbnb base config. Key rules:
- No semicolons
- Max line length: 120 characters
- Trailing commas in arrays/objects (not in function params)
