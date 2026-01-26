"use client";

import { Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // In a real implementation, you would send this to an API endpoint
    // For now, we'll just show a success message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h1>
        <p className="text-lg text-gray-600 mb-12">
          Interested in collaboration, speaking opportunities, or mentorship? 
          I'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h2>
            <div className="space-y-6">
              <a
                href="mailto:contact@vaibhavsrivastava.com"
                className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">contact@vaibhavsrivastava.com</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/vaibhavsrivastava777/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Linkedin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <p className="font-medium">Connect on LinkedIn</p>
                </div>
              </a>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/resume" className="hover:text-primary">
                    View Resume
                  </a>
                </li>
                <li>
                  <a href="/portfolio" className="hover:text-primary">
                    Check Portfolio
                  </a>
                </li>
                <li>
                  <a href="/speaking" className="hover:text-primary">
                    Speaking & Mentoring
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  Thank you! Your message has been sent. I'll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Something went wrong. Please try again or email directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
