// C:\Aman Raj\EduSangrah\src\pages\student\sections\FinalSubmitSection.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

interface SectionStatus {
  id: string;
  name: string;
  status: "Pending" | "Completed" | "Approved";
}

interface FinalSubmitSectionProps {
  studentId: string;
  onBack: () => void;
}

const FinalSubmitSection: React.FC<FinalSubmitSectionProps> = ({
  studentId,
  onBack,
}) => {
  const [sections, setSections] = useState<SectionStatus[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pdfLink, setPdfLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/student/portfolio/status/${studentId}`)
      .then((res) => {
        if (res.data?.sections) setSections(res.data.sections);
      })
      .catch(() => {});
  }, [studentId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await axios.post(`/api/student/portfolio/submit`, {
        studentId,
      });

      if (res.data?.pdfLink) {
        setPdfLink(res.data.pdfLink);
      }

      // Update all sections to Approved
      setSections((prev) => prev.map((s) => ({ ...s, status: "Approved" })));

      // Mark as submitted (for UI disable)
      setSubmitted(true);
    } catch (err) {
      setError("❌ Error submitting portfolio. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Final Submit</h2>

      {/* Sections Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className={`p-4 rounded-xl border ${
              sec.status === "Pending"
                ? "border-gray-300 bg-gray-50"
                : sec.status === "Completed"
                  ? "border-blue-300 bg-blue-50"
                  : "border-green-300 bg-green-50"
            }`}
          >
            <p className="font-medium">{sec.name}</p>
            <p className="text-sm mt-1">
              Status:{" "}
              {sec.status === "Pending"
                ? "🕒 Pending"
                : sec.status === "Completed"
                  ? "✅ Completed"
                  : "✔️ Approved"}
            </p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-xl">
          ← Back
        </button>
        <div className="space-x-2">
          {!pdfLink && !submitted && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              {submitting ? "Submitting..." : "Submit Portfolio & Generate PDF"}
            </button>
          )}
          {pdfLink && (
            <a
              href={pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              📄 View Generated PDF
            </a>
          )}
        </div>
      </div>

      {/* Success message */}
      {submitted && (
        <p className="text-green-600 text-sm mt-3">
          ✅ Portfolio submitted successfully! Faculty can now review it from
          their dashboard.
        </p>
      )}
    </div>
  );
};

export default FinalSubmitSection;
