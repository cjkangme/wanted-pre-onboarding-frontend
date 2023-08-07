import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SingUp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/"></Route>
          <Route path="/signup" Component={SignUp}></Route>
          <Route path="/signin"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
