import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Module from "../models/module.model.js";
import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Submission from "../models/submission.model.js";
import Meta from "../models/meta.model.js";
import { topicsContent } from "./topicsContent.js";

dotenv.config();

// ─── DEMO USERS ───────────────────────────────────────────────
const defaultUsers = [
  {
    name: "Admin User",
    email: "admin@lms.dev",
    password: "admin123",
    role: "admin",
    isApproved: true,
  },
  {
    name: "Teacher Demo",
    email: "teacher@lms.dev",
    password: "teacher123",
    role: "teacher",
    isApproved: true,
  },
  {
    name: "Student Demo",
    email: "student@lms.dev",
    password: "student123",
    role: "student",
    isApproved: true,
  },
];

// ─── MODULE ────────────────────────────────────────────────────
const defaultModule = {
  title: "MERN Stack Bootcamp",
  description:
    "A full-stack JavaScript bootcamp covering MongoDB, Express, React, and Node.js — from fundamentals to deployment.",
  icon: "BookOpen",
  color: "border-primary/30 hover:border-primary bg-primary/5",
  iconColor: "text-primary",
  path: "/",
  order: 1,
};

// ─── META ──────────────────────────────────────────────────────
const defaultMeta = {
  lmsTitle: "MERN Stack LMS",
  lmsTagline: "Learn, Build, Ship — the full-stack way.",
  primaryColor: "#6366f1",
  contactEmail: "hello@lms.dev",
  footerText: "© 2025 MERN Stack LMS. All rights reserved.",
};

// ─── SUBJECTS (order matters — refs module & teacher set at runtime) ───
const defaultSubjects = [
  {
    key: "react",
    title: "React Masterclass",
    icon: "FaReact",
    desc: "Build reactive UIs using JSX, components, props, state, effects, context, and custom hooks.",
    path: "/introduction",
    color: "border-blue-500/30 hover:border-blue-500 bg-blue-500/5",
    iconColor: "text-blue-500",
    order: 1,
  },
  {
    key: "javascript",
    title: "JavaScript Basics",
    icon: "IoLogoJavascript",
    desc: "Master variables, ES6 features, arrays, objects, promises, and async/await.",
    path: "/javascript/basics",
    color: "border-yellow-500/30 hover:border-yellow-500 bg-yellow-500/5",
    iconColor: "text-yellow-500",
    order: 2,
  },
  {
    key: "node",
    title: "Node.js Server",
    icon: "FaNodeJs",
    desc: "Build server-side JavaScript applications using Node.js, CommonJS, and ESModules.",
    path: "/node/intro",
    color: "border-green-500/30 hover:border-green-500 bg-green-500/5",
    iconColor: "text-green-500",
    order: 3,
  },
  {
    key: "express",
    title: "Express API Framework",
    icon: "SiExpress",
    desc: "Create RESTful APIs with Express, middleware, routing, controllers, and error handling.",
    path: "/express/routing",
    color: "border-purple-500/30 hover:border-purple-500 bg-purple-500/5",
    iconColor: "text-purple-500",
    order: 4,
  },
  {
    key: "mongodb",
    title: "MongoDB NoSQL",
    icon: "SiMongodb",
    desc: "Learn document-based NoSQL databases with CRUD, indexing, aggregation, and Atlas setup.",
    path: "/mongodb/nosql-basics",
    color: "border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5",
    iconColor: "text-emerald-600",
    order: 5,
  },
  {
    key: "mongoose",
    title: "Mongoose ODM",
    icon: "SiMongoosedotws",
    desc: "Define schemas, models, virtuals, middlewares, and relations using Mongoose.",
    path: "/mongoose/schemas-models",
    color: "border-orange-500/30 hover:border-orange-500 bg-orange-500/5",
    iconColor: "text-orange-500",
    order: 6,
  },
  {
    key: "authentation",
    title: "Auth & Session JWT",
    icon: "FaShieldAlt",
    desc: "Implement secure authentication with JWT tokens, bcrypt, cookies, and protected routes.",
    path: "/authentation/jwt",
    color: "border-gray-500/30 hover:border-gray-500 bg-gray-500/5",
    iconColor: "text-gray-500",
    order: 7,
  },
];

