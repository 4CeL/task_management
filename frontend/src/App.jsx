import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Kanban from "./pages/Kanban";
import Calendar from "./pages/Calendar";

function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
              <ProtectedRoute>
                  <Dashboard />
              </ProtectedRoute>
          }
        />  

        <Route
          path="/kanban"
          element={
              <ProtectedRoute>
                  <Kanban />
              </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
              <ProtectedRoute>
                  <Tasks />
              </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
              <ProtectedRoute>
                  <Calendar />
              </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
              <ProtectedRoute>
                  <Profile />
              </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;