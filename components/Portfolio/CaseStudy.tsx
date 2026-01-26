import { Github, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/client-utils";

interface StarFormat {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface CaseStudyProps {
  name: string;
  impact: string;
  techStack: string[];
  githubUrl: string | null;
  date: string;
  description: string;
  star: StarFormat;
}

export default function CaseStudy({
  name,
  impact,
  techStack,
  githubUrl,
  date,
  description,
  star,
}: CaseStudyProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{name}</h1>
        <p className="text-xl text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>Date: {formatDate(date)}</span>
          <span className="font-semibold text-primary">{impact}</span>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {githubUrl && (
        <div className="mb-8">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
          >
            <Github size={20} />
            View on GitHub
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Case Study (STAR Format)</h2>
          
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Situation</h3>
              <p className="text-gray-700">{star.situation}</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Task</h3>
              <p className="text-gray-700">{star.task}</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Action</h3>
              <p className="text-gray-700">{star.action}</p>
            </div>
            
            <div className="card bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Result</h3>
              <p className="text-gray-700 font-medium">{star.result}</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
