export const topicsContent = {
  // --- REACT TOPICS ---
  "/introduction": {
    id: "01-introduction",
    title: "Introduction to React",
    difficulty: "Beginner",
    duration: "10 mins",
    introduction: "React is a popular open-source JavaScript library for building user interfaces, especially single-page applications. Maintained by Meta (Facebook), it focuses on component-based development, offering high performance through the Virtual DOM.",
    analogy: "Think of building a website with raw HTML/JS as sketching on paper with pencils (changing anything requires erasing and redrawing everything). React is like using Lego blocks (each block is self-contained; if you need to change a window, you just snap a new window block in without rebuilding the whole house).",
    whyUse: [
      "Component Reusability: Write a component once, use it across your entire application.",
      "Virtual DOM: Updates only the parts of the page that changed, making transitions incredibly fast.",
      "Declarative UI: Tell React how the UI should look for a given state, and it handles the DOM manipulation."
    ],
    syntax: `// Standard Functional Component
function Welcome() {
  return <h1>Hello, World!</h1>;
}`,
    questions: [
      "What is the role of the Virtual DOM in React?",
      "Explain the concept of component-based architecture in your own words."
    ]
  },
  "/jsx": {
    id: "02-jsx",
    title: "JSX (JavaScript XML)",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like structures directly inside your JavaScript code. Babel compiles JSX down to standard React.createElement() function calls.",
    analogy: "Imagine template stencils. JSX is like having stencils of shapes (HTML) directly on your page layout where you can dynamically fill in colors and texts (JavaScript expressions) in real-time.",
    whyUse: [
      "Readability: Keeps code clean and intuitive by merging structure and logic.",
      "Safety: Escapes values before rendering them, preventing Cross-Site Scripting (XSS) attacks.",
      "Power: Full programmatic control since it compiles directly to standard JavaScript objects."
    ],
    syntax: `const name = "Alex";
const element = <h1 className="title">Hello, {name}!</h1>;`,
    questions: [
      "Why must JSX elements have a single parent wrapper or a Fragment (<>)?",
      "How do you embed JavaScript expressions inside JSX?"
    ]
  },
  "/components": {
    id: "03-components",
    title: "Components",
    difficulty: "Beginner",
    duration: "20 mins",
    introduction: "Components are the building blocks of any React application. They are independent, reusable pieces of UI that act like JavaScript functions. They accept inputs called 'props' and return React elements describing what should appear on the screen.",
    analogy: "Think of components like the parts of a car. You build the engine, the steering wheel, and the seats separately, then assemble them to form a fully functional vehicle. If a wheel goes flat, you replace just the wheel, not the entire car.",
    whyUse: [
      "Modular Code: Keeps your project files small, structured, and easy to navigate.",
      "Separation of Concerns: Each component manages its own presentation and local logic.",
      "Consistency: Ensures UI designs remain consistent across different pages of the app."
    ],
    syntax: `// Functional Component definition
const Button = () => {
  return <button className="btn">Click Me</button>;
};`,
    questions: [
      "What is the main difference between functional components and class components?",
      "Can a component render another component? Explain how."
    ]
  },
  "/props": {
    id: "04-props",
    title: "Props (Properties)",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "Props (short for properties) are read-only inputs passed to components. They allow you to pass data from a parent component down to a child component, enabling customization and configuration of components.",
    analogy: "Think of props as the customization parameters of a manufactured item. A t-shirt factory makes the same shirts, but props specify the size ('L'), color ('blue'), and print text ('React Rocks'). The t-shirt itself cannot change its properties once printed.",
    whyUse: [
      "Dynamic Components: Customize the output of a single component template with different data.",
      "Uni-directional Data Flow: Keeps data flow predictable as it passes from parent to child.",
      "Configurability: Allows child components to stay pure and presentation-focused."
    ],
    syntax: `// Parent passes prop
<UserProfile username="Alice" age={25} />

// Child receives prop
function UserProfile(props) {
  return <p>{props.username} is {props.age} years old.</p>;
}`,
    questions: [
      "Why are props considered read-only (immutable)? What happens if you try to change them directly?",
      "How does object destructuring simplify accessing props in a functional component?"
    ]
  },
  "/state": {
    id: "05-state",
    title: "State & useState Hook",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "State represents the built-in, local memory of a component. Unlike props which are passed down and read-only, state is managed entirely within the component and can change over time. When state changes, the component re-renders.",
    analogy: "Think of a digital scoreboard at a basketball game. The score starts at 0 (initial state). Whenever a team scores, the referee updates the score (setState), which immediately refreshes the scoreboard screen (re-render) for the audience.",
    whyUse: [
      "Interactivity: Enables buttons, toggles, text boxes, and user menus to respond to actions.",
      "Persistence: Remembers user settings, session data, or inputs within the lifecycle of the component.",
      "Automatic Reactivity: React automatically handles updating the DOM whenever a state change occurs."
    ],
    syntax: `import { useState } from 'react';

const [count, setCount] = useState(0);
// Update state:
setCount(count + 1);`,
    questions: [
      "What is the significance of the array returned by useState()?",
      "Why should you never mutate state directly (e.g., state = newValue)?"
    ]
  },
  "/events": {
    id: "06-events",
    title: "Event Handling",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "React handles events similarly to HTML elements, with some key syntax differences: React events are named using camelCase (e.g., onClick instead of onclick) and you pass a function reference as the event handler rather than a string.",
    analogy: "Think of event handling like setting up a doorbell. The button is the event trigger (onClick). The wiring connects the button to a chime sound function. When someone presses the button, the chime triggers.",
    whyUse: [
      "Synthetic Events: React wraps browser native events in a cross-browser SyntheticEvent wrapper.",
      "Declarative Setup: Define event hooks directly on the tags inside your JSX.",
      "Dynamic Responses: Perform any state change or trigger logic when users hover, keypress, click, or submit."
    ],
    syntax: `<button onClick={(e) => console.log('Clicked!', e)}>
  Click Me
</button>`,
    questions: [
      "What is a SyntheticEvent in React, and why is it useful?",
      "Why do we pass function references (e.g., onClick={handleClick}) instead of executing them immediately (e.g., onClick={handleClick()})?"
    ]
  },
  "/forms": {
    id: "07-forms",
    title: "Forms & Controlled Components",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "In React, forms are typically built using 'controlled components'. This means the form input values are bound to React state, making state the 'single source of truth'. Every keystroke updates state, which then updates the input value.",
    analogy: "Think of a smart-home thermostat. You don't just spin a dial that turns on the heat independently. Instead, when you turn the dial, it updates a central digital target temperature (state), which then updates the heater and the screen view.",
    whyUse: [
      "Real-time Validation: Instantaneously validate input fields as the user types.",
      "Pre-filled Fields: Easily populate form inputs with data fetched from APIs.",
      "Clean Submissions: Form state is already compiled in Javascript, making submits trivial."
    ],
    syntax: `const [value, setValue] = useState("");

<input 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>`,
    questions: [
      "What is the difference between a controlled component and an uncontrolled component?",
      "Why is e.preventDefault() crucial in form onSubmit handlers?"
    ]
  },
  "/useeffect": {
    id: "08-useeffect",
    title: "useEffect Hook",
    difficulty: "Intermediate",
    duration: "30 mins",
    introduction: "The useEffect hook allows functional components to perform side effects. Side effects include data fetching, manually modifying the DOM, setting up subscriptions, and starting timers. It runs after renders.",
    analogy: "Think of useEffect like a smart porch light with a sensor. You can program it: 'Turn on once when I first move in (empty array)', or 'Turn on every time it gets dark (dependency array containing [isDark])'. It performs these actions outside of just existing as a lightbulb.",
    whyUse: [
      "Lifecycle Management: Merges componentDidMount, componentDidUpdate, and componentWillUnmount behaviors.",
      "API Synchronization: Load external database content as soon as a page displays.",
      "Resource Cleanup: Clean up event listeners, intervals, and sockets to prevent memory leaks."
    ],
    syntax: `useEffect(() => {
  console.log("Mounted or Updated!");
  return () => console.log("Cleaned up!");
}, [dependencies]);`,
    questions: [
      "What happens if you omit the dependency array in a useEffect hook?",
      "How and when is the cleanup function (returned by the hook) executed?"
    ]
  },
  "/useref": {
    id: "09-useref",
    title: "useRef Hook",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "useRef is a React Hook that lets you reference a value that's not needed for rendering. It returns a mutable ref object whose .current property is initialized to the passed argument. Crucially, mutating it doesn't trigger a re-render.",
    analogy: "Think of a secret notepad in your pocket. You can pull it out, jot down a tally, or check a detail without changing your clothes or updating the whiteboard in front of the whole room. You can also use it to point directly at an object, like pointing your finger at a specific chair.",
    whyUse: [
      "DOM Access: Focus inputs, scroll containers, or measure DOM layout directly.",
      "Store Mutable Values: Keep track of timers, intervals, or previous state values without re-triggering renders.",
      "Performance: Avoids heavy layout reflows when values only track internal logs."
    ],
    syntax: `const inputRef = useRef(null);
// Focus DOM:
inputRef.current.focus();

<input ref={inputRef} />`,
    questions: [
      "Compare state vs. ref. When would you use one over the other?",
      "How do you link a useRef instance to a physical DOM element?"
    ]
  },
  "/usememo": {
    id: "10-usememo",
    title: "useMemo Hook",
    difficulty: "Advanced",
    duration: "20 mins",
    introduction: "useMemo is a React Hook that lets you cache (memoize) the result of a calculation between re-renders. It evaluates the function only when one of its dependencies changes, saving processing time for expensive operations.",
    analogy: "Think of an accountant resolving a massive tax ledger. If you ask for the total sum multiple times without any new bills added, they will just read the previously calculated total from a sticky note (cached value) rather than re-summing all thousands of lines.",
    whyUse: [
      "Performance Optimization: Prevent heavy computations from running on every single render.",
      "Referential Equality: Cache objects and arrays so child components don't re-render from shallow reference changes."
    ],
    syntax: `const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);`,
    questions: [
      "Under what circumstances should you NOT use useMemo?",
      "How does useMemo contribute to keeping components pure?"
    ]
  },
  "/usecallback": {
    id: "11-usecallback",
    title: "useCallback Hook",
    difficulty: "Advanced",
    duration: "25 mins",
    introduction: "useCallback is a React Hook that returns a memoized version of a callback function. It caches the function definition itself between renders, preventing recreation of the function unless dependencies change.",
    analogy: "Imagine giving a child a custom written recipe on a card. Instead of writing the recipe out from scratch on a new piece of paper every single time they want to cook, you give them the same printed recipe card to reuse, saving paper and effort.",
    whyUse: [
      "Optimize Child Renders: Pass stable callbacks to optimized child components (like React.memo) without breaking reference equality.",
      "Stable Dependencies: Keep function references constant when used as dependencies in useEffect."
    ],
    syntax: `const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`,
    questions: [
      "What is the difference between useMemo and useCallback?",
      "Why does a function reference change on every render in standard JavaScript?"
    ]
  },
  "/context-api": {
    id: "12-contextapi",
    title: "Context API",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "The Context API is a built-in React feature that allows you to share global data (like themes, user login states, or languages) across the entire component tree without manually passing props down through every single level (prop drilling).",
    analogy: "Think of prop drilling like passing a physical note through a chain of students in a lecture hall to reach the back. Context is like installing a speaker system: the professor speaks, and everyone in the room hears it instantly.",
    whyUse: [
      "Solve Prop Drilling: No need to pass variables through intermediate components that don't need them.",
      "Global State: Perfect for app-wide settings like light/dark mode, cart data, or user profiles.",
      "Built-in: No external libraries like Redux needed for lightweight global state."
    ],
    syntax: `const ThemeContext = createContext("light");

// Provider
<ThemeContext.Provider value="dark">
  <Sidebar />
</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext);`,
    questions: [
      "What is prop drilling, and why can it become a problem in large applications?",
      "What are the performance implications of updating a Context value?"
    ]
  },
  "/react-router": {
    id: "13-reactrouter",
    title: "React Router",
    difficulty: "Intermediate",
    duration: "30 mins",
    introduction: "React Router is the standard routing library for React. It enables client-side routing, meaning the application can display different components based on the URL without requesting a brand new HTML document from the server.",
    analogy: "Think of a house with different themed rooms. Moving from the kitchen to the bedroom is done instantly inside the house. You don't demolish the house and build a new one just to go into another room.",
    whyUse: [
      "Single Page Experience: Near-instantaneous page transitions since resources are already loaded.",
      "Dynamic Matching: Easily match parameters (e.g. /users/:id) to load content programmatically.",
      "History Management: Maintains the browser back and forward buttons naturally."
    ],
    syntax: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <nav><Link to="/about">About</Link></nav>
  <Routes>
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>`,
    questions: [
      "How does Client-Side Routing differ from Server-Side Routing?",
      "How do you fetch dynamic parameters from a URL path (e.g. /profile/:username)?"
    ]
  },
  "/api-calls": {
    id: "14-apicalls",
    title: "API Calls & Data Fetching",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "React components display data. Frequently, this data lives on a backend server database. React uses standard JavaScript APIs like fetch() or libraries like axios to make HTTP requests, typically inside a useEffect hook.",
    analogy: "Think of a restaurant customer. The chef in the kitchen has the food (database/server). The waiter (fetch/axios) goes to the kitchen, gets the plate, and serves it to your table (React UI rendering).",
    whyUse: [
      "Dynamic Pages: Load fresh, live database content without page reloads.",
      "Asynchronous Loading: Keep the app responsive by showing loaders while fetching records.",
      "Saves Bandwidth: Only fetch raw data (JSON), rather than entire pre-rendered HTML pages."
    ],
    syntax: `useEffect(() => {
  fetch("https://api.example.com/data")
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error(err));
}, []);`,
    questions: [
      "Why is it essential to provide an empty dependency array [] when loading initial data in useEffect?",
      "How do you handle loading and error states during an asynchronous API request?"
    ]
  },
  "/custom-hooks": {
    id: "15-customhooks",
    title: "Custom Hooks",
    difficulty: "Advanced",
    duration: "20 mins",
    introduction: "Custom Hooks are JavaScript functions that start with the word 'use' and can call other Hooks. They allow you to extract component stateful logic into reusable functions, separating business logic from visual layouts.",
    analogy: "Think of a contractor's toolbox. Instead of assembling individual screwdrivers, batteries, and drills from scratch for every job, they pack a customized toolbox preset for mounting TVs, carrying it from house to house.",
    whyUse: [
      "DRY Principle: Don't Repeat Yourself. Share stateful logic across multiple components.",
      "Clean Code: Keeps visual components simple and highly readable.",
      "Testability: Test business logic independently of components."
    ],
    syntax: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}`,
    questions: [
      "What are the two golden rules of React Hooks?",
      "Does sharing a custom hook share the state values between the components using it? Explain."
    ]
  },

  // --- JAVASCRIPT TOPICS ---
  "/javascript/basics": {
    id: "js-basics",
    title: "JavaScript Basics",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "Variables are containers for storing data values. In modern JavaScript, we use let and const instead of var. Types include strings, numbers, booleans, null, undefined, and objects.",
    analogy: "Think of variables as cardboard boxes in a storage room. A 'const' box is sealed with superglue once you put an item inside; you can't replace the item. A 'let' box has a lid you can lift to swap items whenever you like.",
    whyUse: [
      "Data Storage: Keep track of state, values, and configuration in memory.",
      "Modern Standards: 'let' and 'const' provide block scoping, avoiding tricky hoisting bugs."
    ],
    syntax: `const maxRetries = 3; // Immutable
let currentTry = 0;   // Mutable`,
    questions: [
      "What is the key difference between const, let, and var?",
      "Name 5 primitive data types in JavaScript."
    ]
  },
  "/javascript/functions": {
    id: "js-functions",
    title: "Functions & Closures",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Functions are callable blocks of code. ES6 arrow functions provide concise syntax. Closures allow inner functions to remember variables from their outer scope even after the outer function has executed.",
    analogy: "Think of a function like a automated coffee maker. You pass inputs (beans, water), it runs internal machinery, and returns an output (coffee). A closure is like the coffee maker remembering your personal sugar preference from your last visit.",
    whyUse: [
      "Reusability: Write logic once and execute it dynamically anywhere.",
      "Encapsulation: Restrict variable scopes to prevent collision."
    ],
    syntax: `const greet = (name) => \`Hello, \${name}!\`;`,
    questions: [
      "How do arrow functions handle the 'this' keyword differently?",
      "What is a closure in JavaScript? Explain with an example."
    ]
  },
  "/javascript/arrays-objects": {
    id: "js-arrays-objects",
    title: "Arrays & Object Destructuring",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "Arrays are ordered lists of values, while Objects store key-value pairs. ES6 destructuring allows unpacking values from arrays or properties from objects into distinct variables.",
    analogy: "Imagine a bento box (array) or a chest of labeled drawers (object). Destructuring is like grabbing the exact items you want in one single reach instead of digging item-by-item.",
    whyUse: [
      "Clean Code: Destructuring drastically reduces boilerplate.",
      "Functional Programming: Map, filter, and reduce allow concise data processing."
    ],
    syntax: `const [first, second] = ['Apple', 'Banana'];
const { name, age } = { name: 'Bob', age: 30 };`,
    questions: [
      "What is the difference between .map() and .forEach()?",
      "Explain the array spread operator (...)."
    ]
  },
  "/javascript/promises-async": {
    id: "js-promises-async",
    title: "Promises & Async/Await",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "A Promise is an object representing the eventual completion or failure of an asynchronous operation. Async/Await is a syntactic sugar wrapper that makes async code look synchronous.",
    analogy: "Think of ordering food at a restaurant pager. The pager is a Promise. It's 'pending' at first. When it flashes (resolves), you collect your hot food. If it breaks (rejects), you get a refund.",
    whyUse: [
      "Avoid Callback Hell: Code stays linear, readable, and flat instead of heavily nested.",
      "Centralized Errors: Easily catch failures using try-catch blocks."
    ],
    syntax: `async function loadData() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
    questions: [
      "What are the three states of a Promise?",
      "How does try/catch handle errors in async/await functions?"
    ]
  },

  // --- EXPRESS TOPICS ---
  "/express/routing": {
    id: "express-routing",
    title: "Express Routing",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method.",
    analogy: "Think of an office receptionist directory. If you want to view reports, you are directed to Room 1 (GET /reports). If you want to file a new complaint, you go to Room 2 (POST /complaints).",
    whyUse: [
      "Structured Endpoints: Expose clear APIs for your frontend application.",
      "HTTP Semantic Methods: Use GET, POST, PUT, and DELETE correctly."
    ],
    syntax: `app.get('/users', (req, res) => {
  res.send('Get all users');
});`,
    questions: [
      "What are the 4 main HTTP verbs used in API routing?",
      "How do you define a dynamic route parameter in Express (e.g. user ID)?"
    ]
  },
  "/express/middleware": {
    id: "express-middleware",
    title: "Express Middleware",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.",
    analogy: "Think of security guards checking tickets at a concert gate. The first guard checks your bag (body parser). The second checks your ticket (auth middleware). If everything matches, they let you pass to the main show (controller).",
    whyUse: [
      "Modular Pipeline: Layer headers checks, authentication, body-parsing, logging, and CORS.",
      "Clean Code: Re-use common checks across dozens of controllers easily."
    ],
    syntax: `app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});`,
    questions: [
      "What is the role of the next() function in Express middleware?",
      "Give an example of a built-in Express middleware."
    ]
  },
  "/express/controllers": {
    id: "express-controllers",
    title: "MVC & Controllers",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Controllers are the functional callbacks bound to Express routes. They receive requests, execute logic (such as reading from database models), and send responses back to the client.",
    analogy: "Think of a restaurant waiter/chef pattern. The route is the order ticket. The controller is the chef in the kitchen who grabs the ingredients, prepares the dish, and plates it.",
    whyUse: [
      "Architecture Isolation: Keeps your router file clean and tidy.",
      "Unit Testing: Test controller functions independently of route setups."
    ],
    syntax: `// In controller file:
