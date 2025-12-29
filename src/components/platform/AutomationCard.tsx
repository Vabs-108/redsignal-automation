import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  delay?: number;
}

export function AutomationCard({ icon: Icon, title, description, features, delay = 0 }: AutomationCardProps) {
  return (
    <div 
      className={cn(
        "group p-8 rounded-xl bg-card border border-border",
        "transition-all duration-300 hover:shadow-elevated hover:border-primary/30",
        "opacity-0 animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-red-glow transition-all duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
