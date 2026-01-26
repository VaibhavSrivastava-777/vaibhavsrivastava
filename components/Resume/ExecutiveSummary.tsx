interface ExecutiveSummaryProps {
  summary: string;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Executive Summary</h2>
      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="leading-relaxed">{summary}</p>
      </div>
    </section>
  );
}
