"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function ResumeEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    executiveSummary: "",
    experience: [] as any[],
    skills: {
      marketResearch: [] as string[],
      productStrategy: [] as string[],
      aiMl: [] as string[],
      solutionArchitecture: [] as string[],
      gtmExecution: [] as string[],
    },
    education: [] as any[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch("/api/admin/resume");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          executiveSummary: data.executiveSummary || "",
          experience: data.experience || [],
          skills: data.skills || {
            marketResearch: [],
            productStrategy: [],
            aiMl: [],
            solutionArchitecture: [],
            gtmExecution: [],
          },
          education: data.education || [],
        });
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Resume updated successfully!");
      } else {
        alert(data.error || "Failed to update resume");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "present",
          location: "",
          achievements: [""],
          description: "",
        },
      ],
    });
    setEditingExpIndex(formData.experience.length);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experience: updated });
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements = [...updated[expIndex].achievements, ""];
    setFormData({ ...formData, experience: updated });
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements[achIndex] = value;
    setFormData({ ...formData, experience: updated });
  };

  const removeExperience = (index: number) => {
    if (confirm("Remove this experience entry?")) {
      const updated = formData.experience.filter((_, i) => i !== index);
      setFormData({ ...formData, experience: updated });
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          field: "",
          institution: "",
          period: "",
        },
      ],
    });
    setEditingEduIndex(formData.education.length);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index: number) => {
    if (confirm("Remove this education entry?")) {
      const updated = formData.education.filter((_, i) => i !== index);
      setFormData({ ...formData, education: updated });
    }
  };

  const updateSkillCategory = (category: string, skills: string) => {
    const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: skillsArray,
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Resume</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <RichTextEditor
            value={formData.executiveSummary}
            onChange={(value) => setFormData({ ...formData, executiveSummary: value })}
            label="Executive Summary"
            placeholder="Write your executive summary..."
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="btn-outline text-sm"
            >
              + Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Company"
                    name={`exp-${index}-company`}
                    value={exp.company}
                    onChange={(value) => updateExperience(index, "company", value)}
                    required
                  />
                  <FormField
                    label="Role"
                    name={`exp-${index}-role`}
                    value={exp.role}
                    onChange={(value) => updateExperience(index, "role", value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Start Date (YYYY-MM)"
                      name={`exp-${index}-startDate`}
                      value={exp.startDate}
                      onChange={(value) => updateExperience(index, "startDate", value)}
                      required
                      placeholder="2020-01"
                    />
                    <FormField
                      label="End Date (YYYY-MM or 'present')"
                      name={`exp-${index}-endDate`}
                      value={exp.endDate}
                      onChange={(value) => updateExperience(index, "endDate", value)}
                      required
                      placeholder="present"
                    />
                  </div>
                  <FormField
                    label="Location"
                    name={`exp-${index}-location`}
                    value={exp.location}
                    onChange={(value) => updateExperience(index, "location", value)}
                  />
                  <FormField
                    label="Description"
                    name={`exp-${index}-description`}
                    type="textarea"
                    value={exp.description}
                    onChange={(value) => updateExperience(index, "description", value)}
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements (one per line)
                    </label>
                    {exp.achievements.map((ach: string, achIndex: number) => (
                      <div key={achIndex} className="mb-2">
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder={`Achievement ${achIndex + 1}`}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAchievement(index)}
                      className="text-sm text-primary hover:text-primary-dark mt-2"
                    >
                      + Add Achievement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Market Research (comma-separated)"
              name="marketResearch"
              value={formData.skills.marketResearch.join(", ")}
              onChange={(value) => updateSkillCategory("marketResearch", value)}
            />
            <FormField
              label="Product Strategy (comma-separated)"
              name="productStrategy"
              value={formData.skills.productStrategy.join(", ")}
              onChange={(value) => updateSkillCategory("productStrategy", value)}
            />
            <FormField
              label="AI/ML (comma-separated)"
              name="aiMl"
              value={formData.skills.aiMl.join(", ")}
              onChange={(value) => updateSkillCategory("aiMl", value)}
            />
            <FormField
              label="Solution Architecture (comma-separated)"
              name="solutionArchitecture"
              value={formData.skills.solutionArchitecture.join(", ")}
              onChange={(value) => updateSkillCategory("solutionArchitecture", value)}
            />
            <FormField
              label="GTM Execution (comma-separated)"
              name="gtmExecution"
              value={formData.skills.gtmExecution.join(", ")}
              onChange={(value) => updateSkillCategory("gtmExecution", value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="btn-outline text-sm"
            >
              + Add Education
            </button>
          </div>

          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Degree"
                    name={`edu-${index}-degree`}
                    value={edu.degree}
                    onChange={(value) => updateEducation(index, "degree", value)}
                  />
                  <FormField
                    label="Field"
                    name={`edu-${index}-field`}
                    value={edu.field}
                    onChange={(value) => updateEducation(index, "field", value)}
                  />
                  <FormField
                    label="Institution"
                    name={`edu-${index}-institution`}
                    value={edu.institution}
                    onChange={(value) => updateEducation(index, "institution", value)}
                  />
                  <FormField
                    label="Period"
                    name={`edu-${index}-period`}
                    value={edu.period}
                    onChange={(value) => updateEducation(index, "period", value)}
                    placeholder="2014-2015"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </form>
    </div>
  );
}
