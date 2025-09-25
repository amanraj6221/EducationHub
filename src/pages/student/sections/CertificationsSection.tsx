// C:\Aman Raj\EduSangrah\src\pages\student\sections\CertificationsSection.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface CertificationEntry {
  id: string;
  title: string;
  provider: string;
  date: string;
  mode: string;
  credentialId: string;
  certificateFile?: File | null;
}

interface CertificationsSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [entries, setEntries] = useState<CertificationEntry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/certifications/${studentId}`)
      .then((res) => {
        if (res.data?.data) setEntries(res.data.data);
      })
      .catch(() => {});
  }, [studentId]);

  const addCertification = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        provider: "",
        date: "",
        mode: "Online",
        credentialId: "",
        certificateFile: null,
      },
    ]);
  };

  const removeCertification = (id: string) => {
    setEntries((prev) => prev.filter((c) => c.id !== id));
    autoSave();
  };

  const handleChange = (
    id: string,
    field: keyof CertificationEntry,
    value: any
  ) => {
    setEntries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("sectionId", "certifications");
      formData.append(
        "data",
        JSON.stringify(entries.map(({ certificateFile, ...rest }) => rest))
      );

      // Append files
      entries.forEach((entry) => {
        if (entry.certificateFile) {
          formData.append(`file_${entry.id}`, entry.certificateFile);
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

  // Save Draft only
  const handleSaveDraft = () => {
    autoSave();
  };

  // Save + Next section
  const handleSaveAndNext = async () => {
    await autoSave();
    if (saving !== "error") {
      onNext();
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Certifications</h2>

      {/* Certification List */}
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title of Certificate"
              value={entry.title}
              onChange={(e) => handleChange(entry.id, "title", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Provider / Platform"
              value={entry.provider}
              onChange={(e) =>
                handleChange(entry.id, "provider", e.target.value)
              }
              className="border p-2 rounded-lg"
            />
            <input
              type="date"
              value={entry.date}
              onChange={(e) => handleChange(entry.id, "date", e.target.value)}
              className="border p-2 rounded-lg"
            />
            <select
              value={entry.mode}
              onChange={(e) => handleChange(entry.id, "mode", e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <input
              type="text"
              placeholder="Credential ID / Link"
              value={entry.credentialId}
              onChange={(e) =>
                handleChange(entry.id, "credentialId", e.target.value)
              }
              className="border p-2 rounded-lg col-span-2"
            />
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) =>
                handleChange(
                  entry.id,
                  "certificateFile",
                  e.target.files ? e.target.files[0] : null
                )
              }
              className="col-span-2"
            />
          </div>
          <button
            onClick={() => removeCertification(entry.id)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addCertification}
        className="bg-gray-200 px-4 py-2 rounded-lg"
      >
        + Add Certification
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

export default CertificationsSection;
