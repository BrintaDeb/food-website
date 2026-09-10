'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

export function useGsapFlip(dependencies: unknown[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  // Before layout updates, snapshot the positions of all cards
  const captureSnapshot = () => {
    if (!containerRef.current || typeof window === 'undefined') return;
    const cards = containerRef.current.querySelectorAll('.flip-card-item');
    if (cards.length > 0) {
      flipStateRef.current = Flip.getState(cards);
    }
  };

  // After DOM updates, animate the layout change at 60fps
  useLayoutEffect(() => {
    if (!flipStateRef.current || !containerRef.current || typeof window === 'undefined') return;

    Flip.from(flipStateRef.current, {
      duration: 0.45,
      ease: 'power2.out',
      absolute: true,
      stagger: 0.02,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.2)' }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.85,
          duration: 0.25,
          ease: 'power1.in'
        })
    });

    flipStateRef.current = null;
  }, dependencies);

  return { containerRef, captureSnapshot };
}
