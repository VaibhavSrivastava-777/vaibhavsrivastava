"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";

export default function SpeakingEditPage() {
  const [formData, setFormData] = useState({
    mentoring: {
      areas: [] as string[],
      testimonials: [] as any[],
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestIndex, setEditingTestIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSpeaking();
  }, []);

  const fetchSpeaking = async () => {
    try {
      const response = await fetch("/api/admin/speaking");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          mentoring: data.mentoring || {
            areas: [],
            testimonials: [],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching speaking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/speaking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engagements: [], // Keep empty array for backward compatibility
          mentoring: formData.mentoring,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Speaking & Mentoring updated successfully!");
      } else {
        if (data.readOnly) {
          alert("⚠️ Production Limitation:\n\n" + 
            "File system is read-only in production (Vercel).\n\n" +
            "Options:\n" +
            "1. Test changes locally using 'npm run dev'\n" +
            "2. Update files manually via git and push to deploy\n" +
            "3. Contact admin to implement database storage\n\n" +
            "Error: " + data.error);
        } else {
          alert(data.error || "Failed to update");
        }
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMentoringAreas = (areas: string) => {
    const areasArray = areas.split("\n").map((a) => a.trim()).filter(Boolean);
    setFormData({
      ...formData,
      mentoring: {
        ...formData.mentoring,
        areas: areasArray,
      },
    });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      mentoring: {
        ...formData.mentoring,
        testimonials: [
          ...formData.mentoring.testimonials,
          {
            name: "",
            role: "",
            company: "",
            text: "",
          },
        ],
      },
    });
    setEditingTestIndex(formData.mentoring.testimonials.length);
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const updated = [...formData.mentoring.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      mentoring: {
        ...formData.mentoring,
        testimonials: updated,
      },
    });
  };

  const removeTestimonial = (index: number) => {
    if (confirm("Remove this testimonial?")) {
      const updated = formData.mentoring.testimonials.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        mentoring: {
          ...formData.mentoring,
          testimonials: updated,
        },
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Speaking & Mentoring</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mentoring</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas of Expertise (one per line)
            </label>
            <textarea
              value={formData.mentoring.areas.join("\n")}
              onChange={(e) => updateMentoringAreas(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Product Strategy & Roadmapping&#10;AI/ML Product Development&#10;Career Growth in Product Management"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Testimonials</h3>
              <button
                type="button"
                onClick={addTestimonial}
                className="btn-outline text-sm"
              >
                + Add Testimonial
              </button>
            </div>

            <div className="space-y-4">
              {formData.mentoring.testimonials.map((test, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-gray-900">Testimonial #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      label="Name"
                      name={`test-${index}-name`}
                      value={test.name}
                      onChange={(value) => updateTestimonial(index, "name", value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label="Role"
                        name={`test-${index}-role`}
                        value={test.role}
                        onChange={(value) => updateTestimonial(index, "role", value)}
                      />
                      <FormField
                        label="Company"
                        name={`test-${index}-company`}
                        value={test.company}
                        onChange={(value) => updateTestimonial(index, "company", value)}
                      />
                    </div>
                    <FormField
                      label="Testimonial Text"
                      name={`test-${index}-text`}
                      type="textarea"
                      value={test.text}
                      onChange={(value) => updateTestimonial(index, "text", value)}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
