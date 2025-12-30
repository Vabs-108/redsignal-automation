import { useState } from "react";
import { RouterCard } from "./RouterCard";
import { RouterLoginModal } from "./RouterLoginModal";
import { Workflow, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const vendors = [
  { id: "cisco", name: "Cisco Router", logo: "/cisco-logo.png" },
  { id: "nokia", name: "Nokia Router", logo: "/nokia-logo.png" },
];

export function RouterSelection() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginVendor, setLoginVendor] = useState("");

  const handleVendorSelect = (vendorId: string, vendorName: string) => {
    if (vendorId === "cisco") {
      setLoginVendor(vendorName);
      setLoginModalOpen(true);
    }
    setSelectedVendor(selectedVendor === vendorId ? null : vendorId);
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Select Your Router Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your network vendor to access tailored automation workflows and configurations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Router Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {vendors.map((vendor) => (
              <RouterCard
                key={vendor.id}
                vendor={vendor.name}
                logo={vendor.logo}
                isSelected={selectedVendor === vendor.id}
                onSelect={() => handleVendorSelect(vendor.id, vendor.name)}
              />
            ))}
          </div>

          {/* Workflow Display */}
          <div className={cn(
            "p-8 rounded-xl border-2 border-dashed transition-all duration-500",
            selectedVendor 
              ? "border-primary/30 bg-primary/5" 
              : "border-border bg-card"
          )}>
            {selectedVendor ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Workflow className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {vendors.find(v => v.id === selectedVendor)?.name} Automation
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Automation workflows will appear here. Configure provisioning, 
                  monitoring, and management tasks for your selected platform.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Connected
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
                    Syncing
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Platform Selected
                </h3>
                <p className="text-muted-foreground">
                  Select a router platform above to view available automation workflows.
                </p>
              </div>
            )}
          </div>

          {/* Future vendors hint */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            More vendors coming soon: Juniper, Huawei, Arista, and more.
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <RouterLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        vendor={loginVendor}
      />
    </section>
  );
}
