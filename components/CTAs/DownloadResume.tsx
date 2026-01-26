import { Download } from "lucide-react";
import Link from "next/link";

export default function DownloadResume() {
  return (
    <Link
      href="/resume.pdf"
      download
      className="btn-primary inline-flex items-center gap-2"
    >
      <Download size={20} />
      Download Resume PDF
    </Link>
  );
}
