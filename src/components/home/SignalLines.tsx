import { useEffect, useRef } from "react";

export function SignalLines() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll(".signal-path");
    paths.forEach((path, index) => {
      const length = (path as SVGPathElement).getTotalLength();
      (path as SVGPathElement).style.strokeDasharray = `${length}`;
      (path as SVGPathElement).style.strokeDashoffset = `${length}`;
      (path as SVGPathElement).style.animation = `dash-flow ${8 + index * 2}s linear infinite`;
      (path as SVGPathElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0 85% 45% / 0)" />
            <stop offset="50%" stopColor="hsl(0 85% 45% / 0.6)" />
            <stop offset="100%" stopColor="hsl(0 85% 45% / 0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Network connection lines */}
        <path
          className="signal-path"
          d="M-50 200 Q 300 180, 600 250 T 1250 200"
          fill="none"
          stroke="url(#signalGradient)"
          strokeWidth="2"
          filter="url(#glow)"
        />
        <path
          className="signal-path"
          d="M-50 400 Q 400 350, 700 420 T 1250 380"
          fill="none"
          stroke="url(#signalGradient)"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <path
          className="signal-path"
          d="M-50 600 Q 200 550, 500 620 T 1250 580"
          fill="none"
          stroke="url(#signalGradient)"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {/* Signal nodes */}
        <circle cx="200" cy="200" r="4" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="600" cy="250" r="5" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="900" cy="200" r="4" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="400" cy="400" r="4" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="700" cy="420" r="5" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="1000" cy="380" r="4" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="300" cy="600" r="4" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
        <circle cx="800" cy="600" r="5" fill="hsl(0 85% 45%)" className="animate-pulse-subtle" />
      </svg>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
    </div>
  );
}
