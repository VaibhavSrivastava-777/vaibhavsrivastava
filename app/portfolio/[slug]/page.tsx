import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import CaseStudy from "@/components/Portfolio/CaseStudy";

interface PageProps {
  params: {
    slug: string;
  };
}

function getPortfolioData() {
  const filePath = path.join(process.cwd(), "content", "portfolio.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

function getProjectBySlug(slug: string) {
  const { projects } = getPortfolioData();
  return projects.find((project: any) => project.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Portfolio - Vaibhav Srivastava`,
    description: project.description || `Case study: ${project.name}`,
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="section-container">
      <CaseStudy
        name={project.name}
        impact={project.impact}
        techStack={project.techStack}
        githubUrl={project.githubUrl}
        date={project.date}
        description={project.description}
        star={project.star}
      />
    </div>
  );
}
