import { Metadata } from "next";
import fs from "fs";
import path from "path";
import ProjectCard from "@/components/Portfolio/ProjectCard";

export const metadata: Metadata = {
  title: "Portfolio | Vaibhav Srivastava",
  description: "Portfolio of projects showcasing strategic product development, AI/ML innovation, and impactful solutions",
};

function getPortfolioData() {
  const filePath = path.join(process.cwd(), "content", "portfolio.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default function PortfolioPage() {
  const { projects } = getPortfolioData();

  return (
    <div className="section-container">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Portfolio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              name={project.name}
              impact={project.impact}
              techStack={project.techStack}
              githubUrl={project.githubUrl}
              category={project.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
