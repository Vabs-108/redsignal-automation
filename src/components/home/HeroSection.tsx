import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignalLines } from "./SignalLines";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Animated background */}
      <SignalLines />

      {/* Content */}
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Enterprise-Grade Automation</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Next-Generation
            <br />
            <span className="text-gradient-red">Telecom Automation</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Streamline network operations, reduce manual intervention, and accelerate 
            service delivery with intelligent automation for modern telecom infrastructure.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/platform">
                Explore Automation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/about">
                Platform Overview
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">10x</div>
              <div className="text-sm text-muted-foreground mt-1">Faster Provisioning</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">60%</div>
              <div className="text-sm text-muted-foreground mt-1">Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
