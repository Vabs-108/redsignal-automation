import { Settings, Monitor, Shield, Cpu, Network, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Settings,
    title: "Automated Provisioning",
    description: "Zero-touch network provisioning with intelligent templates and validation.",
  },
  {
    icon: Monitor,
    title: "Real-time Monitoring",
    description: "Comprehensive telemetry and observability across your entire network.",
  },
  {
    icon: Shield,
    title: "Self-Healing Networks",
    description: "Automatic fault detection and remediation for maximum uptime.",
  },
  {
    icon: Cpu,
    title: "Configuration Management",
    description: "Version-controlled configurations with rollback capabilities.",
  },
  {
    icon: Network,
    title: "Multi-Vendor Support",
    description: "Unified automation across Cisco, Nokia, and more platforms.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "AI-powered insights and predictive network analytics.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Network Automation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to automate, monitor, and optimize your telecom infrastructure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group p-8 rounded-xl bg-card border border-border",
                "transition-all duration-300 hover:shadow-elevated hover:border-primary/20",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
