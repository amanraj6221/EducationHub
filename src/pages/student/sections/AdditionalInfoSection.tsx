// C:\Aman Raj\EduSangrah\src\pages\student\sections\AdditionalInfoSection.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface AdditionalInfo {
  hobbies: string;
  languages: string[];
  publications: string[];
  awards: string[];
  futureGoals: string;
  references: string[];
}

interface AdditionalInfoSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [info, setInfo] = useState<AdditionalInfo>({
    hobbies: "",
    languages: [],
    publications: [],
    awards: [],
    futureGoals: "",
    references: [],
  });
  const [newLanguage, setNewLanguage] = useState("");
  const [newPublication, setNewPublication] = useState("");
  const [newAward, setNewAward] = useState("");
  const [newReference, setNewReference] = useState("");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/additionalInfo/${studentId}`)
      .then((res) => {
        if (res.data?.data) setInfo(res.data.data);
      })
      .catch(() => {});
  }, []);

  const autoSave = async () => {
    setSaving("saving");
    try {
      await axios.post("/api/student/section/save", {
        studentId,
        sectionId: "additionalInfo",
        data: info,
      });
      setSaving("saved");
    } catch {
      setSaving("error");
    }
  };

  const addItem = (field: keyof AdditionalInfo, value: string) => {
    if (!value.trim()) return;
    setInfo((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
    if (field === "languages") setNewLanguage("");
    if (field === "publications") setNewPublication("");
    if (field === "awards") setNewAward("");
    if (field === "references") setNewReference("");
    autoSave();
  };

  const removeItem = (field: keyof AdditionalInfo, index: number) => {
    setInfo((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
    autoSave();
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Additional Info</h2>

      {/* Hobbies */}
      <div>
        <label className="block font-medium mb-1">Hobbies / Interests</label>
        <input
          type="text"
          value={info.hobbies}
          onChange={(e) => setInfo((prev) => ({ ...prev, hobbies: e.target.value }))}
          onBlur={autoSave}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* Languages */}
      <div>
        <label className="block font-medium mb-1">Languages Known</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={() => addItem("languages", newLanguage)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {info.languages.map((lang, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {lang}
              <button onClick={() => removeItem("languages", idx)}>✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div>
        <label className="block font-medium mb-1">Publications</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newPublication}
            onChange={(e) => setNewPublication(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={() => addItem("publications", newPublication)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            + Add
          </button>
        </div>
        <ul className="list-disc list-inside">
          {info.publications.map((pub, idx) => (
            <li key={idx}>
              {pub}{" "}
              <button
                onClick={() => removeItem("publications", idx)}
                className="text-red-500 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Awards */}
      <div>
        <label className="block font-medium mb-1">Awards / Scholarships</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAward}
            onChange={(e) => setNewAward(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={() => addItem("awards", newAward)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            + Add
          </button>
        </div>
        <ul className="list-disc list-inside">
          {info.awards.map((a, idx) => (
            <li key={idx}>
              {a}{" "}
              <button
                onClick={() => removeItem("awards", idx)}
                className="text-red-500 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Future Goals */}
      <div>
        <label className="block font-medium mb-1">Future Goals</label>
        <textarea
          value={info.futureGoals}
          onChange={(e) => setInfo((prev) => ({ ...prev, futureGoals: e.target.value }))}
          onBlur={autoSave}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* References */}
      <div>
        <label className="block font-medium mb-1">References</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            onClick={() => addItem("references", newReference)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            + Add
          </button>
        </div>
        <ul className="list-disc list-inside">
          {info.references.map((ref, idx) => (
            <li key={idx}>
              {ref}{" "}
              <button
                onClick={() => removeItem("references", idx)}
                className="text-red-500 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

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
          <button onClick={autoSave} className="px-4 py-2 bg-blue-200 rounded-xl">
            Save Draft
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Save & Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
