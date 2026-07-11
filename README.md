# LMS — Interactive MERN Stack Learning Platform

LMS is a highly interactive, premium web application designed to help developers learn the MERN (MongoDB, Express, React, Node.js) stack. The platform features curated course paths, hands-on coding playgrounds, a practice workspace, and built-in note-taking.

---

## 🚀 Key Features

- **📚 Choose Your Subject**: Multiple structured courses covering JavaScript Basics, React Masterclass, Node.js, Express, MongoDB, Mongoose ODM, and JWT Authentication.
- **💻 Interactive Sandbox**: Write, edit, and run live React components and JavaScript code in real-time with browser preview and console output.
- **📱 Responsive Mobile Support**: A dedicated mobile interface featuring dynamic sliding drawers, an adaptive header, and a bottom navigation menu to switch pages/subjects easily.
- **📝 Built-in Rich-Text Notebook**: Take notes directly within the LMS as you learn. Notes are saved automatically to local storage.
- **💡 Practice Workspace**: Test your knowledge with practice questions for each topic.
- **🔄 Custom Scroll Restoration**: Custom-built page scroll management designed for layout-level scrolling containers.
- **🌓 Dark/Light Mode**: Smooth theme toggling that persists across page reloads.

---

## 🛠️ Project Structure

```text
├── client/
│   ├── public/              # Static assets and PWA manifest
│   ├── src/
│   │   ├── assets/          # Data files (e.g., topicsContent.js)
│   │   ├── components/      # UI components (Header, Sidebar, Sandbox, Tabs)
│   │   ├── layouts/         # Layout components (LMSLayout)
│   │   ├── pages/           # Pages (Home, Playground)
│   │   ├── store/           # Zustand stores for auth, sidebar and layout state
│   │   ├── App.jsx          # Root application component and React Router setup
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Project dependencies and script targets
│   └── vite.config.js       # Vite configuration (with API proxy)
├── server/
│   ├── src/
│   │   ├── controllers/     # HTTP request controllers (auth, notes, progress, answers)
│   │   ├── middleware/      # Router preprocessors (JWT auth, global error handler)
│   │   ├── models/          # Mongoose database schemas (User, Note, Progress, Answer)
│   │   ├── routes/          # Express route bindings
│   │   ├── services/        # Database query layers & business logic
│   │   ├── utils/           # Mongoose connect, JWT signature helpers
│   │   ├── app.js           # Express app configuring CORS, json parsing, endpoints
│   │   └── index.js         # Entry server listener
│   ├── test/                # Integration endpoints tests (api.test.js) using Jest ESM
│   ├── package.json         # Server scripts (dev, test, start) and requirements
│   └── .env                 # Server configuration env variables
└── README.md                # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud connection string)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/imksh/lms.git
    cd lms
    ```

2.  Install dependencies for both frontend and backend:

    ```bash
    # Install client dependencies
    cd client
    npm install

    # Install server dependencies
    cd ../server
    npm install
    ```

3.  Configure server environment:
    Create a `.env` file in the `server` directory (a template is pre-created):

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/lms
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```

4.  Start development servers:
    Run the dev commands in separate terminal sessions:

    ```bash
    # Start the backend server (runs on http://localhost:5000)
    cd server
    npm run dev

    # Start the frontend dev server (runs on http://localhost:5173)
    cd client
    npm run dev
    ```

5.  Open the app in your browser at `http://localhost:5173`.

---

## 🎨 Technology Stack

- **Frontend**: React (v19), Vite (v8), Tailwind CSS, Zustand, FlyonUI, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js (REST API framework)
- **Database**: MongoDB, Mongoose ODM
- **Security**: JSON Web Tokens (JWT), bcryptjs password hashing
- **Testing**: Jest, Supertest

---

## 🔮 Future Roadmap

- **Admin Dashboard**: Dedicated admin panels for creators to manage courses, view learner analytics, and modify curriculum structure.
- **Dynamic Course Content**: Rich-text authoring using the customized [@imksh/editor](https://www.npmjs.com/package/@imksh/editor) for creating and updating study material dynamically from the UI.
