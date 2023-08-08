import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicRouter, PrivateRouter } from "./utils/Router";
import SignUp from "./pages/SingUp";
import SignIn from "./pages/SignIn";
import Todo from "./pages/Todo";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/"></Route>

          <Route element={<PublicRouter />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>

          <Route element={<PrivateRouter />}>
            <Route path="todo" element={<Todo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
