import { cn } from "@/lib/utils";
import { Server, ChevronRight } from "lucide-react";

interface RouterCardProps {
  vendor: string;
  logo: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function RouterCard({ vendor, logo, isSelected, onSelect }: RouterCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-6 rounded-xl border-2 transition-all duration-300 text-left",
        "hover:shadow-elevated",
        isSelected
          ? "border-primary bg-primary/5 shadow-red-glow"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Vendor Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
            isSelected ? "bg-primary" : "bg-secondary"
          )}>
            <Server className={cn(
              "w-7 h-7",
              isSelected ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>

          {/* Vendor Info */}
          <div>
            <h4 className={cn(
              "text-lg font-bold mb-1 transition-colors",
              isSelected ? "text-primary" : "text-foreground"
            )}>
              {vendor}
            </h4>
            <p className="text-sm text-muted-foreground">Router Platform</p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className={cn(
          "w-5 h-5 transition-all",
          isSelected ? "text-primary translate-x-1" : "text-muted-foreground"
        )} />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
            <span className="text-sm font-medium">Selected</span>
          </div>
        </div>
      )}
    </button>
  );
}
