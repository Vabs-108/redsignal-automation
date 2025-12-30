import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AutomationCard } from "@/components/platform/AutomationCard";
import { RouterSelection } from "@/components/platform/RouterSelection";
import { ConfigurationCompliance } from "@/components/platform/ConfigurationCompliance";
import { Settings, Monitor, AlertTriangle, RefreshCw, Database, Lock } from "lucide-react";

const automationFeatures = [
  {
    icon: Settings,
    title: "Automated Network Provisioning",
    description: "Zero-touch deployment and configuration of network devices with intelligent templates.",
    features: [
      "Template-based provisioning",
      "Bulk device onboarding",
      "Validation & compliance checks",
      "Rollback capabilities",
    ],
  },
  {
    icon: Database,
    title: "Configuration Management",
    description: "Centralized version control and management of all network configurations.",
    features: [
      "Git-based version control",
      "Configuration drift detection",
      "Scheduled backups",
      "Change tracking & audit logs",
    ],
  },
  {
    icon: Monitor,
    title: "Monitoring & Telemetry",
    description: "Real-time visibility into network health, performance, and traffic patterns.",
    features: [
      "Real-time metrics collection",
      "Customizable dashboards",
      "Threshold-based alerting",
      "Historical trend analysis",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Fault Detection & Self-Healing",
    description: "Intelligent anomaly detection with automated remediation workflows.",
    features: [
      "AI-powered anomaly detection",
      "Automated incident response",
      "Self-healing playbooks",
      "Root cause analysis",
    ],
  },
  {
    icon: RefreshCw,
    title: "Workflow Orchestration",
    description: "Design and execute complex multi-step automation workflows.",
    features: [
      "Visual workflow designer",
      "Conditional logic support",
      "Integration with external systems",
      "Scheduled execution",
    ],
  },
  {
    icon: Lock,
    title: "Security & Compliance",
    description: "Ensure network security and regulatory compliance at scale.",
    features: [
      "Security policy enforcement",
      "Compliance reporting",
      "Access control management",
      "Vulnerability scanning",
    ],
  },
];

const Platform = () => {
  return (
    <>
      <Helmet>
        <title>Automation Platform | NetAuto</title>
        <meta 
          name="description" 
          content="Explore the NetAuto automation platform. Automated provisioning, configuration management, monitoring, and self-healing for telecom networks." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-20 bg-gradient-subtle relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  Automation Platform
                </h1>
                <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  A comprehensive suite of tools for automating your entire network lifecycle. 
                  From provisioning to monitoring to self-healing.
                </p>
              </div>
            </div>
          </section>

          {/* Automation Cards */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automationFeatures.map((feature, index) => (
                  <AutomationCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    features={feature.features}
                    delay={0.1 + index * 0.1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Router Selection */}
          <RouterSelection />

          {/* Configuration Compliance */}
          <ConfigurationCompliance />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Platform;
