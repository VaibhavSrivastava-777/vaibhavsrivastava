"use client";

import { Linkedin, Twitter, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/client-utils";

interface BlogPostProps {
  title: string;
  date: string;
  category: string;
  content: string;
  readingTime?: number;
}

export default function BlogPost({
  title,
  date,
  category,
  content,
  readingTime,
}: BlogPostProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(title);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
            {category}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {formatDate(date)}
          </div>
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {readingTime} min read
            </div>
          )}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="border-t border-gray-200 pt-8 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Share this article</h3>
        <div className="flex gap-4">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Linkedin size={20} />
            LinkedIn
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Twitter size={20} />
            Twitter
          </a>
        </div>
      </div>
    </article>
  );
}