// ─── COURSES CONFIG (subject → topic paths) ────────────────────
const coursesConfig = {
  react: {
    topics: [
      {
        path: "/introduction",
        title: "01. Introduction",
        id: "01-introduction",
      },
      { path: "/jsx", title: "02. JSX", id: "02-jsx" },
      { path: "/components", title: "03. Components", id: "03-components" },
      { path: "/props", title: "04. Props", id: "04-props" },
      { path: "/state", title: "05. State & useState", id: "05-state" },
      { path: "/events", title: "06. Events", id: "06-events" },
      { path: "/forms", title: "07. Forms & Inputs", id: "07-forms" },
      { path: "/useeffect", title: "08. useEffect Hook", id: "08-useeffect" },
      { path: "/useref", title: "09. useRef Hook", id: "09-useref" },
      { path: "/usememo", title: "10. useMemo Hook", id: "10-usememo" },
      {
        path: "/usecallback",
        title: "11. useCallback Hook",
        id: "11-usecallback",
      },
      { path: "/context-api", title: "12. Context API", id: "12-contextapi" },
      {
        path: "/react-router",
        title: "13. React Router",
        id: "13-reactrouter",
      },
      { path: "/api-calls", title: "14. API Fetching", id: "14-apicalls" },
      {
        path: "/custom-hooks",
        title: "15. Custom Hooks",
        id: "15-customhooks",
      },
    ],
  },
  javascript: {
    topics: [
      {
        path: "/javascript/basics",
        title: "01. Variables & Types",
        id: "js-basics",
      },
      {
        path: "/javascript/functions",
        title: "02. Functions & Closures",
        id: "js-functions",
      },
      {
        path: "/javascript/arrays-objects",
        title: "03. Arrays & Objects",
        id: "js-arrays-objects",
      },
      {
        path: "/javascript/promises-async",
        title: "04. Promises & Async",
        id: "js-promises-async",
      },
    ],
  },
  node: {
    topics: [
      { path: "/node/intro", title: "01. Node Intro", id: "node-intro" },
      {
        path: "/node/modules",
        title: "02. CommonJS vs ESM",
        id: "node-modules",
      },
      {
        path: "/node/fs-module",
        title: "03. File System (fs)",
        id: "node-fs-module",
      },
      {
        path: "/node/http-module",
        title: "04. HTTP Server",
        id: "node-http-module",
      },
    ],
  },
  express: {
    topics: [
      {
        path: "/express/routing",
        title: "01. Routing Basics",
        id: "express-routing",
      },
      {
        path: "/express/middleware",
        title: "02. Middleware Concept",
        id: "express-middleware",
      },
      {
        path: "/express/controllers",
        title: "03. Controllers & MVC",
        id: "express-controllers",
      },
      {
        path: "/express/error-handling",
        title: "04. Error Handlers",
        id: "express-error-handling",
      },
    ],
  },
  mongodb: {
    topics: [
      {
        path: "/mongodb/nosql-basics",
        title: "01. NoSQL Basics",
        id: "mongodb-basics",
      },
    ],
  },
  mongoose: {
    topics: [
      {
        path: "/mongoose/schemas-models",
        title: "01. Schemas & Models",
        id: "mongoose-schemas",
      },
    ],
  },
  authentation: {
    topics: [
      {
        path: "/authentation/jwt",
        title: "01. JWT & Sessions",
        id: "auth-jwt",
      },
    ],
  },
};