exports.getDashboard = (req, res) => {
  res.render('dashboard');
};`,
    questions: [
      "How does isolating route paths from controllers benefit scaling projects?",
      "How do controllers interact with models?"
    ]
  },
  "/express/error-handling": {
    id: "express-error-handling",
    title: "Express Error Handling",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Express comes with a built-in error handler that takes care of any errors that might be encountered in the app. Writing custom error handler middleware lets you format error outputs safely.",
    analogy: "Think of a crash airbag in a car. No matter where the collision happens (routing, controller, or database), the airbag deploys globally to prevent catastrophic failure.",
    whyUse: [
      "Prevent Server Crashes: Ensure exceptions are caught without terminating the node process.",
      "Hide Stack Traces: Return clear error messages in production while logging details internally."
    ],
    syntax: `app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});`,
    questions: [
      "How does Express distinguish error-handling middleware from normal middleware?",
      "Why should you never expose full error stacks to users in production?"
    ]
  },

  // --- NODE TOPICS ---
  "/node/intro": {
    id: "node-intro",
    title: "Node.js Basics",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine that executes JavaScript code outside a web browser.",
    analogy: "Think of JavaScript as a engine. Originally, it was only installed inside cars (web browsers). Node.js took that same engine and installed it inside power generators, boats, and houses (servers) so it could run anywhere.",
    whyUse: [
      "Single Language: Write both frontend client and backend server code in Javascript.",
      "Non-Blocking I/O: Handle thousands of concurrent requests with lightweight memory footprint."
    ],
    syntax: `// Running a file via terminal
