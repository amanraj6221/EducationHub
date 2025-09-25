// C:\Aman Raj\EduSangrah\src\pages\student\sections\TrainingSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

interface TrainingEntry {
  id: string;
  title: string;
  mentor: string;
  organization: string;
  startDate: string;
  endDate: string;
  keyLearnings: string;
  certificateFile?: File | null;
}

interface TrainingSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

// C:\Aman Raj\EduSangrah\src\pages\student\sections\TrainingSection.tsx

// ...same imports & interfaces

const TrainingSection: React.FC<TrainingSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/trainings/${studentId}`)
      .then((res) => {
        if (res.data?.data) setEntries(res.data.data);
      })
      .catch(() => {});
  }, [studentId]);

  const addTraining = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        mentor: "",
        organization: "",
        startDate: "",
        endDate: "",
        keyLearnings: "",
        certificateFile: null,
      },
    ]);
  };

  const removeTraining = (id: string) => {
    setEntries((prev) => prev.filter((t) => t.id !== id));
    autoSave(); // remove par bhi draft save
  };

  const handleChange = (id: string, field: keyof TrainingEntry, value: any) => {
    setEntries((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
    autoSave(); // har change par draft save
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "trainings");
      formData.append(
        "data",
        JSON.stringify(entries.map(({ certificateFile, ...rest }) => rest))
      );

      entries.forEach((entry) => {
        if (entry.certificateFile) {
          formData.append(`file_${entry.id}`, entry.certificateFile);
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
    onNext(); // fir next section khul jaye
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Training & Workshops</h2>

      {/* Training List */}
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3 bg-gray-50"
        >
          {/* Inputs */}
          {/* ...same inputs & file upload ... */}
          <button
            onClick={() => removeTraining(entry.id)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addTraining}
        className="bg-gray-200 px-4 py-2 rounded-lg"
      >
        + Add Training / Workshop
      </button>

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

      {/* Navigation */}
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

export default TrainingSection;