// ─── MAIN SEED FUNCTION ────────────────────────────────────────
export const seedDatabase = async () => {
  try {
    const subjectCount = await Subject.countDocuments();
    if (subjectCount > 0) {
      console.log("Database already seeded.");
      return;
    }

    console.log("Seeding database...");

    // 1. Seed Users
    const userMap = {}; // email → _id
    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        userMap[u.email] = exists._id;
        continue;
      }
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const created = await User.create({ ...u, password: hashedPassword });
      userMap[u.email] = created._id;
      console.log(`  ✔ User: ${u.email} (${u.role})`);
    }

    // 2. Seed Module
    const mod = await Module.create(defaultModule);
    console.log(`  ✔ Module: ${mod.title}`);

    // 3. Seed Meta (singleton)
    const existingMeta = await Meta.findOne();
    if (!existingMeta) {
      await Meta.create(defaultMeta);
      console.log("  ✔ Meta document created");
    }

    // 4. Seed Subjects (linked to module + teacher)
    const teacherId = userMap["teacher@lms.dev"];
    const subjectMap = {}; // key → _id
    for (const s of defaultSubjects) {
      const created = await Subject.create({
        ...s,
        module: mod._id,
        teacher: teacherId,
      });
      subjectMap[s.key] = created._id;
      console.log(`  ✔ Subject: ${s.title}`);
    }

    // 5. Seed Topics (linked to subject ObjectId)
    const topicsToInsert = [];
    for (const [subjectKey, course] of Object.entries(coursesConfig)) {
      const subjectId = subjectMap[subjectKey];

      course.topics.forEach((t, idx) => {
        const content = topicsContent[t.path] || {};

        const playgroundCode =
          subjectKey === "react"
            ? `import React from "react";\n\nfunction App() {\n  return (\n    <div className="flex justify-center items-center h-full w-full">\n      Playground for ${t.title}...\n    </div>\n  );\n}\nexport default App;`
            : `// Playground for ${t.title}\nconsole.log("Hello World");`;

        const quiz = [
          {
            question: `What is the primary concept covered in ${t.title}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswerIndex: 0,
          },
        ];

        const sections = [];

        if (content.introduction) {
          sections.push({
            title: "Lesson Overview",
            content: `<p class="text-base-content/85 leading-relaxed">${content.introduction}</p>`,
          });
        }
        if (content.analogy) {
          sections.push({
            title: "Real-World Analogy",
            content: `<p class="text-base-content/85 leading-relaxed italic border-l-4 border-accent/40 pl-4 bg-accent/5 py-3 rounded-r-2xl">${content.analogy}</p>`,
          });
        }
        if (content.whyUse && content.whyUse.length > 0) {
          const advHtml = `<ul class="space-y-2 mt-2">${content.whyUse
            .map(
              (r) =>
                `<li class="flex gap-2 text-sm"><span class="text-success font-bold">✔</span><span class="text-base-content/80">${r}</span></li>`,
            )
            .join("")}</ul>`;
          sections.push({ title: "Advantages & Use Cases", content: advHtml });
        }
        if (content.syntax) {
          sections.push({
            title: "Code Blueprint",
            content: `<pre class="mockup-code bg-neutral text-neutral-content p-4 rounded-2xl overflow-x-auto whitespace-pre font-mono text-xs mt-2"><code>${content.syntax}</code></pre>`,
          });
        }
        sections.push({
          title: "Hands-on Exercise Challenge",
          content: `<p class="text-base-content/80 text-sm">Read the task instructions below and submit your response to complete this lesson.</p>`,
          task: {
            title: `Challenge: ${t.title}`,
            text: `Implement a brief script or component showing ${t.title} or summarize its key features.`,
            points: 10,
            submissionType: subjectKey === "react" ? "playground" : "text",
          },
        });

        topicsToInsert.push({
          subject: subjectId,
          subjectKey,
          topicId: t.path,
          title: content.title || t.title,
          difficulty: content.difficulty || "Beginner",
          duration: content.duration || "10 mins",
          playgroundCode,
          quiz,
          sections,
          order: idx + 1,
        });
      });
    }

    await Topic.insertMany(topicsToInsert);
    console.log(`  ✔ Topics: ${topicsToInsert.length} inserted`);
    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};

// ─── CLI DIRECT EXECUTION ─────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const runDirectly = async () => {
    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/lms";
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB for direct seeding...");

      await Promise.all([
        User.deleteMany({}),
        Module.deleteMany({}),
        Subject.deleteMany({}),
        Topic.deleteMany({}),
        Submission.deleteMany({}),
        Meta.deleteMany({}),
      ]);
      console.log("Cleared all collections.");

      await seedDatabase();
      mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error("Direct seeding failed:", err);
      process.exit(1);
    }
  };
  runDirectly();
}
