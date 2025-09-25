// 📂 C:\Aman Raj\EduSangrah\src\App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// --- Student Pages ---
import StudentRegister from "./pages/student/StudentRegister";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";

// --- Student Sections ---
import PersonalProfile from "./pages/student/sections/PersonalProfile";
import EducationSection from "./pages/student/sections/EducationSection";
import ExperienceSection from "./pages/student/sections/ExperienceSection";
import SkillsSection from "./pages/student/sections/SkillsSection";
import CertificationsSection from "./pages/student/sections/CertificationsSection";
import TrainingSection from "./pages/student/sections/TrainingSection";
import VolunteerSection from "./pages/student/sections/VolunteerSection";
import AdditionalInfoSection from "./pages/student/sections/AdditionalInfoSection";
import FinalSubmitSection from "./pages/student/sections/FinalSubmitSection";
import ProjectsSection from "./pages/student/sections/ProjectsSection";

// --- Faculty Pages ---
import FacultyRegister from "./pages/faculty/FacultyRegister";
import FacultyLogin from "./pages/faculty/FacultyLogin";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import CertificateValidation from "./pages/faculty/CertificateValidation";
import DocumentVerification from "./pages/faculty/DocumentVerification";

import FacultyLayout from "./layouts/FacultyLayout";

// --- Protected Route ---
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const studentId = "12345"; // Replace with logged-in studentId

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />

            {/* Student Routes */}
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="overview" element={<StudentDashboard />} />
              <Route path="profile" element={<PersonalProfile studentId={studentId} />} />
              <Route path="education" element={<EducationSection studentId={studentId} />} />
              <Route path="experience" element={<ExperienceSection studentId={studentId} />} />
              <Route path="skills" element={<SkillsSection studentId={studentId} />} />
              <Route path="certifications" element={<CertificationsSection studentId={studentId} />} />
              <Route path="training" element={<TrainingSection studentId={studentId} />} />
              <Route path="documents" element={<ProjectsSection studentId={studentId} />} />
              <Route path="social" element={<AdditionalInfoSection studentId={studentId} />} />
              <Route path="volunteer" element={<VolunteerSection studentId={studentId} />} />
              <Route path="additional" element={<AdditionalInfoSection studentId={studentId} />} />
              <Route path="final-submit" element={<FinalSubmitSection studentId={studentId} />} />
            </Route>

            {/* Faculty Routes */}
            <Route path="/faculty/register" element={<FacultyRegister />} />
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute role="faculty">
                  <FacultyLayout />
                </ProtectedRoute>
              }
            >
              {/* Index & /home both point to FacultyDashboard */}
              <Route index element={<FacultyDashboard />} />
              <Route path="home" element={<FacultyDashboard />} />

              <Route path="certificate-validation" element={<CertificateValidation />} />
              <Route path="document-verification" element={<DocumentVerification />} />
            </Route>

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
