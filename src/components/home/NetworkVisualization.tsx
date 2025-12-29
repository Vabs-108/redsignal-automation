import { useEffect, useRef } from "react";

export function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const nodes = [
      { x: 100, y: 100, radius: 8, label: "Core Router" },
      { x: 250, y: 80, radius: 6, label: "Edge 1" },
      { x: 250, y: 180, radius: 6, label: "Edge 2" },
      { x: 400, y: 60, radius: 5, label: "Access 1" },
      { x: 400, y: 120, radius: 5, label: "Access 2" },
      { x: 400, y: 180, radius: 5, label: "Access 3" },
    ];

    const connections = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ];

    let animationProgress = 0;

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);

      // Draw connections with animation
      connections.forEach(([from, to], i) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];

        // Static line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(220, 38, 38, 0.2)";
        ctx.lineWidth = 2;
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Animated pulse
        const progress = (animationProgress + i * 0.2) % 1;
        const pulseX = fromNode.x + (toNode.x - fromNode.x) * progress;
        const pulseY = fromNode.y + (toNode.y - fromNode.y) * progress;

        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Outer glow
        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 38, 38, 0.1)";
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.fillStyle = "rgb(220, 38, 38)";
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.arc(node.x - 2, node.y - 2, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationProgress += 0.005;
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-xl bg-secondary/50"
    />
  );
}
