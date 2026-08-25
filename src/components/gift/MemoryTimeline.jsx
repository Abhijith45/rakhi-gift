import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Sparkles, MapPin, Award } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const MemoryTimeline = ({
  gift,
  plan
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);

  // STRICT PACKAGE RULE: Hidden on Basic plan
  if (!config.timeline?.enabled || normalizedPlan === 'BASIC') {
    return null;
  }

  // Derive timeline events from real gift.memories or gift.timeline
  const rawTimeline = gift?.memories || gift?.timeline;
  let events = [];

  if (Array.isArray(rawTimeline) && rawTimeline.length > 0) {
    events = rawTimeline.map((item, idx) => ({
      id: item.id || `timeline-${idx}`,
      date: item.date || item.year || item.time || `Milestone 0${idx + 1}`,
      title: item.title || item.heading || `Memory #${idx + 1}`,
      description: item.description || item.text || item.desc || '',
      imageUrl: item.imageUrl || item.image || item.photoUrl || null,
      location: item.location || item.place || null
    }));
  } else if (Array.isArray(gift?.photos) && gift.photos.length > 0) {
    // Curate chronological milestone list from photos having title / caption / date
    events = gift.photos.slice(0, 6).map((p, idx) => ({
      id: p.id || `timeline-${idx}`,
      date: p.date || p.year || (p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : `Chapter 0${idx + 1}`),
      title: p.title || p.caption || `Cherished Memory #${idx + 1}`,
      description: p.caption !== p.title ? p.caption : 'A timeless memory captured in our hearts.',
      imageUrl: p.imageUrl || p.url,
      location: p.location || null
    }));
  }

  if (events.length === 0) {
    return null;
  }

  const isDeluxe = normalizedPlan === 'DELUXE';
  const trackRef = useRef(null);
  const rowRefs = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeRows, setActiveRows] = useState({});
  const [visibleRows, setVisibleRows] = useState({});

  // 1. Scroll-driven timeline progress line & bidirectional node highlighting
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger line when viewport reaches the middle (45% from top)
      const triggerY = windowHeight * 0.55;
      const trackTop = trackRect.top;
      const trackHeight = trackRect.height;

      // Calculate progress from 0% to 100%
      const scrolledPastTop = triggerY - trackTop;
      const rawProgress = (scrolledPastTop / trackHeight) * 100;
      const clampedProgress = Math.max(0, Math.min(100, rawProgress));
      setScrollProgress(clampedProgress);

      // Check which rows are reached by the progress line
      const newActive = {};
      rowRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Node is active if its center is above the trigger line
        const nodeY = rect.top + 30;
        if (nodeY <= triggerY) {
          newActive[index] = true;
        } else {
          newActive[index] = false;
        }
      });
      setActiveRows(newActive);
    };

    const onScrollThrottled = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', onScrollThrottled, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      window.removeEventListener('resize', onScrollThrottled);
      cancelAnimationFrame(animationFrameId);
    };
  }, [events.length]);

  // 2. Corner-to-Middle Lazy Loading Slide Animation via IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = entry.target.dataset.index;
        if (entry.isIntersecting) {
          setVisibleRows((prev) => ({ ...prev, [index]: true }));
        } else {
          // Bidirectional fade when scrolling back out
          if (entry.boundingClientRect.top > window.innerHeight) {
            setVisibleRows((prev) => ({ ...prev, [index]: false }));
          }
        }
      });
    }, observerOptions);

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [events.length]);

  return (
    <section
      id="timeline"
      className={`section gift-timeline-section plan-${normalizedPlan.toLowerCase()}`}
      aria-label="Memory Timeline"
    >
      <div className="container timeline-container">
        {/* Section Header */}
        <div className="section-header timeline-header">
          <div className="section-tag timeline-tag">
            {isDeluxe ? <Award size={13} /> : <Calendar size={13} />}
            <span>{config.timeline.eyebrow}</span>
          </div>
          <h2 className="section-title timeline-title">
            {config.timeline.title}
          </h2>
          {config.timeline.subtitle && (
            <p className="section-subtitle timeline-subtitle">
              {config.timeline.subtitle}
            </p>
          )}
        </div>

        {/* Vertical Connected Timeline Track */}
        <div className="timeline-track-wrapper" ref={trackRef}>
          {/* Base Inactive Guide Line (Subtle background thread) */}
          <div className="timeline-thread-base" aria-hidden="true" />

          {/* Active Glowing Progress Thread (Fills on scroll down, recedes on scroll up) */}
          <div
            className={`timeline-thread-progress ${isDeluxe ? 'progress-deluxe' : ''}`}
            style={{ height: `${scrollProgress}%` }}
            aria-hidden="true"
          >
            {/* Glowing Leading Head of Progress Line */}
            <div className="thread-leading-glow" />
          </div>

          <div className="timeline-events-container">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const isActive = !!activeRows[index];
              const isVisible = !!visibleRows[index];

              return (
                <div
                  key={event.id || index}
                  ref={(el) => (rowRefs.current[index] = el)}
                  data-index={index}
                  className={`timeline-event-row ${isEven ? 'row-left' : 'row-right'} ${isDeluxe ? 'event-deluxe' : ''} ${isVisible ? 'row-in-view' : ''} ${isActive ? 'row-active' : ''}`}
                >
                  {/* Central Pushpin Node with Glowing Pulse when Active */}
                  <div
                    className={`timeline-pin-node ${isDeluxe ? 'pin-node-deluxe' : ''} ${isActive ? 'pin-node-active' : ''}`}
                    aria-hidden="true"
                  >
                    {isActive && <div className="pin-pulse-ring" />}
                    <div className="pin-node-core" />
                  </div>

                  {/* Milestone Card with Corner-to-Middle Lazy Slide */}
                  <div className={`timeline-milestone-card paper-card ${isDeluxe ? 'deluxe-milestone-card' : ''} ${isActive ? 'card-active-glow' : ''}`}>
                    {isDeluxe && <div className="deluxe-card-corner" aria-hidden="true" />}

                    {/* Date Tag prominently displaying date after calendar icon */}
                    <div className={`milestone-date-tag ${isActive ? 'date-tag-active' : ''}`}>
                      <Calendar size={13} className="date-icon" />
                      <span className="date-text">{event.date}</span>
                    </div>

                    {/* Image Thumbnail (if available) */}
                    {event.imageUrl && (
                      <div className="milestone-photo-wrap">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="milestone-photo-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="milestone-title">{event.title}</h3>
                    {event.description && (
                      <p className="milestone-desc">{event.description}</p>
                    )}

                    {event.location && (
                      <div className="milestone-location">
                        <MapPin size={12} className="location-icon" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .gift-timeline-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-8, 2rem);
          position: relative;
          background: transparent;
        }

        .timeline-container {
          max-width: 920px;
          width: 100%;
          margin: 0 auto;
          padding: 0 clamp(0.75rem, 3.5vw, 1.5rem);
        }

        .timeline-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .timeline-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-rakhi-red, #9B2226);
          background: var(--color-rakhi-light, #FBF0EF);
          padding: 4px 14px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-3, 0.75rem);
        }

        .plan-deluxe .timeline-tag {
          color: #7D5728;
          background: linear-gradient(135deg, #FFF6E5 0%, #FAEDD2 100%);
          border: 1px solid #DFC9A8;
        }

        .timeline-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-2, 0.5rem);
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .plan-deluxe .timeline-title {
          color: var(--gift-text, #2D1D13);
        }

        .timeline-subtitle {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.875rem, 1.6vw, 1rem);
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 580px;
        }

        /* --- Scroll Animated Timeline Track --- */
        .timeline-track-wrapper {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          padding: var(--space-6, 1.5rem) 0;
        }

        /* Inactive Base Thread (Subtle guide) */
        .timeline-thread-base {
          position: absolute;
          top: 24px;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 2.5px;
          background: var(--gift-border, rgba(198, 146, 52, 0.18));
          border-radius: var(--radius-full, 9999px);
          z-index: 1;
        }

        /* Active Glowing Silk Thread (Fills smoothly on scroll) */
        .timeline-thread-progress {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 3.5px;
          background: var(--gift-thread, linear-gradient(180deg, #9B2226 0%, #D9383C 60%, #E65A5D 100%));
          box-shadow: 0 0 10px var(--gift-accent-glow, rgba(155, 34, 38, 0.5));
          border-radius: var(--radius-full, 9999px);
          z-index: 2;
          transition: height 0.08s linear;
          max-height: calc(100% - 48px);
        }

        .progress-deluxe {
          width: 4px;
          background: linear-gradient(180deg, var(--gift-accent, #8E1616) 0%, var(--gift-gold, #D4AF37) 100%);
          box-shadow: 0 0 12px var(--gift-gold-muted, rgba(212, 175, 55, 0.6));
        }

        .thread-leading-glow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: var(--gift-gold, #FFD700);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--gift-gold, #FFD700), 0 0 18px var(--gift-gold-muted, rgba(255, 215, 0, 0.8));
        }

        .timeline-events-container {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: var(--space-10, 2.5rem);
        }

        .timeline-event-row {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .row-left {
          justify-content: flex-start;
          padding-right: 50%;
        }

        .row-right {
          justify-content: flex-end;
          padding-left: 50%;
        }

        /* --- Center Pushpin Node with Scroll Illumination --- */
        .timeline-pin-node {
          position: absolute;
          left: 50%;
          top: 26px;
          transform: translate(-50%, -50%) scale(0.9);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, var(--gift-surface, #E2D7C3) 0%, var(--gift-border, #B8A68B) 55%, #7D6D56 100%);
          box-shadow: 0 2px 6px var(--gift-shadow-tone, rgba(0, 0, 0, 0.18));
          border: 1.5px solid var(--gift-border, #8C7A62);
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.35s cubic-bezier(0.2, 0, 0, 1);
        }

        .pin-node-core {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gift-text-muted, #857D75);
          transition: all 0.35s ease;
        }

        /* Active Pin State when progress line reaches it */
        .timeline-pin-node.pin-node-active {
          transform: translate(-50%, -50%) scale(1.15);
          background: radial-gradient(circle at 35% 35%, var(--gift-gold-light, #FFF8C6) 0%, var(--gift-pin, #D4AF37) 45%, #8B6508 90%, #5E4304 100%);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35), 0 0 10px var(--gift-gold-muted, rgba(212, 175, 55, 0.7));
          border-color: #5E4304;
        }

        .pin-node-active .pin-node-core {
          background: var(--gift-accent, #9B2226);
          box-shadow: 0 0 4px var(--gift-accent-glow, rgba(155, 34, 38, 0.8));
        }

        .pin-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid var(--gift-gold-muted, rgba(212, 175, 55, 0.6));
          animation: pinPulse 2s cubic-bezier(0.2, 0, 0.8, 1) infinite;
        }

        @keyframes pinPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .pin-node-deluxe.pin-node-active {
          background: radial-gradient(circle at 35% 35%, var(--gift-surface, #FFFDF0) 0%, var(--gift-gold, #E5C158) 40%, #9B7815 85%, #5E4304 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 12px var(--gift-gold-muted, rgba(212, 175, 55, 0.8));
        }

        /* --- Corner-to-Middle Lazy Loading Slide Animation --- */
        .timeline-milestone-card {
          position: relative;
          width: calc(100% - 32px);
          background: var(--gift-surface, #FFFDF9);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-xl, 16px);
          padding: clamp(1.25rem, 3vw, 1.6rem);
          box-shadow: 
            0 8px 24px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.07)),
            0 2px 6px -1px var(--gift-shadow-tone, rgba(60, 45, 25, 0.03));
          opacity: 0;
          transition: 
            transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.6s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
          will-change: transform, opacity;
        }

        /* Initial Corner Offset states */
        .row-left .timeline-milestone-card {
          margin-right: 32px;
          transform: translate3d(-38px, 28px, 0) scale(0.94) rotate(-1.5deg);
        }

        .row-right .timeline-milestone-card {
          margin-left: 32px;
          transform: translate3d(38px, 28px, 0) scale(0.94) rotate(1.5deg);
        }

        /* In-View Settled State: Slides smoothly from corner to center */
        .row-in-view .timeline-milestone-card {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
        }

        /* Active highlight on card when scrolled */
        .timeline-milestone-card.card-active-glow {
          border-color: var(--gift-border-gold, rgba(198, 146, 52, 0.45));
          box-shadow: 
            0 12px 32px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.12)),
            0 0 12px var(--gift-gold-muted, rgba(198, 146, 52, 0.08));
        }

        .timeline-milestone-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 
            0 16px 36px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.15)),
            0 4px 10px var(--gift-shadow-tone, rgba(60, 45, 25, 0.05));
        }

        .deluxe-milestone-card {
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF5ED) 100%);
          border: 1px solid var(--gift-border-gold, #DFCDB4);
        }

        .deluxe-card-corner {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 12px;
          height: 12px;
          border-top: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-right: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-top-right-radius: 3px;
          pointer-events: none;
        }

        /* Date Tag Prominently Displaying Date After Calendar Icon */
        .milestone-date-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--gift-text-secondary, #59524C);
          background: var(--gift-tag-bg, #F4ECE3);
          padding: 3px 11px;
          border-radius: var(--radius-full, 9999px);
          margin-bottom: 10px;
          letter-spacing: 0.02em;
          border: 1px solid var(--gift-tag-border, rgba(0, 0, 0, 0.05));
          transition: all 0.3s ease;
        }

        .date-icon {
          color: var(--gift-accent, #9B2226);
          flex-shrink: 0;
        }

        .date-text {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-weight: 700;
        }

        /* Active Date Tag Highlight */
        .milestone-date-tag.date-tag-active {
          color: var(--gift-tag-color, #9B2226);
          background: var(--gift-tag-bg, #FBF0EF);
          border-color: var(--gift-tag-border, rgba(155, 34, 38, 0.2));
          box-shadow: 0 2px 6px var(--gift-shadow-tone, rgba(155, 34, 38, 0.12));
        }

        .event-deluxe .milestone-date-tag.date-tag-active {
          color: var(--gift-gold-dark, #7D5728);
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF6E5) 0%, var(--gift-canvas, #FAEDD2) 100%);
          border-color: var(--gift-border-gold, #DFC9A8);
          box-shadow: 0 2px 6px var(--gift-gold-muted, rgba(198, 146, 52, 0.18));
        }

        .milestone-photo-wrap {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-md, 10px);
          overflow: hidden;
          background: var(--gift-canvas, #E8DEC8);
          border: 1px solid var(--gift-border, rgba(0, 0, 0, 0.06));
          margin-bottom: 12px;
        }

        .milestone-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .timeline-milestone-card:hover .milestone-photo-img {
          transform: scale(1.03);
        }

        .milestone-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.15rem, 2.2vw, 1.35rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        .milestone-desc {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.875rem;
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.65;
          margin: 0;
        }

        .milestone-location {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: var(--gift-text-muted, #857D75);
          margin-top: 10px;
          font-weight: 500;
        }

        .location-icon {
          color: var(--gift-gold, #C69234);
        }

        /* --- Responsive Viewports --- */
        @media (max-width: 768px) {
          .timeline-track-wrapper {
            overflow-x: clip;
          }

          .timeline-thread-base,
          .timeline-thread-progress {
            left: clamp(14px, 4vw, 20px);
            transform: none;
          }

          .row-left, .row-right {
            padding-left: clamp(34px, 9vw, 46px);
            padding-right: 0;
            justify-content: flex-start;
          }

          .row-left .timeline-milestone-card,
          .row-right .timeline-milestone-card {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            padding: clamp(1.15rem, 3.5vw, 1.65rem);
            transform: translate3d(24px, 18px, 0) scale(0.96) rotate(0.6deg);
          }

          .row-in-view .timeline-milestone-card {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }

          .timeline-pin-node {
            left: clamp(14px, 4vw, 20px);
            transform: translate(-50%, -50%) scale(0.88);
          }

          .timeline-pin-node.pin-node-active {
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .timeline-milestone-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .timeline-thread-progress {
            transition: none !important;
          }
          .pin-pulse-ring {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MemoryTimeline;
