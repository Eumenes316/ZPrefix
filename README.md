Full stack web app for inventory management. Users can login and perform CRUD ops on the inventory. This app was built with a react front end, & express and SQLite for the backend. Passwords are hashed using bcrypt before storing in the database. JWT is used for maintaining user sessions. API endpoints are protected and require authentication


API Endpoints:

POST /api/auth/register - Register a new user
POST /api/login - Log in a user
GET /api/items - Get all items for the logged-in user
POST /api/items - Add a new item
GET /api/items/:id - Get a specific item
PUT /api/items/:id - Update a specific item
DELETE /api/items/:id - Delete a specific item