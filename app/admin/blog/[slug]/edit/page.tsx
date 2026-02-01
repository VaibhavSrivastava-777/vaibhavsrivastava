"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FormField from "@/components/admin/FormField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "",
    excerpt: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || "",
          date: data.date ? data.date.split("T")[0] : "",
          category: data.category || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
        });
      } else {
        alert("Failed to load post");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
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
      const response = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        if (data.readOnly) {
          alert(
            "⚠️ GitHub API not configured or failed.\n\n" +
              data.error +
              (data.setupGuide ? "\n\nSetup guide: " + data.setupGuide : "")
          );
        } else if (data.errors) {
          const errorMap: Record<string, string> = {};
          data.errors.forEach((err: string) => {
            if (err.includes("Title")) errorMap.title = err;
            if (err.includes("date")) errorMap.date = err;
            if (err.includes("Category")) errorMap.category = err;
            if (err.includes("Excerpt")) errorMap.excerpt = err;
            if (err.includes("Content")) errorMap.content = err;
          });
          setErrors(errorMap);
        } else {
          alert(data.error || "Failed to update post");
        }
      }
    } catch (error) {
      console.error("Error updating post:", error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        <FormField
          label="Title"
          name="title"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          required
          error={errors.title}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
            required
            error={errors.date}
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            required
            error={errors.category}
            options={[
              { value: "Product Strategy", label: "Product Strategy" },
              { value: "AI Adoption", label: "AI Adoption" },
              { value: "Growth Leadership", label: "Growth Leadership" },
            ]}
          />
        </div>

        <FormField
          label="Excerpt"
          name="excerpt"
          type="textarea"
          value={formData.excerpt}
          onChange={(value) => setFormData({ ...formData, excerpt: value })}
          required
          error={errors.excerpt}
          rows={3}
          placeholder="Brief description of the post..."
        />

        <div>
          {errors.content && <p className="text-sm text-red-600 mb-2">{errors.content}</p>}
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            label="Content"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
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
