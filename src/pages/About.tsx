import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Brain, Globe, BarChart3, Layers, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const roadmapItems = [
  {
    icon: Brain,
    title: "AI-Driven Automation",
    description: "Machine learning models that predict network issues before they occur and automatically optimize performance.",
    status: "In Development",
  },
  {
    icon: Globe,
    title: "Multi-Vendor Support",
    description: "Expanded support for Juniper, Huawei, Arista, and other major network equipment vendors.",
    status: "Planned",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep analytics with customizable reports, trend analysis, and capacity planning tools.",
    status: "Planned",
  },
  {
    icon: Layers,
    title: "Intent-Based Networking",
    description: "Define business intent and let the platform automatically translate it to network configurations.",
    status: "Research",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>About & Roadmap | NetAuto</title>
        <meta 
          name="description" 
          content="Learn about NetAuto's vision for telecom automation at scale. Explore our future roadmap including AI-driven automation and multi-vendor support." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-20 bg-gradient-subtle relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            
            {/* Animated signal lines */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(0 85% 45% / 0)" />
                  <stop offset="50%" stopColor="hsl(0 85% 45% / 0.3)" />
                  <stop offset="100%" stopColor="hsl(0 85% 45% / 0)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1" />
              <line x1="0" y1="90%" x2="100%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1" />
            </svg>

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-3xl">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Vision</span>
                </div>
                <h1 
                  className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 opacity-0 animate-fade-in-up" 
                  style={{ animationDelay: "0.2s" }}
                >
                  Transforming Telecom Operations at Scale
                </h1>
                <p 
                  className="text-xl text-muted-foreground opacity-0 animate-fade-in-up" 
                  style={{ animationDelay: "0.3s" }}
                >
                  We believe in a future where network operations are fully automated, 
                  self-healing, and intelligent. Our platform is designed to make that vision a reality.
                </p>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Why Network Automation Matters
                  </h2>
                  <div className="space-y-6 text-muted-foreground">
                    <p>
                      Modern telecom networks are incredibly complex, with thousands of devices, 
                      millions of configurations, and petabytes of traffic flowing every second. 
                      Manual management simply cannot keep pace.
                    </p>
                    <p>
                      Network automation transforms how operators manage their infrastructure. 
                      By automating routine tasks, detecting anomalies in real-time, and enabling 
                      self-healing capabilities, operators can focus on innovation rather than firefighting.
                    </p>
                    <p>
                      Our platform is built from the ground up for enterprise-scale automation, 
                      with a vendor-agnostic architecture that works across your entire network.
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-secondary border border-border">
                    <div className="text-4xl font-bold text-primary mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Reduction in manual tasks</div>
                  </div>
                  <div className="p-6 rounded-xl bg-secondary border border-border">
                    <div className="text-4xl font-bold text-primary mb-2">10x</div>
                    <div className="text-sm text-muted-foreground">Faster incident resolution</div>
                  </div>
                  <div className="p-6 rounded-xl bg-secondary border border-border">
                    <div className="text-4xl font-bold text-primary mb-2">99.99%</div>
                    <div className="text-sm text-muted-foreground">Network uptime achieved</div>
                  </div>
                  <div className="p-6 rounded-xl bg-secondary border border-border">
                    <div className="text-4xl font-bold text-primary mb-2">50%</div>
                    <div className="text-sm text-muted-foreground">OpEx cost reduction</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roadmap Section */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Future Roadmap
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We're continuously evolving our platform to meet the demands of next-generation networks.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                  
                  {/* Roadmap items */}
                  <div className="space-y-8">
                    {roadmapItems.map((item, index) => (
                      <div 
                        key={item.title}
                        className={cn(
                          "relative flex gap-6 opacity-0 animate-fade-in-up",
                        )}
                        style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                      >
                        {/* Icon */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <item.icon className="w-7 h-7 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {item.title}
                            </h3>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              item.status === "In Development" && "bg-green-500/10 text-green-600",
                              item.status === "Planned" && "bg-blue-500/10 text-blue-600",
                              item.status === "Research" && "bg-purple-500/10 text-purple-600"
                            )}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Join the Automation Revolution
                </h2>
                <p className="text-lg text-muted-foreground mb-10">
                  Be among the first to experience the future of telecom network automation.
                </p>
                <Button asChild variant="hero" size="xl">
                  <Link to="/platform">
                    Explore Platform
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
