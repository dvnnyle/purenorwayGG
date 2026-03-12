"use client";

import { useState } from "react";

export default function SectionScaffold() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const TSX_SCAFFOLD = `import "./newSection.css";

export default function NewSection() {
  return (
    <section className="new-section">
      <div className="new-section-container">
        <h2>New Section Title</h2>
        <p>Add your content here</p>
      </div>
    </section>
  );
}`;

  const CSS_SCAFFOLD = `.new-section {
  padding: 60px 20px;
  background-color: #f9f9f9;
}

.new-section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.new-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.new-section p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .new-section {
    padding: 40px 15px;
  }

  .new-section h2 {
    font-size: 1.5rem;
  }
}`;

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="scaffold-container">
      <div className="scaffold-grid">
        {/* TSX Tab */}
        <div className="scaffold-card">
          <div className="scaffold-header">
            <h3>Component Template</h3>
            <span className="scaffold-lang">TSX</span>
          </div>
          <pre className="scaffold-code">
            <code>{TSX_SCAFFOLD}</code>
          </pre>
          <button
            className="scaffold-copy-btn"
            onClick={() => handleCopy(TSX_SCAFFOLD, "tsx")}
          >
            {copiedTab === "tsx" ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>

        {/* CSS Tab */}
        <div className="scaffold-card">
          <div className="scaffold-header">
            <h3>Styles Template</h3>
            <span className="scaffold-lang">CSS</span>
          </div>
          <pre className="scaffold-code">
            <code>{CSS_SCAFFOLD}</code>
          </pre>
          <button
            className="scaffold-copy-btn"
            onClick={() => handleCopy(CSS_SCAFFOLD, "css")}
          >
            {copiedTab === "css" ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      <div className="scaffold-instructions">
        <h3>How to Use</h3>
        <ol>
          <li>Copy the TSX template and create <code>newSection.tsx</code> in <code>src/components/sections/</code></li>
          <li>Copy the CSS template and create <code>newSection.css</code> in the same folder</li>
          <li>Replace "newSection" with your section name (e.g., "heroSection")</li>
          <li>Update the component with your content and styling</li>
          <li>Import and use in your page</li>
        </ol>
      </div>
    </div>
  );
}
