import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSection: React.FC = () => {
  const navigate = useNavigate();

  // ✅ User ko localStorage se nikalna
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentId = user?._id; // MongoDB ObjectId
  const sectionId = "profile";

  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    motherName: "",
    rollNo: "",
    course: "",
    semester: "",
    branch: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    city: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
    domicile: null,
    caste: null,
    idProof: null,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSaveNext = async () => {
    if (!studentId) {
      alert("❌ Student ID not found. Please login again.");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("studentId", studentId);
      body.append("sectionId", sectionId);
      body.append("data", JSON.stringify(formData));

      Object.entries(files).forEach(([key, file]) => {
        if (file) body.append(key, file);
      });

      const res = await fetch(
        "http://localhost:8080/api/student/section/save",
        {
          method: "POST",
          body,
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Draft saved ✅");
        navigate("/student/dashboard/education");
      } else {
        alert(result.message || "Failed to save draft ❌");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Server error ❌");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchDraft = async () => {
      if (!studentId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/student/section/${sectionId}/${studentId}`
        );
        const result = await res.json();
        if (res.ok && result.success && result.data) {
          setFormData(result.data);
        }
      } catch (err) {
        console.error("Fetch draft error:", err);
      }
    };
    fetchDraft();
  }, [studentId]);

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Personal Profile
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "firstName", placeholder: "Full Name" },
            { name: "fatherName", placeholder: "Father Name" },
            { name: "motherName", placeholder: "Mother Name" },
            { name: "rollNo", placeholder: "Roll Number" },
            { name: "course", placeholder: "Course" },
            { name: "semester", placeholder: "Semester" },
            { name: "branch", placeholder: "Branch" },
            { name: "dob", placeholder: "Date of Birth", type: "date" },
            { name: "gender", placeholder: "Gender", type: "select" },
            { name: "contact", placeholder: "Contact" },
            { name: "email", placeholder: "Email" },
            { name: "address", placeholder: "Address" },
            { name: "city", placeholder: "City" },
          ].map((field, idx) =>
            field.type === "select" ? (
              <select
                key={idx}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            ) : (
              <input
                key={idx}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )
          )}
        </div>

        {/* File Upload */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "photo", label: "Photo" },
            { name: "domicile", label: "Domicile Certificate" },
            { name: "caste", label: "Caste Certificate" },
            { name: "idProof", label: "ID Proof" },
          ].map((fileField, idx) => (
            <label key={idx} className="flex flex-col">
              <span className="text-gray-700 mb-2 font-medium">
                {fileField.label}
              </span>
              <input
                type="file"
                name={fileField.name}
                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate("/student/dashboard/overview")}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleSaveNext}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save & Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
