import React, { useEffect, useState } from "react";
import axios from "axios";

interface SkillEntry {
  id: string;
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface SkillsSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const predefinedSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "C++",
  "HTML",
  "CSS",
  "Machine Learning",
  "Communication",
];

const SkillsSection: React.FC<SkillsSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/skills/${studentId}`)
      .then((res) => {
        if (res.data?.data) setSkills(res.data.data);
      })
      .catch(() => {});
  }, []);

  const toggleSkill = (name: string) => {
    setSkills((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      return [
        ...prev,
        { id: crypto.randomUUID(), name, proficiency: "Beginner" },
      ];
    });
    autoSave();
  };

  const handleProficiencyChange = (id: string, value: any) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proficiency: value } : s))
    );
    autoSave();
  };

  const addCustomSkill = () => {
    if (newSkill.trim() === "") return;
    setSkills((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newSkill.trim(),
        proficiency: "Beginner",
      },
    ]);
    setNewSkill("");
    autoSave();
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      await axios.post("/api/student/section/save", {
        studentId,
        sectionId: "skills",
        data: skills,
      });
      setSaving("saved");
    } catch (err) {
      setSaving("error");
    }
  };

  // ✅ Save & Next handler
  const handleSaveAndNext = async () => {
    await autoSave(); // pehle draft backend me save hoga
    onNext(); // phir next section khulega
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>

      {/* Predefined Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedSkills.map((skill) => {
          const selected = skills.some((s) => s.name === skill);
          return (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 rounded-full border ${
                selected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>

      {/* Custom Skill Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <button
          onClick={addCustomSkill}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          + Add
        </button>
      </div>

      {/* Selected Skills List */}
      <div className="space-y-3">
        {skills.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No skills added yet. Select from above or add your own.
          </p>
        ) : (
          skills.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"
            >
              <span className="font-medium">{s.name}</span>
              <div className="flex items-center gap-3">
                <select
                  value={s.proficiency}
                  onChange={(e) =>
                    handleProficiencyChange(s.id, e.target.value as any)
                  }
                  className="border p-1 rounded-lg"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  onClick={() => removeSkill(s.id)}
                  className="text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save status */}
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

export default SkillsSection;
