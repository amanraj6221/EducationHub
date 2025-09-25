import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen, CheckCircle, Clock, User, FileText, Award, Briefcase,
  Share2, Heart, Folder, GraduationCap, Star, Lightbulb, Sparkles,
  TrendingUp, Mail, MapPin, Crown, Home
} from "lucide-react";

interface Course {
  id: number;
  name: string;
  status: string;
  completionDate: string;
  progress: number;
  instructor: string;
  thumbnail: string;
  duration: string;
  category: string;
  nextLesson: string;
}

interface Activity {
  id: number;
  type: string;
  course: string;
  time: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface Stats {
  title: string;
  value: string;
  icon: JSX.Element;
  color: string;
  description: string;
  trend?: string;
}

interface LearningGoal {
  title: string;
  progress: number;
  deadline: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // user info
  const [studentName, setStudentName] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentLocation, setStudentLocation] = useState<string>("");

  // app data
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", name: "Overview", icon: <Home className="h-5 w-5" />, route: "/student/dashboard/overview" },
    { id: "profile", name: "Personal Profile", icon: <User className="h-5 w-5" />, route: "/student/dashboard/profile" },
    { id: "education", name: "Education", icon: <GraduationCap className="h-5 w-5" />, route: "/student/dashboard/education" },
    { id: "experience", name: "Experience", icon: <Briefcase className="h-5 w-5" />, route: "/student/dashboard/experience" },
    { id: "skills", name: "Skills", icon: <Star className="h-5 w-5" />, route: "/student/dashboard/skills" },
    { id: "certifications", name: "Certifications", icon: <Award className="h-5 w-5" />, route: "/student/dashboard/certifications" },
    { id: "training", name: "Training", icon: <Lightbulb className="h-5 w-5" />, route: "/student/dashboard/training" },
    { id: "documents", name: "Documents", icon: <FileText className="h-5 w-5" />, route: "/student/dashboard/documents" },
    { id: "social", name: "Social Links", icon: <Share2 className="h-5 w-5" />, route: "/student/dashboard/social" },
    { id: "volunteer", name: "Volunteer Work", icon: <Heart className="h-5 w-5" />, route: "/student/dashboard/volunteer" },
    { id: "additional", name: "Additional Info", icon: <Folder className="h-5 w-5" />, route: "/student/dashboard/additional" },
    { id: "final-submit", name: "Final Submit", icon: <FileText className="h-5 w-5" />, route: "/student/dashboard/final-submit" },
  ];

  useEffect(() => {
    // Load user info from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setStudentName(user.name || "Student");
      setStudentEmail(user.email || "N/A");
      setStudentLocation(user.location || "N/A");
    }

    // Navigate to default overview
    if (location.pathname === "/student/dashboard") {
      navigate("/student/dashboard/overview", { replace: true });
      setActiveSection("overview");
    } else {
      const currentSection = sections.find(sec => location.pathname.includes(sec.id));
      if (currentSection) setActiveSection(currentSection.id);
    }

    // Stats
    setStats([
      { title: "Certifications", value: "3+", icon: <Award className="h-5 w-5" />, color: "bg-purple-100 text-purple-600", description: "Certificates earned" },
      { title: "Skills", value: "20+", icon: <Star className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-600", description: "Skills mastered" },
      { title: "Projects", value: "5+", icon: <Folder className="h-5 w-5" />, color: "bg-blue-100 text-blue-600", description: "Completed projects" },
      { title: "Achievements", value: "3+", icon: <Crown className="h-5 w-5" />, color: "bg-green-100 text-green-600", description: "Major accomplishments" },
      { title: "Language Efficiency", value: "C/C++/Java", icon: <Lightbulb className="h-5 w-5" />, color: "bg-amber-100 text-amber-600", description: "Programming efficiency" },
    ]);

    // Learning Goals
    setLearningGoals([
      { title: "Complete Web Development", progress: 75, deadline: "Oct 15, 2025" },
      { title: "Learn Data Structures", progress: 30, deadline: "Nov 20, 2025" },
      { title: "Master React Framework", progress: 45, deadline: "Dec 10, 2025" },
    ]);
  }, [location.pathname, navigate]);

  const ongoingCourses = courses.filter(c => c.status !== "Completed");

  const quickActions = [
    { name: "Browse Courses", icon: <BookOpen className="h-5 w-5" />, route: "/student/courses", color: "from-blue-500 to-indigo-600" },
    { name: "My Certificates", icon: <Award className="h-5 w-5" />, route: "/student/certificates", color: "from-green-500 to-emerald-600" },
    { name: "Progress Report", icon: <TrendingUp className="h-5 w-5" />, route: "/student/progress", color: "from-purple-500 to-pink-500" },
    { name: "My Portfolio", icon: <User className="h-5 w-5" />, route: "/student/portfolio", color: "from-amber-500 to-orange-500" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col fixed h-screen z-40 overflow-y-auto rounded-r-3xl">
        <div className="p-6 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" /> EduSangrah
          </h1>
          <nav className="flex flex-col gap-2">
            {sections.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"}`}
                  onClick={() => {
                    navigate(section.route);
                    setActiveSection(section.id);
                  }}
                >
                  <div className={`p-2 rounded-xl mr-3 ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{section.icon}</div>
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto p-5 border-t border-gray-200">
            <div className="flex items-center mb-4 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-4 shadow-md">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{studentName}</p>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <Mail className="h-3 w-3 mr-1" /> {studentEmail}
                </div>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <MapPin className="h-3 w-3 mr-1" /> {studentLocation}
                </div>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-90 rounded-2xl py-3 flex items-center justify-center shadow-md transition" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:ml-80 overflow-auto">
        {activeSection === "overview" ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600 mb-6">Welcome back, {studentName}. Here's your learning progress.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.color}`}>{stat.icon}</div>
                  <p className="text-3xl font-bold text-gray-800 mt-3">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  {stat.trend && <p className="text-green-600 text-xs mt-1">{stat.trend}</p>}
                </div>
              ))}
            </div>

            {/* Learning Goals */}
            <section className="mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning Goals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningGoals.map((goal, idx) => (
                    <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 hover:shadow-md transition">
                      <p className="font-medium text-gray-800 mb-2">{goal.title}</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500">Deadline: {goal.deadline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, idx) => (
                    <button key={idx} className={`flex items-center gap-2 p-4 rounded-2xl shadow-md text-white font-medium bg-gradient-to-r ${action.color} hover:shadow-lg hover:scale-105 transition`} onClick={() => navigate(action.route)}>
                      {action.icon}
                      {action.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