$ node server.js`,
    questions: [
      "Why is Node.js called asynchronous and non-blocking?",
      "What engine does Node.js use to compile JavaScript?"
    ]
  },
  "/node/modules": {
    id: "node-modules",
    title: "CommonJS vs ES Modules",
    difficulty: "Intermediate",
    duration: "15 mins",
    introduction: "Modules let you break code into separate files. CommonJS is the legacy default in Node.js, while ES Modules is the modern JavaScript standard.",
    analogy: "Think of electrical plugs. CommonJS is like the UK plug standard (sturdy, traditional). ES Modules is like the USB-C standard (universal, modern). They do the same job but have different connectors.",
    whyUse: [
      "Code Separation: Avoid massive single files.",
      "Module Scoping: Variables declared inside a module are private unless explicitly exported."
    ],
    syntax: `// CommonJS export:
module.exports = { add };

// ES Module export:
export const add = (a, b) => a + b;`,
    questions: [
      "How do require() and import statements differ in terms of loading timing?",
      "How do you enable ES Modules in a Node.js project package.json?"
    ]
  },
  "/node/fs-module": {
    id: "node-fs-module",
    title: "File System (fs)",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "The Node.js File System module allows you to work with the file system on your computer, providing both synchronous and asynchronous methods to create, read, update, and delete files.",
    analogy: "Think of the fs module as a virtual clerk with keys to your computer's filing cabinet. You can instruct them: 'Go read folder A' or 'Create a new spreadsheet with this data'.",
    whyUse: [
      "Persistent Logging: Write system operations directly to local server files.",
      "Data Pipelines: Load, parse, and upload media assets or local configuration files."
    ],
    syntax: `import fs from 'fs';
