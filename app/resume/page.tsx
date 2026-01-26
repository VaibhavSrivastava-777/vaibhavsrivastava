import { Metadata } from "next";
import fs from "fs";
import path from "path";
import ExecutiveSummary from "@/components/Resume/ExecutiveSummary";
import Experience from "@/components/Resume/Experience";
import Skills from "@/components/Resume/Skills";
import DownloadResume from "@/components/CTAs/DownloadResume";

export const metadata: Metadata = {
  title: "Resume | Vaibhav Srivastava",
  description: "Executive summary, experience, and skills of Vaibhav Srivastava - Strategic Thought Leader",
};

function getResumeData() {
  const filePath = path.join(process.cwd(), "content", "resume.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default function ResumePage() {
  const resumeData = getResumeData();

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Resume</h1>
          <DownloadResume />
        </div>

        <ExecutiveSummary summary={resumeData.executiveSummary} />
        <Experience experiences={resumeData.experience} />
        <Skills skills={resumeData.skills} />

        <div className="mt-12 text-center print:hidden">
          <DownloadResume />
        </div>
      </div>
    </div>
  );
}
