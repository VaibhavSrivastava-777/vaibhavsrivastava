import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/components/Blog/BlogPost";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/markdown";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog - Vaibhav Srivastava`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="section-container">
      <BlogPost
        title={post.title}
        date={post.date}
        category={post.category}
        content={post.content}
        readingTime={post.readingTime}
      />
    </div>
  );
}
