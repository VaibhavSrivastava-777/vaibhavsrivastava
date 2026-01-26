import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-container text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Project Not Found</h1>
      <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
      <Link href="/portfolio" className="btn-primary">
        Back to Portfolio
      </Link>
    </div>
  );
}
