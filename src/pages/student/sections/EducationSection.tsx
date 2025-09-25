import React, { useEffect, useState } from "react";
import axios from "axios";

interface EducationEntry {
  id: string;
  level: string;
  institute: string;
  boardOrUniversity: string;
  year: string;
  percentage: string;
  marksheet?: File | null;
}

interface EducationSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/student/section/education/${studentId}`)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setEntries(res.data.data);
        } else {
          addEntry();
        }
      })
      .catch(() => addEntry());
  }, []);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        level: "",
        institute: "",
        boardOrUniversity: "",
        year: "",
        percentage: "",
        marksheet: null,
      },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof EducationEntry,
    value: any
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    // auto save on change (optional)
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "education");
      formData.append(
        "data",
        JSON.stringify(entries.map((e) => ({ ...e, marksheet: undefined })))
      );

      entries.forEach((e, idx) => {
        if (e.marksheet) formData.append(`marksheet_${idx}`, e.marksheet);
      });

      await axios.post(
        "http://localhost:8080/api/student/section/save",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSaving("saved");
    } catch (err) {
      console.error("Save error:", err);
      setSaving("error");
    }
  };

  const handleSaveAndNext = async () => {
    await autoSave(); // ✅ ensure save complete before moving next
    onNext();
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Education Details</h2>

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Level (SSC / HSC / UG / PG)"
              value={entry.level}
              onChange={(e) => handleChange(entry.id, "level", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Institute Name"
              value={entry.institute}
              onChange={(e) =>
                handleChange(entry.id, "institute", e.target.value)
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Board / University"
              value={entry.boardOrUniversity}
              onChange={(e) =>
                handleChange(entry.id, "boardOrUniversity", e.target.value)
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Passing Year"
              value={entry.year}
              onChange={(e) => handleChange(entry.id, "year", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Percentage / CGPA"
              value={entry.percentage}
              onChange={(e) =>
                handleChange(entry.id, "percentage", e.target.value)
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleChange(entry.id, "marksheet", e.target.files?.[0] || null)
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
        + Add Education
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

export default EducationSection;
