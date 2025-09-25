// C:\Aman Raj\EduSangrah\src\pages\student\sections\ProjectsSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  techStack: string;
  projectLink: string;
  projectFile?: File | null;
}

interface ProjectsSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/projects/${studentId}`)
      .then((res) => {
        if (res.data?.data) setProjects(res.data.data);
      })
      .catch(() => {});
  }, [studentId]);

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        techStack: "",
        projectLink: "",
        projectFile: null,
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    autoSave();
  };

  const handleChange = (id: string, field: keyof ProjectEntry, value: any) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "projects");
      formData.append(
        "data",
        JSON.stringify(projects.map(({ projectFile, ...rest }) => rest))
      );

      projects.forEach((proj) => {
        if (proj.projectFile) {
          formData.append(`file_${proj.id}`, proj.projectFile);
        }
      });

      await axios.post("/api/student/section/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaving("saved");
    } catch {
      setSaving("error");
    }
  };

  const handleSaveAndNext = async () => {
    await autoSave(); // pehle draft save
    onNext(); // fir next section kholna
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      {/* Project List */}
      {projects.map((proj) => (
        <div
          key={proj.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => handleChange(proj.id, "title", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Tech Stack (comma separated)"
              value={proj.techStack}
              onChange={(e) =>
                handleChange(proj.id, "techStack", e.target.value)
              }
              className="border p-2 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={proj.description}
              onChange={(e) =>
                handleChange(proj.id, "description", e.target.value)
              }
              className="border p-2 rounded-lg col-span-2"
            />
            <input
              type="url"
              placeholder="Project Link (GitHub / Demo)"
              value={proj.projectLink}
              onChange={(e) =>
                handleChange(proj.id, "projectLink", e.target.value)
              }
              className="border p-2 rounded-lg col-span-2"
            />
            <input
              type="file"
              accept=".pdf,.zip,.png,.jpg,.jpeg"
              onChange={(e) =>
                handleChange(
                  proj.id,
                  "projectFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              className="col-span-2"
            />
          </div>
          <button
            onClick={() => removeProject(proj.id)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Project Button */}
      <button onClick={addProject} className="bg-gray-200 px-4 py-2 rounded-lg">
        + Add Project
      </button>

      {/* Save Status */}
      <p className="text-xs text-gray-500 mt-2">
        {saving === "saving"
          ? "Saving..."
          : saving === "saved"
            ? "Draft saved ✅"
            : saving === "error"
              ? "Error while saving ❌"
              : ""}
      </p>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-xl">
          ← Back
        </button>
        <div className="space-x-2">
          <button
            onClick={autoSave}
            className="px-4 py-2 bg-blue-200 rounded-xl"
          >
            Save Draft
          </button>
          <button
            onClick={handleSaveAndNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Save & Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
