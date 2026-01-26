import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DownloadResume() {
  return (
    <Link
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary inline-flex items-center gap-2"
    >
      <ExternalLink size={20} />
      View Resume PDF
    </Link>
  );
}
