'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useCartStore } from '@/store/useCartStore';
import { toast } from '@/lib/toast';
import type { MenuItem } from '@/types/menu';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export function useDraggableItem(item: MenuItem) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current || typeof window === 'undefined') return;

    const el = cardRef.current;
    const cartTarget = document.getElementById('floating-cart-zone');

    const draggableInstance = Draggable.create(el, {
      type: 'x,y',
      edgeResistance: 0.65,
      cursor: 'grab',
      activeCursor: 'grabbing',
      zIndexBoost: true,
      dragClickables: false,
      allowContextMenu: false,
      force3D: true,
      onPress() {
        gsap.to(el, {
          scale: 1.03,
          boxShadow: '0 20px 25px -5px rgba(255, 94, 0, 0.25)',
          duration: 0.15,
          ease: 'power1.out'
        });
      },
      onDrag() {
        if (!cartTarget) return;

        // Fast non-blocking hit test against floating cart zone
        const isOver = this.hitTest(cartTarget, '35%');
        if (isOver) {
          cartTarget.classList.add('cart-zone--hovered');
          gsap.to(cartTarget, {
            scale: 1.08,
            duration: 0.2,
            overwrite: 'auto'
          });
        } else {
          cartTarget.classList.remove('cart-zone--hovered');
          gsap.to(cartTarget, {
            scale: 1.0,
            duration: 0.2,
            overwrite: 'auto'
          });
        }
      },
      onDragEnd() {
        gsap.to(el, {
          scale: 1.0,
          boxShadow: 'none',
          duration: 0.2
        });

        const isDroppedInside = cartTarget ? this.hitTest(cartTarget, '35%') : false;
        if (cartTarget) {
          cartTarget.classList.remove('cart-zone--hovered');
        }

        if (isDroppedInside && cartTarget) {
          // 1. Dispatch to Zustand cart store without auto-opening modal drawer
          useCartStore.getState().addItem(
            {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image
            },
            { openDrawer: false }
          );

          // 2. Elastic spring feedback on floating cart zone
          gsap.fromTo(
            cartTarget,
            { scale: 1.25 },
            {
              scale: 1.0,
              duration: 0.6,
              ease: 'elastic.out(1.2, 0.4)',
              overwrite: 'auto'
            }
          );

          // 3. Audio-visual toast confirmation
          toast.show(`Added "${item.name}" to bag! 🍛`, 'success');

          // 4. Smoothly snap back to origin and clear ALL inline styles (including z-index)
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.25,
            ease: 'power2.out',
            clearProps: 'all',
            onComplete: () => {
              draggableInstance[0]?.update();
            }
          });
        } else {
          // Snap back smoothly if dropped outside
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: 'back.out(1.5)',
            clearProps: 'all',
            onComplete: () => {
              draggableInstance[0]?.update();
            }
          });
        }
      }
    });

    return () => {
      if (draggableInstance[0]) {
        draggableInstance[0].kill();
      }
    };
  }, [item]);

  return { cardRef };
}
