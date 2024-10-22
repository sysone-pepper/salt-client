import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimatedBackground from "./layout/AnimatedBackground";
import LoginForm from "./components/LoginForm";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <Routes>
          <Route
            path="/"
            element={<LoginForm setCurrentUser={setCurrentUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
