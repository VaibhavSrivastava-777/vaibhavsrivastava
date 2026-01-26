"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/client-utils";

interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  achievements: string[];
  description: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{exp.role}</h3>
                <p className="text-lg text-primary font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(exp.startDate)} - {exp.endDate === "present" ? "Present" : formatDate(exp.endDate)} • {exp.location}
                </p>
              </div>
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={expandedIndex === index ? "Collapse" : "Expand"}
              >
                {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            
            {expandedIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 mb-4">{exp.description}</p>
                <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
