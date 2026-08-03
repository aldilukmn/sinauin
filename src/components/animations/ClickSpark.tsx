"use client";

import { useRef, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  children?: ReactNode;
}

export const ClickSpark = ({
  sparkColor = '#3b82f6',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}: ClickSparkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<any[]>([]);
  const lockedRef = useRef(false);
  const pathname = usePathname();

  // Lock briefly when route changes to prevent duplicate sparks, but let existing ones finish
  useEffect(() => {
    lockedRef.current = true;
    const timer = setTimeout(() => {
      lockedRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        // Don't clear sparks on window resize, let them finish
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear': return t;
        case 'ease-in': return t * t;
        case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t * (2 - t);
      }
    },
    [easing]
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  // Native document-level pointerdown listener (avoids React synthetic event double-fire)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Skip if locked (route transition in progress or recent spark)
      if (lockedRef.current) return;
      // Skip synthetic/programmatic clicks
      if (e.clientX === 0 && e.clientY === 0) return;
      // Skip if not a real primary button click
      if (e.button !== 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Since canvas is fixed to viewport, clientX/clientY map directly to canvas coordinates
      const x = e.clientX;
      const y = e.clientY;

      // Don't create sparks outside the canvas bounds
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return;

      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }));

      sparksRef.current.push(...newSparks);

      // Lock briefly to prevent any subsequent events from creating duplicate sparks
      lockedRef.current = true;
      setTimeout(() => {
        lockedRef.current = false;
      }, 100);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [sparkCount]);

  return (
    <>
      <canvas ref={canvasRef} className="block fixed inset-0 w-full h-full select-none pointer-events-none z-[100]" />
      {children}
    </>
  );
};
