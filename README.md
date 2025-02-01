# 🐷 PiggyBank - Budget Tracker

A **full-stack budget tracking application** built using **Spring Boot (Java) + React (JavaScript) + MongoDB**.

---

## 📌 Features

✅ Track income and expenses

✅ Store and retrieve financial data using MongoDB

✅ Secure backend with **Spring Boot Security**

✅ Frontend built with **React + Axios**

✅ REST API for managing transactions

---

## 🚀 Tech Stack

- **Frontend:** React, JavaScript

- **Backend:** Java, Spring Boot

- **Database:** MongoDB

- **Build Tools:** Maven

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/davidylee123/PiggyBank.git
cd piggybank
```

### 2️⃣ Backend Setup

1. **Navigate to the backend folder**

   ```sh
   cd backend
   ```

2. **Install Dependencies**

   Since we are using Maven, run:

   ```sh
   ./mvnw clean install
   ```

3. **Configure MongoDB**

   Ensure MongoDB is running locally on **`MongoDB Compass`** or update the application.properties file in src/main/resources/ with the MongoDB connection string:

   ```sh
   spring.data.mongodb.uri=mongodb+srv://yooup123:UjpRGHjv3wnxyvM9@piggybank.h1aip.mongodb.net/piggybank?retryWrites=true&w=majority
   ```

4. **Run the Backend**

   Start the Spring Boot application:

   ```sh
   ./mvnw spring-boot:run
   ```

   The backend will be available at http://localhost:8080.

5. **Test the Backend**

   Open your browser or Postman and navigate to http://localhost:8080/api/test.

   You should see the response: `"Backend is running!"`

---

### 3️⃣ Frontend Setup

1. **Navigate to the `frontend` folder**

   ```sh
   cd ../frontend
   ```

2. **Install Dependencies**

   Install the required npm packages:

   ```sh
   npm install
   ```

3. **Configure the Proxy**

   To avoid CORS issues, add a proxy to your `package.json` file:

   ```sh
   "proxy": "http://localhost:8080"
   ```

4. **Run the Frontend**

   Start the React development server:

   ```sh
   npx react-scripts start
   ```

   The frontend will be available at `http://localhost:3000`.

5. **Test the Frontend**

   Open your browser and navigate to `http://localhost:3000`.

   You should see the message: `"Backend is running!"` if the frontend successfully communicates with the backend.

---

## 🏃 Running the Project

### Backend

- Start the backend:

  ```sh
  cd backend
  ./mvnw spring-boot:run
  ```

### Frontend

- Start the frontend:

  ```sh
  cd frontend
  npm start
  ```

---

## 🐛 Common Issues and Troubleshooting

### 1️⃣ **Backend Not Running**

- Ensure MongoDB is running.
- Check the `application.properties` file for correct MongoDB configuration.
- Verify the backend is running by visiting `http://localhost:8080/api/test`.

### 2️⃣ **Frontend Not Connecting to Backend**

- Ensure the backend is running.
- Check the proxy configuration in `package.json`.
- Look for errors in the browser console (press `F12` to open developer tools).

### 3️⃣ **CORS Errors**

- Enable CORS in the backend (see the **Backend Setup** section for instructions).
- Ensure the frontend is using the correct backend URL.

### 4️⃣ **Dependency Issues**

- If you encounter dependency issues, try deleting `node_modules` and reinstalling:

  ```sh
  rm -rf node_modules
  npm install
  ```

---

## 🤝 Contributing

1. Create a new branch for your feature or bugfix:

   ```sh
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes:

   ```sh
   git add .
   git commit -m "Add your commit message here"
   ```

3. Push your branch to GitHub:

   ```sh
   git push
   ```

4. Open a pull request on GitHub.

---
