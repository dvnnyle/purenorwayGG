'use client';

import React, { useState, useEffect } from 'react';
import './SectionIndicator.css';

interface Section {
  id: string;
  label: string;
}

interface SectionIndicatorProps {
  sections: Section[];
}

export default function SectionIndicator({ sections }: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="section-indicator">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`indicator-item ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => scrollToSection(section.id)}
          title={section.label}
        >
          <div className="indicator-dot" />
          <span className="indicator-label">{section.label}</span>
        </div>
      ))}
    </div>
  );
}
