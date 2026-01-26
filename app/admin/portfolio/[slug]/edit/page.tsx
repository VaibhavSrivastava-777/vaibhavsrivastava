"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FormField from "@/components/admin/FormField";

export default function EditPortfolioItem() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState({
    name: "",
    impact: "",
    category: "",
    date: "",
    description: "",
    techStack: "",
    githubUrl: "",
    star: {
      situation: "",
      task: "",
      action: "",
      result: "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/portfolio?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          impact: data.impact || "",
          category: data.category || "",
          date: data.date ? data.date.split("T")[0] : "",
          description: data.description || "",
          techStack: Array.isArray(data.techStack) ? data.techStack.join(", ") : data.techStack || "",
          githubUrl: data.githubUrl || "",
          star: {
            situation: data.star?.situation || "",
            task: data.star?.task || "",
            action: data.star?.action || "",
            result: data.star?.result || "",
          },
        });
      } else {
        alert("Failed to load project");
        router.push("/admin/portfolio");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug,
          techStack: techStackArray,
          githubUrl: formData.githubUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/portfolio");
      } else {
        if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: string) => {
            if (err.includes("name")) errorMap.name = err;
            if (err.includes("Impact")) errorMap.impact = err;
            if (err.includes("date")) errorMap.date = err;
            if (err.includes("Description")) errorMap.description = err;
            if (err.includes("tech stack")) errorMap.techStack = err;
            if (err.includes("Situation")) errorMap.starSituation = err;
            if (err.includes("Task")) errorMap.starTask = err;
            if (err.includes("Action")) errorMap.starAction = err;
            if (err.includes("Result")) errorMap.starResult = err;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || "Failed to update project");
        }
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Portfolio Project</h1>

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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">STAR Format</h3>
          <div className="space-y-4">
            <FormField
              label="Situation"
              name="starSituation"
              type="textarea"
              value={formData.star.situation}
              onChange={(value) => setFormData({ ...formData, star: { ...formData.star, situation: value } })}
              required
              error={errors.starSituation}
              rows={3}
            />
            <FormField
              label="Task"
              name="starTask"
              type="textarea"
              value={formData.star.task}
              onChange={(value) => setFormData({ ...formData, star: { ...formData.star, task: value } })}
              required
              error={errors.starTask}
              rows={3}
            />
            <FormField
              label="Action"
              name="starAction"
              type="textarea"
              value={formData.star.action}
              onChange={(value) => setFormData({ ...formData, star: { ...formData.star, action: value } })}
              required
              error={errors.starAction}
              rows={3}
            />
            <FormField
              label="Result"
              name="starResult"
              type="textarea"
              value={formData.star.result}
              onChange={(value) => setFormData({ ...formData, star: { ...formData.star, result: value } })}
              required
              error={errors.starResult}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Project"}
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
