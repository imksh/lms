import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import LMSLayout from "./components/layouts/LMSLayout";
import { Scroll } from "./components/Scroll";

const Dummy = () => null;

const App = () => {
  return (
    <>
      <Scroll />
      <LMSLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />

          {/* React Course Routes */}
          <Route path="/introduction" element={<Dummy />} />
          <Route path="/jsx" element={<Dummy />} />
          <Route path="/components" element={<Dummy />} />
          <Route path="/props" element={<Dummy />} />
          <Route path="/state" element={<Dummy />} />
          <Route path="/events" element={<Dummy />} />
          <Route path="/forms" element={<Dummy />} />
          <Route path="/useeffect" element={<Dummy />} />
          <Route path="/useref" element={<Dummy />} />
          <Route path="/usememo" element={<Dummy />} />
          <Route path="/usecallback" element={<Dummy />} />
          <Route path="/context-api" element={<Dummy />} />
          <Route path="/react-router" element={<Dummy />} />
          <Route path="/api-calls" element={<Dummy />} />
          <Route path="/custom-hooks" element={<Dummy />} />

          {/* JavaScript Course Routes */}
          <Route path="/javascript/basics" element={<Dummy />} />
          <Route path="/javascript/functions" element={<Dummy />} />
          <Route path="/javascript/arrays-objects" element={<Dummy />} />
          <Route path="/javascript/promises-async" element={<Dummy />} />

          {/* Node.js Course Routes */}
          <Route path="/node/intro" element={<Dummy />} />
          <Route path="/node/modules" element={<Dummy />} />
          <Route path="/node/fs-module" element={<Dummy />} />
          <Route path="/node/http-module" element={<Dummy />} />

          {/* Express Course Routes */}
          <Route path="/express/routing" element={<Dummy />} />
          <Route path="/express/middleware" element={<Dummy />} />
          <Route path="/express/controllers" element={<Dummy />} />
          <Route path="/express/error-handling" element={<Dummy />} />

          {/* MongoDB Course Routes */}
          <Route path="/mongodb/nosql-basics" element={<Dummy />} />

          {/* Mongoose Course Routes */}
          <Route path="/mongoose/schemas-models" element={<Dummy />} />

          {/* Authentication Course Routes */}
          <Route path="/authentation/jwt" element={<Dummy />} />
        </Routes>
      </LMSLayout>
    </>
  );
};

export default App;
