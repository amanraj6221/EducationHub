// 📂 C:\Aman Raj\EduSangrah\src\components\ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "student" | "faculty";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  let token: string | null = null;
  let user: any = null;

  try {
    // ✅ Get token & user info from localStorage based on role
    if (role === "faculty") {
      token = localStorage.getItem("faculty_token");       // Updated key
      user = JSON.parse(localStorage.getItem("faculty_user") || "null"); // Updated key
    } else if (role === "student") {
      token = localStorage.getItem("student_token");
      user = JSON.parse(localStorage.getItem("student_user") || "null");
    }
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    token = null;
    user = null;
  }

  // 🔹 Redirect to login if token is missing
  if (!token) {
    if (role === "faculty") return <Navigate to="/faculty/login" replace />;
    if (role === "student") return <Navigate to="/student/login" replace />;
    return <Navigate to="/" replace />;
  }

  // 🔹 Redirect to home if role mismatch
  if (role && user?.role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 🔹 If all good, render the protected content
  return children;
};

export default ProtectedRoute;
