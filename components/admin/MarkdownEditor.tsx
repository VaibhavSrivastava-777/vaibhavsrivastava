"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function MarkdownEditor({ value, onChange, label = "Content" }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-primary hover:text-primary-dark"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>
      
      {showPreview ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[400px] prose prose-sm max-w-none">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          placeholder="Write your content in Markdown..."
        />
      )}
      
      <p className="mt-1 text-xs text-gray-500">Use Markdown syntax for formatting</p>
    </div>
  );
}
