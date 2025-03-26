## 🚀 JayMedia - Open License Media Search Web Application
This is an open-license media web application designed for users to manage media content under open licenses.

### 📜 About the Project
JayMedia is an open-source media application that allows users to search and manage openly licensed media content. It integrates the Openverse API to fetch openly licensed images and audio while ensuring a seamless user experience.

### ✨ Features
✔️ User Authentication (JWT-based login & Google authentication)\
✔️ Search & Filtering (Find content via Openverse API)\
✔️ Secure Data Encryption (For API requests & responses)\
✔️ Responsive UI (Built with Angular & Bootstrap)

### 🛠️ Tech Stack
Frontend\
✔️ Angular (v19)\
✔️ Bootstrap for UI styling\
Backend\
✔️ .NET Core Web API\
✔️ PostgreSQL (Database)\
✔️ Google Auth and JWT for authentication\
DevOps & Tools\
✔️ Docker for containerization\
✔️ GitHub Actions for CI/CD\
✔️ Swagger UI for API testing

### ⚡ Installation
To run JayMedia locally, follow these steps:
1. Clone the Repository: git clone https://github.com/yourusername/JayMedia.git.
2. Set Up the Backend: Install .NET SDK v9, Configure your database connection in appsettings.json, Run migrations: "dotnet ef database update", Start the API: "dotnet run".
3. Set Up the Frontend: Install Angular CLI (if not installed): "npm install -g @angular/cli", Navigate to frontend folder and install dependencies: "cd frontend" "npm install", Start the frontend: "ng serve".

### 📌 Usage:
Register/Login to access "manage searches" features.\
Search for Media using Openverse API.

### 📜 API Documentation:
The backend API is documented using Swagger. Swagger UI: "http://localhost:5090/swagger/index.html".

### 🛠️ Development Process:
This project follows a feature-driven development approach. See detailed development logs in GitHub commits.

### 🛡️ License:
This project is open-source under the MIT License.

### 📧 Contact:
👤 Joy Eseosa Ihama\
📩 Email: ihamajoyeseosa@gmail.com\
🔗 GitHub: Joy-Ese

### Screenshots of JayMedia Web Application

<img width="960" alt="login" src="https://github.com/user-attachments/assets/0285d49d-7e12-4509-9102-927880be6edc" />\
Login Page

<img width="947" alt="home-with-username" src="https://github.com/user-attachments/assets/f30e7323-c62f-4e94-8d4b-8b8a6e080239" />\
Home Page displaying the username after successful login

<img width="949" alt="home-with-searched-word" src="https://github.com/user-attachments/assets/fedb07ac-fbff-48ca-bfc6-bbea03bbd301" />\
Home Page after searching

<img width="950" alt="manage-searches" src="https://github.com/user-attachments/assets/67d0d2a4-26c5-4afc-b8cf-cc62f60372e1" />\
Manage Searches Page
