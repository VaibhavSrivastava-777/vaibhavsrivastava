"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewPortfolioItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    impact: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    techStack: "",
    githubUrl: "",
    starContent: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const techStackArray = formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          techStack: techStackArray,
          githubUrl: formData.githubUrl || null,
          star: {
            situation: "",
            task: "",
            action: "",
            result: "",
            content: formData.starContent,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/portfolio");
      } else {
        if (data.readOnly) {
          alert("⚠️ Production Limitation:\n\n" + 
            "File system is read-only in production (Vercel).\n\n" +
            "Options:\n" +
            "1. Test changes locally using 'npm run dev'\n" +
            "2. Update files manually via git and push to deploy\n" +
            "3. Contact admin to implement database storage\n\n" +
            "Error: " + data.error);
        } else if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: string) => {
            // Map errors to form fields
            if (err.includes("name")) errorMap.name = err;
            if (err.includes("Impact")) errorMap.impact = err;
            if (err.includes("date")) errorMap.date = err;
            if (err.includes("Description")) errorMap.description = err;
            if (err.includes("tech stack")) errorMap.techStack = err;
            if (err.includes("STAR") || err.includes("star")) errorMap.starContent = err;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || "Failed to create project");
        }
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Portfolio Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        <FormField
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          required
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            required
            error={errors.category}
            options={[
              { value: "AI/ML", label: "AI/ML" },
              { value: "Product Strategy", label: "Product Strategy" },
              { value: "Solution Architecture", label: "Solution Architecture" },
              { value: "GTM Execution", label: "GTM Execution" },
            ]}
          />

          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
            required
            error={errors.date}
          />
        </div>

        <FormField
          label="Impact"
          name="impact"
          value={formData.impact}
          onChange={(value) => setFormData({ ...formData, impact: value })}
          required
          error={errors.impact}
          placeholder="e.g., Increased user engagement by 45%"
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          required
          error={errors.description}
          rows={3}
        />

        <FormField
          label="Tech Stack (comma-separated)"
          name="techStack"
          value={formData.techStack}
          onChange={(value) => setFormData({ ...formData, techStack: value })}
          required
          error={errors.techStack}
          placeholder="Python, React, AWS, PostgreSQL"
        />

        <FormField
          label="GitHub URL (optional)"
          name="githubUrl"
          type="url"
          value={formData.githubUrl}
          onChange={(value) => setFormData({ ...formData, githubUrl: value })}
          placeholder="https://github.com/username/project"
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Study (STAR Format)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Write your case study in STAR format. You can structure it with headings for Situation, Task, Action, and Result.
          </p>
          {errors.starContent && <p className="text-sm text-red-600 mb-2">{errors.starContent}</p>}
          <RichTextEditor
            value={formData.starContent}
            onChange={(value) => setFormData({ ...formData, starContent: value })}
            label="STAR Case Study"
            placeholder="Write your case study here. Use headings to organize Situation, Task, Action, and Result sections..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
