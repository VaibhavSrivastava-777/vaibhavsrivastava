interface SkillsData {
  marketResearch: string[];
  productStrategy: string[];
  aiMl: string[];
  solutionArchitecture: string[];
  gtmExecution: string[];
}

interface SkillsProps {
  skills: SkillsData;
}

const categoryLabels: Record<keyof SkillsData, string> = {
  marketResearch: "Market Research",
  productStrategy: "Product Strategy",
  aiMl: "AI/ML",
  solutionArchitecture: "Solution Architecture",
  gtmExecution: "GTM Execution",
};

export default function Skills({ skills }: SkillsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Skills Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([key, skillList]) => (
          <div key={key} className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {categoryLabels[key as keyof SkillsData]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
