interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
}

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Education</h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="card">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {edu.degree} - {edu.field}
                </h3>
                <p className="text-lg text-primary font-medium mt-1">
                  {edu.institution}
                </p>
              </div>
              <p className="text-sm text-gray-600 md:text-right">
                {edu.period}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
