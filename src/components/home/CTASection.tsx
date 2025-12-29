import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
            Ready to Transform Your Network Operations?
          </h2>
          <p className="text-lg text-background/70 mb-10">
            Join leading telecom operators who have already automated their network infrastructure 
            and achieved unprecedented operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="xl" 
              className="bg-background text-foreground hover:bg-background/90 font-bold"
            >
              <Link to="/platform">
                Start Automation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="xl"
              className="border-background/30 text-background hover:bg-background/10"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
