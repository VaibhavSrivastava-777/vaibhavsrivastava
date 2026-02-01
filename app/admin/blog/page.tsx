"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [githubStatus, setGithubStatus] = useState<{
    configured: boolean;
    error?: string;
    message?: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
    fetchGithubStatus();
  }, []);

  const fetchGithubStatus = async () => {
    try {
      const response = await fetch("/api/admin/github-status");
      if (response.ok) {
        const data = await response.json();
        setGithubStatus(data);
      }
    } catch {
      setGithubStatus({ configured: false, error: "Failed to check status" });
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const response = await fetch(`/api/admin/blog?slug=${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
      } else {
        const data = await response.json();
        if (data.readOnly) {
          alert(
            "⚠️ GitHub API not configured or failed.\n\n" +
              data.error +
              (data.setupGuide ? "\n\nSetup guide: " + data.setupGuide : "")
          );
        } else {
          alert(data.error || "Failed to delete post");
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred");
    } finally {
      setDeletingSlug(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      {githubStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            githubStatus.configured
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}
        >
          {githubStatus.configured ? (
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <div>
            {githubStatus.configured ? (
              <p className="font-medium">{githubStatus.message}</p>
            ) : (
              <>
                <p className="font-medium">
                  GitHub API: Not configured — blog saves will fail in production.
                </p>
                <p className="text-sm mt-1 opacity-90">{githubStatus.error}</p>
                <a
                  href="https://github.com/VaibhavSrivastava-777/vaibhavsrivastava/blob/main/GITHUB_API_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium underline mt-2 inline-block"
                >
                  View setup guide
                </a>
              </>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2">
          <Plus size={20} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </a>
                      <Link
                        href={`/admin/blog/${post.slug}/edit`}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        disabled={deletingSlug === post.slug}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
