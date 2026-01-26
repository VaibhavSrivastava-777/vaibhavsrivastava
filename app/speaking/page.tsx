import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { formatDate } from "@/lib/client-utils";
import { Calendar, MapPin, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Speaking & Mentoring | Vaibhav Srivastava",
  description: "Speaking engagements, mentoring opportunities, and testimonials",
};

function getSpeakingData() {
  const filePath = path.join(process.cwd(), "content", "speaking.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default function SpeakingPage() {
  const data = getSpeakingData();
  const { engagements, mentoring } = data;

  return (
    <div className="section-container">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Speaking & Mentoring</h1>

        {/* Speaking Engagements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Speaking Engagements</h2>
          {engagements.length === 0 ? (
            <p className="text-gray-600">No speaking engagements listed yet.</p>
          ) : (
            <div className="space-y-6">
              {engagements.map((engagement: any, index: number) => (
                <div key={index} className="card">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {engagement.event}
                      </h3>
                      <p className="text-lg text-gray-700 mb-3">{engagement.topic}</p>
                      {engagement.description && (
                        <p className="text-gray-600 mb-4">{engagement.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(engagement.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {engagement.location}
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {engagement.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {engagement.videoUrl && (
                        <a
                          href={engagement.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-sm inline-flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Watch
                        </a>
                      )}
                      {engagement.slidesUrl && (
                        <a
                          href={engagement.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-sm inline-flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Slides
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mentoring Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Mentoring</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Areas of Expertise</h3>
              <ul className="space-y-2">
                {mentoring.areas.map((area: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary mt-1">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card bg-primary/5">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Request Mentoring Session</h3>
              <p className="text-gray-700 mb-4">
                Interested in mentorship? I'm available for strategic guidance on product strategy, 
                AI/ML adoption, career growth, and more.
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Testimonials */}
          {mentoring.testimonials && mentoring.testimonials.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Testimonials</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {mentoring.testimonials.map((testimonial: any, index: number) => (
                  <div key={index} className="card">
                    <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
