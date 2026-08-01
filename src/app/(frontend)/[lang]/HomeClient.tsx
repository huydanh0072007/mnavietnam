'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { StatCounter } from '@/components/ui/StatCounter';
import { Project } from '@/lib/types';
import { useSettings } from '@/lib/contexts/SettingsContext';


// Animation components
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ParallaxHero } from '@/components/animations/ParallaxHero';
import { InteractiveStars } from '@/components/animations/InteractiveStars';
import { ShimmerLine } from '@/components/animations/ShimmerLine';
import { GlowButton } from '@/components/animations/GlowButton';

export default function HomeClient({ featuredProjects, lang, dict }: { featuredProjects: Project[], lang: string, dict: any }) {
  const { settings, isLoading } = useSettings();
  const isEn = lang === 'en';
  const projectsUrl = lang === 'en' ? '/en/projects' : `/${lang}/danh-muc`;
  const submitUrl = lang === 'en' ? '/en/submit' : `/${lang}/ky-gui`;

  const heroTitle = isEn && dict.home.hero_title ? dict.home.hero_title : settings.hero_title;
  const heroSubtitle = isEn && dict.home.hero_subtitle ? dict.home.hero_subtitle : settings.hero_subtitle;

  // Split title if it contains line breaks (simulating <br/>)
  const titleParts = heroTitle ? heroTitle.split('<br/>') : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════ */}
      {/* HERO SECTION — Parallax + Particles */}
      {/* ═══════════════════════════════════ */}
      <ParallaxHero
        imageUrl="/starry-bg.jpg"
        speed={0.4}
      >
        {/* Interactive Mouse Spotlight Stars + Sparkles */}
        <InteractiveStars starCount={130} />

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">
          {/* Subtitle — fade in first */}
          <ScrollReveal direction="fade" delay={200} duration={1000}>
            <span className="text-[#C4A35A] font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-6 block">
              {dict.home.network}
            </span>
          </ScrollReveal>

          {/* Main heading — slide up */}
          <ScrollReveal direction="up" delay={400} duration={1000} distance={30}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
              {isLoading ? (
                <div className="h-16 md:h-24 bg-white/10 animate-pulse rounded-lg w-3/4 mx-auto mb-4"></div>
              ) : titleParts.length > 1 ? (
                <>
                  {titleParts[0]} <br className="hidden md:block" />
                  <span className="text-[#C4A35A]">{titleParts[1]}</span>
                </>
              ) : (
                <>{heroTitle}</>
              )}
            </h1>
          </ScrollReveal>

          {/* Description — slide up with more delay */}
          <ScrollReveal direction="up" delay={600} duration={1000} distance={20}>
            <div className="text-[#E8E6E1] text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-white/10 animate-pulse rounded w-5/6 mx-auto"></div>
                </div>
              ) : (
                <p>{heroSubtitle}</p>
              )}
            </div>
          </ScrollReveal>

          {/* CTA Buttons — slide up last */}
          <ScrollReveal direction="up" delay={800} duration={800} distance={15}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton>
                <Button size="lg" asChild>
                  <Link href={projectsUrl}>{dict.home.explore_btn}</Link>
                </Button>
              </GlowButton>
              <GlowButton>
                <Button size="lg" variant="secondary" className="border-[#C4A35A] text-[#C4A35A] hover:bg-[#C4A35A] hover:!text-[#1A1A2E]" asChild>
                  <Link href={submitUrl}>{dict.home.submit_btn}</Link>
                </Button>
              </GlowButton>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxHero>

      {/* ═══════════════════════════════════ */}
      {/* STATS SECTION — Staggered reveal    */}
      {/* ═══════════════════════════════════ */}
      <section className="py-20 bg-[#0A1628] relative -mt-20 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <ScrollReveal direction="up" delay={0} duration={700}>
              <StatCounter value={50} label={dict.home.stats_projects} suffix="+" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={150} duration={700}>
              <StatCounter value={15000} label={dict.home.stats_value} suffix="+" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300} duration={700}>
              <StatCounter value={200} label={dict.home.stats_investors} suffix="+" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={450} duration={700}>
              <StatCounter value={12} label={dict.home.stats_provinces} suffix="+" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* FEATURED DEALS — Staggered Cards    */}
      {/* ═══════════════════════════════════ */}
      <section className="py-24 bg-[#F8F6F2]">
        <div className="container mx-auto px-4">
          {/* Section Header with Shimmer Line */}
          <ScrollReveal direction="up" duration={800}>
            <div className="text-center mb-16">
              <span className="text-[#C4A35A] font-medium tracking-[0.2em] uppercase text-sm block mb-4">
                {dict.home.opportunities}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A2E] mb-6">
                {dict.home.featured_deals}
              </h2>
              {/* Shimmer Gold Line */}
              <ShimmerLine width="6rem" height="3px" />
            </div>
          </ScrollReveal>

          {/* Project Cards — Staggered appearance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ScrollReveal
                key={project.id}
                direction="up"
                delay={index * 200}
                duration={800}
                distance={50}
              >
                <ProjectCard project={project} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
          
          {/* View all button */}
          <ScrollReveal direction="fade" delay={600} duration={800}>
            <div className="text-center mt-12">
              <Button variant="secondary" size="lg" className="border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-[#C4A35A]" asChild>
                <Link href={projectsUrl}>{dict.home.view_all_deals}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* CTA SECTION — Glow Pulse Button     */}
      {/* ═══════════════════════════════════ */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4A35A] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2563EB] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-[float_25s_ease-in-out_-5s_infinite]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal direction="up" duration={800}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              {dict.home.cta_title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={800}>
            <p className="text-[#E8E6E1] text-lg max-w-2xl mx-auto mb-10 opacity-80">
              {dict.home.cta_desc}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400} duration={800}>
            {/* CTA with Glow Pulse Effect */}
            <GlowButton>
              <Button size="lg" asChild>
                <Link href={`/${lang}/ky-gui`}>{dict.home.cta_btn}</Link>
              </Button>
            </GlowButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
