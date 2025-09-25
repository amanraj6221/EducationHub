import React, { useEffect, useState } from "react";
import axios from "axios";

interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  proofFile?: File | null;
}

interface VolunteerSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const VolunteerSection: React.FC<VolunteerSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [entries, setEntries] = useState<VolunteerEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/volunteer/${studentId}`)
      .then((res) => {
        if (res.data?.data) setEntries(res.data.data);
      })
      .catch(() => {});
  }, [studentId]);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "",
        organization: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
        proofFile: null,
      },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    autoSave();
  };

  const handleChange = (
    id: string,
    field: keyof VolunteerEntry,
    value: any
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "volunteer");
      formData.append(
        "data",
        JSON.stringify(entries.map(({ proofFile, ...rest }) => rest))
      );

      entries.forEach((entry) => {
        if (entry.proofFile) {
          formData.append(`file_${entry.id}`, entry.proofFile);
        }
      });

      await axios.post("/api/student/section/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaving("saved");
    } catch (err) {
      setSaving("error");
    }
  };

  const handleSaveDraft = async () => {
    await autoSave();
  };

  const handleSaveAndNext = async () => {
    await autoSave();
    if (saving !== "error") {
      onNext();
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Volunteer Work</h2>

      {/* Volunteer Entries */}
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Role / Position"
              value={entry.role}
              onChange={(e) => handleChange(entry.id, "role", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Organization / NGO / Event"
              value={entry.organization}
              onChange={(e) =>
                handleChange(entry.id, "organization", e.target.value)
              }
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
              placeholder="Key Responsibilities / Achievements"
              value={entry.responsibilities}
              onChange={(e) =>
                handleChange(entry.id, "responsibilities", e.target.value)
              }
              className="border p-2 rounded-lg col-span-2"
            />
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                handleChange(
                  entry.id,
                  "proofFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              className="col-span-2"
            />
          </div>
          <button
            onClick={() => removeEntry(entry.id)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Button */}
      <button onClick={addEntry} className="bg-gray-200 px-4 py-2 rounded-lg">
        + Add Volunteer Work
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
            onClick={handleSaveDraft}
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

export default VolunteerSection;
