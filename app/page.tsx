import Hero from "@/components/Hero";
import Link from "next/link";
import { TrendingUp, Users, Code, Target } from "lucide-react";
import { getLatestBlogPost } from "@/lib/utils";
import { getLatestSpeakingEngagement } from "@/lib/utils";

const skillCategories = [
  {
    name: "Market Research",
    icon: TrendingUp,
    description: "Data-driven insights and market analysis",
  },
  {
    name: "Product Strategy",
    icon: Target,
    description: "Strategic product planning and execution",
  },
  {
    name: "AI/ML",
    icon: Code,
    description: "AI/ML innovation and implementation",
  },
  {
    name: "GTM Execution",
    icon: Users,
    description: "Go-to-market strategy and execution",
  },
];

export default async function Home() {
  // These will be populated from actual data later
  const latestBlog = getLatestBlogPost();
  const latestSpeaking = getLatestSpeakingEngagement();

  return (
    <div>
      <Hero />
      
      {/* Skills Snapshot */}
      <section className="section-container bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Core Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className="card text-center">
                <Icon className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {skill.name}
                </h3>
                <p className="text-gray-600 text-sm">{skill.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Section */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Latest Blog Post */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Latest Article</h2>
            {latestBlog ? (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {latestBlog.title}
                </h3>
                <p className="text-gray-600 mb-4">{latestBlog.excerpt}</p>
                <Link
                  href={`/blog/${latestBlog.slug}`}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Read more →
                </Link>
              </>
            ) : (
              <p className="text-gray-600">Coming soon...</p>
            )}
          </div>

          {/* Recent Speaking Engagement */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Speaking</h2>
            {latestSpeaking ? (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {latestSpeaking.event}
                </h3>
                <p className="text-gray-600 mb-2">{latestSpeaking.topic}</p>
                <p className="text-sm text-gray-500 mb-4">{latestSpeaking.date}</p>
                <Link
                  href="/speaking"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  View all engagements →
                </Link>
              </>
            ) : (
              <p className="text-gray-600">Coming soon...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
