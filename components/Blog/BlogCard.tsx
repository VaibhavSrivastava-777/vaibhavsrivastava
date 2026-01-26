import Link from "next/link";
import { formatDate } from "@/lib/client-utils";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function BlogCard({ slug, title, excerpt, date, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="card block hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
          {category}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={14} />
          {formatDate(date)}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 line-clamp-2">{excerpt}</p>
    </Link>
  );
}
