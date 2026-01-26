import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  slug: string;
  name: string;
  impact: string;
  techStack: string[];
  githubUrl: string | null;
  category: string;
}

export default function ProjectCard({
  slug,
  name,
  impact,
  techStack,
  githubUrl,
  category,
}: ProjectCardProps) {
  return (
    <div className="card h-full flex flex-col">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
            {category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 font-medium">{impact}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm"
          >
            <Github size={16} />
            GitHub
          </a>
        )}
        <Link
          href={`/portfolio/${slug}`}
          className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm ml-auto"
        >
          View Case Study
          <ExternalLink size={16} />
        </Link>
      </div>
    </div>
  );
}
