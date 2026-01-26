import Link from "next/link";
import { Download, Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <section className="section-container">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Strategic Thought Leader
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-4">
          Product Strategy | AI/ML Innovation | Growth Leadership
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Transforming vision into reality through strategic product development, 
          AI/ML innovation, and data-driven growth strategies. 
          Passionate about building products that create meaningful impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/resume" className="btn-primary inline-flex items-center justify-center gap-2">
            <Download size={20} />
            Download Resume
          </Link>
          <Link href="/portfolio" className="btn-secondary inline-flex items-center justify-center gap-2">
            <Briefcase size={20} />
            View Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
