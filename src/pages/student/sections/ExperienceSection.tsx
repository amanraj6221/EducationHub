// ✅ FIXED VERSION
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ExperienceEntry {
  id: string;
  type: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  proof?: File | null;
}

interface ExperienceSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/experience/${studentId}`)
      .then((res) => {
        if (res.data?.data) setEntries(res.data.data);
        else addEntry();
      })
      .catch(() => addEntry());
  }, []);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "",
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        proof: null,
      },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof ExperienceEntry,
    value: any
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    autoSave(); // live save on change
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "experience");
      formData.append(
        "data",
        JSON.stringify(entries.map((e) => ({ ...e, proof: undefined })))
      );

      entries.forEach((e, idx) => {
        if (e.proof) formData.append(`proof_${idx}`, e.proof);
      });

      await axios.post("/api/student/section/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaving("saved");
    } catch (err) {
      setSaving("error");
    }
  };

  // ✅ Save & Next handler
  const handleSaveAndNext = async () => {
    await autoSave();
    onNext();
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Experience Details</h2>

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={entry.type}
              onChange={(e) => handleChange(entry.id, "type", e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="Internship">Internship</option>
              <option value="Job">Job</option>
              <option value="Project">Project</option>
            </select>

            <input
              type="text"
              placeholder="Organization Name"
              value={entry.organization}
              onChange={(e) =>
                handleChange(entry.id, "organization", e.target.value)
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Role / Designation"
              value={entry.role}
              onChange={(e) => handleChange(entry.id, "role", e.target.value)}
              className="border p-2 rounded-lg"
            />

            <input
              type="date"
              value={entry.startDate}
              onChange={(e) =>
                handleChange(entry.id, "startDate", e.target.value)
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="date"
              value={entry.endDate}
              onChange={(e) =>
                handleChange(entry.id, "endDate", e.target.value)
              }
              className="border p-2 rounded-lg"
            />

            <textarea
              placeholder="Work Description / Responsibilities"
              value={entry.description}
              onChange={(e) =>
                handleChange(entry.id, "description", e.target.value)
              }
              className="border p-2 rounded-lg col-span-1 md:col-span-2"
            />

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleChange(entry.id, "proof", e.target.files?.[0] || null)
              }
              className="border p-2 rounded-lg"
            />
          </div>
          {entries.length > 1 && (
            <button
              className="mt-2 text-red-600 text-sm"
              onClick={() => removeEntry(entry.id)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl"
        onClick={addEntry}
      >
        + Add Experience
      </button>

      <p className="text-xs text-gray-500 mt-2">
        {saving === "saving"
          ? "Saving..."
          : saving === "saved"
            ? "Draft saved ✅"
            : saving === "error"
              ? "Error while saving ❌"
              : ""}
      </p>

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

export default ExperienceSection;
