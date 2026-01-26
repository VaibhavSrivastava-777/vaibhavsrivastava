import Link from "next/link";
import { Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Vaibhav Srivastava. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/vaibhavsrivastava777/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contact@vaibhavsrivastava.com"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