fs.readFile('data.txt', 'utf8', (err, data) => {
  console.log(data);
});`,
    questions: [
      "Why are asynchronous file system methods (e.g. fs.readFile) preferred over synchronous ones?",
      "What is the purpose of the 'utf8' encoding parameter when reading files?"
    ]
  },
  "/node/http-module": {
    id: "node-http-module",
    title: "Node.js HTTP Server",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Node.js has a built-in module called HTTP, which allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP) and create web server instances directly.",
    analogy: "Think of the HTTP module as building a toll booth on a highway. You specify the road number (port) and instruct the collector to listen for passing cars (requests) and give them a receipt (response).",
    whyUse: [
      "Low-level Control: Build custom light servers without depending on any external frameworks.",
      "Microservices: Create small utility handlers that interface directly over TCP."
    ],
    syntax: `import http from 'http';
const server = http.createServer((req, res) => {
  res.end('Hello Server');
});
server.listen(3000);`,
    questions: [
      "What arguments are passed to the createServer() callback function?",
      "What does server.listen(3000) accomplish?"
    ]
  },

  // --- MONGODB TOPICS ---
  "/mongodb/nosql-basics": {
    id: "mongodb-basics",
    title: "MongoDB & NoSQL",
    difficulty: "Beginner",
    duration: "15 mins",
    introduction: "NoSQL databases store data in formats other than relational tables. MongoDB is a document-oriented database that stores records in flexible, binary-encoded JSON structures called BSON.",
    analogy: "A SQL database is like a spreadsheet where every row must have the exact same columns. A NoSQL document database is like a file drawer containing index cards. Each card can have unique lines, fields, or items without breaking the system.",
    whyUse: [
      "Flexible Schema: Easily add new properties to your records without running complex migrations.",
      "JSON Friendly: Maps natively to JavaScript objects, removing object-relational friction."
    ],
    syntax: `// Standard MongoDB Document
{
  "_id": "60c72b2f9b1d8e23",
  "name": "Jane Doe",
  "skills": ["React", "Express"]
}`,
    questions: [
      "Explain the difference between SQL and NoSQL.",
      "What is BSON, and how does it relate to JSON?"
    ]
  },

  // --- MONGOOSE TOPICS ---
  "/mongoose/schemas-models": {
    id: "mongoose-schemas",
    title: "Mongoose Schemas",
    difficulty: "Intermediate",
    duration: "20 mins",
    introduction: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and representations in MongoDB.",
    analogy: "Think of Mongoose as a building inspector. MongoDB is wild, open land where you can build anything. Mongoose forces you to draw blueprints (schemas) and checks that every house has walls, plumbing, and correct dimensions.",
    whyUse: [
      "Strict Schema Validation: Ensure invalid or malicious fields aren't saved to your database.",
      "Hook Middleware: Automatically hash passwords or trigger events pre-save or post-save."
    ],
    syntax: `const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: Number
});`,
    questions: [
      "What is the difference between a Schema and a Model in Mongoose?",
      "How do Mongoose validators secure database writes?"
    ]
  },

  // --- AUTH TOPICS ---
  "/authentation/jwt": {
    id: "auth-jwt",
    title: "JSON Web Tokens (JWT)",
    difficulty: "Intermediate",
    duration: "25 mins",
    introduction: "JSON Web Token is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. It is signed, making it tamper-proof.",
    analogy: "Think of a JWT as a security wristband at a music festival. The gate staff signs it with a special stamp. Inside, security guards check the stamp's signature to let you enter VIP areas without calling the box office every time.",
    whyUse: [
      "Stateless Sessions: No need to store active session IDs in a database, saving server RAM.",
      "Secure Claims: Encrypted signature guarantees client claims haven't been altered."
    ],
    syntax: `import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: 123 }, 'my_secret', { expiresIn: '1h' });`,
    questions: [
      "What are the three parts of a JWT?",
      "Where should JWTs be stored in the browser for maximum security?"
    ]
  }
};
