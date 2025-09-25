// C:\Aman Raj\EduSangrah\src\pages\student\sections\SocialLinksSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  portfolio: string;
  other: string;
}

interface SocialLinksSectionProps {
  studentId: string;
  onNext: () => void;
  onBack: () => void;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  studentId,
  onNext,
  onBack,
}) => {
  const [links, setLinks] = useState<SocialLinks>({
    linkedin: "",
    github: "",
    twitter: "",
    portfolio: "",
    other: "",
  });

  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    axios
      .get(`/api/student/section/social-links/${studentId}`)
      .then((res) => {
        if (res.data?.data) setLinks(res.data.data);
      })
      .catch(() => {});
  }, [studentId]);

  const handleChange = (field: keyof SocialLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [field]: value }));
    autoSave();
  };

  const autoSave = async () => {
    setSaving("saving");
    try {
      const payload = {
        studentId,
        sectionId: "social-links",
        data: links,
      };

      await axios.post("/api/student/section/save", payload);

      setSaving("saved");
    } catch {
      setSaving("error");
    }
  };

  const handleSaveAndNext = async () => {
    await autoSave();
    onNext(); // Volunteer Work kholega
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Social Links</h2>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="url"
          placeholder="LinkedIn Profile URL"
          value={links.linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="url"
          placeholder="GitHub Profile URL"
          value={links.github}
          onChange={(e) => handleChange("github", e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="url"
          placeholder="Twitter / X Profile URL"
          value={links.twitter}
          onChange={(e) => handleChange("twitter", e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="url"
          placeholder="Portfolio / Personal Website"
          value={links.portfolio}
          onChange={(e) => handleChange("portfolio", e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="url"
          placeholder="Other Link (Behance, Dribbble, etc.)"
          value={links.other}
          onChange={(e) => handleChange("other", e.target.value)}
          className="border p-2 rounded-lg"
        />
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

export default SocialLinksSection;
