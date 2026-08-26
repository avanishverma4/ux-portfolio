'use client';

import React, { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { ExperienceSection } from '@/components/ExperienceSection';
import { SkillsSection } from '@/components/SkillsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ResumeModal } from '@/components/ResumeModal';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { SmoothScroll } from '@/components/SmoothScroll';
import { scrollToSection } from '@/lib/scroll';

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  const scrollToSandbox = useCallback(() => {
    // Focus the sandbox after scrolling so keyboard users land inside it.
    scrollToSection('token-sandbox-card');
    window.setTimeout(() => {
      document.getElementById('accent-swatch')?.focus({ preventScroll: true });
    }, 700);
  }, []);

  return (
    // `reducedMotion="user"` makes every Motion animation honour the OS setting.
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        {/* Lenis Smooth Scroll Manager */}
        <SmoothScroll />

        {/* Viewport Top Scroll Progress Indicator */}
        <ScrollProgressBar />

        {/* Sticky Top Header */}
        <Header onOpenResume={openResume} onOpenSandbox={scrollToSandbox} />

        {/* Main Content Area */}
        <main id="main-content" tabIndex={-1} className="relative">
          <Hero onOpenResume={openResume} />

          <ProjectShowcase />

          <ExperienceSection />

          <SkillsSection />

          <TestimonialsSection />

          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Resume Modal */}
        <ResumeModal isOpen={resumeOpen} onClose={closeResume} />
      </div>
    </MotionConfig>
  );
}
