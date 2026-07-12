# LMS — Interactive MERN Stack Learning Platform

LMS is a highly interactive, premium web application designed to help developers learn the MERN (MongoDB, Express, React, Node.js) stack. The platform features curated course paths, hands-on coding playgrounds, a practice workspace, and built-in note-taking.

---

## 🚀 Key Features

- **📚 Choose Your Subject**: Multiple structured courses covering JavaScript Basics, React Masterclass, Node.js, Express, MongoDB, Mongoose ODM, and JWT Authentication.
- **💻 Interactive Sandbox**: Write, edit, and run live React components and JavaScript code in real-time with browser preview and console output.
- **📱 Responsive Mobile Support**: A dedicated mobile interface featuring dynamic sliding drawers, an adaptive header, and a bottom navigation menu to switch pages/subjects easily.
- **📝 Built-in Rich-Text Notebook**: Take notes directly within the LMS as you learn. Notes are saved automatically to local storage.
- **💡 Practice Workspace**: Test your knowledge with practice questions for each topic.
- **🛡️ Role-Based Access Control**: Admins and Teachers can log in. Teachers are restricted to securely managing and evaluating only their assigned modules.
- **🛠️ Dynamic CMS Dashboard**: Fully functional Admin Panel where courses, subjects, and topics can be created, updated, and reordered using a drag-and-drop interface. Uses `@imksh/editor` for rich-text authoring.
- **🎓 Student Evaluations**: Teachers and admins can seamlessly review, grade, and provide feedback on paginated student submissions.
- **⚡ Zustand Local Caching**: Highly optimized data fetching layer built with Zustand that intelligently caches API data, making app navigation instantaneous.
- **🔄 Custom Scroll Restoration**: Custom-built page scroll management designed for layout-level scrolling containers.
- **🌓 Dark/Light Mode**: Smooth theme toggling that persists across page reloads.

---

## 🛠️ Project Structure

```text
├── client/
│   ├── public/              # Static assets and PWA manifest
│   ├── src/
│   │   ├── components/      # UI components (Header, Sidebar, Sandbox, Tabs)
│   │   │   └── admin/       # CMS Modals, List views, and Topic Editor
│   │   ├── layouts/         # Layout components (LMSLayout, AdminLayout)
│   │   ├── pages/           # Pages (Home, Playground, AdminCMSPage, AdminUsers)
│   │   ├── services/        # API layer (cmsService, submissionService, userService)
│   │   ├── store/           # Zustand stores for auth, sidebar and layout state
│   │   ├── stores/          # Zustand store for local API caching (useCacheStore)
│   │   ├── App.jsx          # Root application component and React Router setup
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Project dependencies and script targets
│   └── vite.config.js       # Vite configuration (with API proxy)
├── server/
│   ├── src/
│   │   ├── controllers/     # HTTP request controllers (auth, cms, module, submission)
│   │   ├── middleware/      # Router preprocessors (JWT auth, role-based admin filtering)
│   │   ├── models/          # Mongoose database schemas (User, Topic, Subject, Module, Submission)
│   │   ├── routes/          # Express route bindings
│   │   ├── utils/           # Mongoose connect, JWT signature helpers
│   │   ├── app.js           # Express app configuring CORS, json parsing, endpoints
│   │   └── index.js         # Entry server listener
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
