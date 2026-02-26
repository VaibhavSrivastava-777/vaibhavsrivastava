interface ExecutiveSummaryProps {
  summary: string;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const isHtml = summary && (summary.trim().startsWith("<") || summary.includes("</"));
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Executive Summary</h2>
      <div className="prose prose-lg max-w-none text-gray-700">
        {isHtml ? (
          <div
            className="leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        ) : (
          <p className="leading-relaxed">{summary}</p>
        )}
      </div>
    </section>
  );
}
