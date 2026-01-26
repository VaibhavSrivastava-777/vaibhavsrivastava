import { Metadata } from "next";
import BlogCard from "@/components/Blog/BlogCard";
import { getAllBlogPosts } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Blog | Vaibhav Srivastava",
  description: "Thought leadership articles on Product Strategy, AI Adoption, and Growth Leadership",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const categories = ["All", "Product Strategy", "AI Adoption", "Growth Leadership"];
  const uniqueCategories = Array.from(
    new Set(posts.map((post) => post.category))
  );

  return (
    <div className="section-container">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Thought Leadership</h1>
        <p className="text-lg text-gray-600 mb-12">
          Insights on product strategy, AI/ML adoption, and growth leadership
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
