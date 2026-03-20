# 🚀 YapStation

**YapStation** is a futuristic social media platform built with a hybrid architecture combining **C++ (core logic)**, **Python (FastAPI backend)**, and **HTML/CSS/JavaScript (frontend)**.

The goal of this project is to design a **modular, object-oriented system** where all core business logic is implemented in C++, and exposed to a web application through Python bindings.

---

## 🧠 Architecture Overview

```
Frontend (HTML/CSS/JS)
        ↓
FastAPI Backend (Python)
        ↓
C++ Engine (Core Logic)
        ↓
(Optional) Database
```

* **Frontend** handles UI and user interaction
* **Backend** exposes APIs and WebSocket communication
* **C++ Engine** contains all domain logic and system behavior
* **Database** (optional) can be added for persistence

---

## 📁 Project Structure

```
yapstation/

├── backend/        # FastAPI server and routes
├── engine/         # C++ core logic (modular classes)
├── frontend/       # HTML, CSS, JS UI
├── database/       # SQL schema (optional)
└── run.ps1         # Run script
```

---

## ⚙️ Features

### 👤 User System

* User registration and login
* Profile management

### 📝 Content System

* Create and edit posts
* Comment on posts
* Media support (images/videos)

### ❤️ Social Interactions

* Like posts and comments
* Follow users or stations

### 💬 Messaging

* Real-time chat using WebSockets
* Conversations and messages

### 🛰️ YapStations (Community Accounts)

* Create and manage stations
* Membership system (Admin / Member)

### 🔔 Notifications

* Alerts for likes, messages, follows, etc.

---

## 🧩 Core Design Principles

* **Object-Oriented Design (OOP)** in C++
* **Separation of Concerns**
* **Minimal and Clean Architecture**
* **Each class in a separate file**
* **Simple data handling (no overengineering)**

---

## 🔧 Technologies Used

| Layer      | Technology            |
| ---------- | --------------------- |
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Python (FastAPI)      |
| Core Logic | C++ (pybind11)        |
| Realtime   | WebSockets            |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yapstation.git
cd yapstation
```

---

### 2. Build C++ Engine

```bash
cd engine
python setup.py build_ext --inplace
```

---

### 3. Run Backend

```bash
cd ../backend
uvicorn server:app --reload
```

---

### 4. Open Frontend

Open in browser:

```
http://localhost:8000/
```

---

## 🧪 Development Notes

* The system currently uses **in-memory storage (std::vector)** for simplicity
* Database integration can be added later
* Authentication is basic and can be extended (JWT, hashing, etc.)

---

## 📌 Future Improvements

* Database integration (PostgreSQL / MySQL)
* JWT-based authentication
* Media uploads
* Scalability improvements
* UI enhancements

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 💡 Inspiration

This project was built as a learning-focused system to explore:

* C++ backend integration
* Full-stack architecture design
* Real-time communication systems

---

## ⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub!
