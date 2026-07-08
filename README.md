# LMS — Interactive MERN Stack Learning Platform

LMS is a highly interactive, premium web application designed to help developers learn the MERN (MongoDB, Express, React, Node.js) stack. The platform features curated course paths, hands-on coding playgrounds, a practice workspace, and built-in note-taking.

---

## 🚀 Key Features

*   **📚 Choose Your Subject**: Multiple structured courses covering JavaScript Basics, React Masterclass, Node.js, Express, MongoDB, Mongoose ODM, and JWT Authentication.
*   **💻 Interactive Sandbox**: Write, edit, and run live React components and JavaScript code in real-time with browser preview and console output.
*   **📱 Responsive Mobile Support**: A dedicated mobile interface featuring dynamic sliding drawers, an adaptive header, and a bottom navigation menu to switch pages/subjects easily.
*   **📝 Built-in Rich-Text Notebook**: Take notes directly within the LMS as you learn. Notes are saved automatically to local storage.
*   **💡 Practice Workspace**: Test your knowledge with practice questions for each topic.
*   **🔄 Custom Scroll Restoration**: Custom-built page scroll management designed for layout-level scrolling containers.
*   **🌓 Dark/Light Mode**: Smooth theme toggling that persists across page reloads.

---

## 🛠️ Project Structure

```text
├── client/
│   ├── public/              # Static assets and PWA manifest
│   ├── src/
│   │   ├── assets/          # Data files (e.g., topicsContent.js)
│   │   ├── components/      # UI components (Header, Sidebar, InteractiveSandbox, Tabs)
│   │   ├── layouts/         # Layout components (LMSLayout)
│   │   ├── pages/           # Pages (Home, Playground)
│   │   ├── store/           # Zustand stores for sidebar and layout state
│   │   ├── App.jsx          # Root application component and React Router setup
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Project dependencies and script targets
│   ├── vite.config.js       # Vite configuration
│   └── vercel.json          # Deployment configuration for Vercel
└── README.md                # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/imksh/lms.git
    cd lms
    ```

2.  Install dependencies for the client application:
    ```bash
    cd client
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open the app in your browser at `http://localhost:5173`.

---

## 🎨 Technology Stack

*   **Frontend Library**: React (v19)
*   **Build Tool**: Vite
*   **Styling**: CSS (using Tailwind CSS utilities and custom stylesheets)
*   **Routing**: React Router DOM (v7)
*   **State Management**: Zustand
*   **Icons**: React Icons, Lucide React
*   **Animations**: Motion (Framer Motion)

---

## 🔮 Future Roadmap

In the future, the platform will evolve into a complete full-stack LMS system with:
*   **Database & Backend Integration**: Storing user progress, exercise answers, and course configurations in a persistent backend database.
*   **Admin Dashboard**: Dedicated admin panels for creators to manage courses, view learner analytics, and modify curriculum structure.
*   **Dynamic Course Content**: Rich-text authoring using the customized [@imksh/editor](https://www.npmjs.com/package/@imksh/editor) for creating and updating study material dynamically from the UI.

