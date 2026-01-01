import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Upload, Save, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ComplianceChart } from "./ComplianceChart";
import { DeviationsList } from "./DeviationsList";
import { compareByIntent, ComparisonResult, formatSectionName } from "@/lib/configParser";

interface ConfigItem {
  key: string;
  baselineValue: string;
  actualValue: string;
  status: "compliant" | "deviated" | "missing";
}

// Demo baseline configurations
const demoBaselineConfig = `hostname CORE-RTR-01
!
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 duplex auto
 speed auto
!
interface GigabitEthernet0/1
 ip address 10.0.0.1 255.255.255.252
 duplex full
 speed 1000
!
router ospf 1
 network 192.168.1.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
!
ip route 0.0.0.0 0.0.0.0 10.0.0.2
!
ntp server 10.10.10.10
!
logging host 10.10.10.20
logging trap informational`;

const demoActualConfig = `hostname CORE-RTR-01
!
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 duplex auto
 speed auto
!
interface GigabitEthernet0/1
 ip address 10.0.0.5 255.255.255.252
 duplex auto
 speed auto
!
router ospf 1
 network 192.168.1.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
!
ip route 0.0.0.0 0.0.0.0 10.0.0.2
!
ntp server 10.10.10.15
!
logging trap debugging`;

export function ConfigurationCompliance() {
  const { toast } = useToast();
  const [baselineConfig, setBaselineConfig] = useState(demoBaselineConfig);
  const [actualConfig, setActualConfig] = useState(demoActualConfig);
  const [comparisonResult, setComparisonResult] = useState<ConfigItem[] | null>(null);
  const [intentResult, setIntentResult] = useState<ComparisonResult | null>(null);

  // Intent-based comparison that groups, normalizes, and ignores order
  const compareConfigs = () => {
    const result = compareByIntent(baselineConfig, actualConfig);
    
    // Convert to ConfigItem format for existing components
    const configItems: ConfigItem[] = result.deviations.map((dev) => ({
      key: `${formatSectionName(dev.section)}::${dev.intent}`,
      baselineValue: dev.expected,
      actualValue: dev.actual,
      status: dev.actual === "NOT CONFIGURED" ? "missing" : "deviated",
    }));

    // Add compliant items for stats
    const compliantCount = result.compliant;
    for (let i = 0; i < compliantCount; i++) {
      configItems.push({
        key: `compliant-${i}`,
        baselineValue: "configured",
        actualValue: "configured",
        status: "compliant",
      });
    }

    setComparisonResult(configItems);
    setIntentResult(result);
    
    const totalDeviations = result.deviated + result.missing;
    toast({
      title: "Intent-Based Comparison Complete",
      description: `Found ${totalDeviations} meaningful deviations (${result.extra} extra configs)`,
    });
  };

  const saveBaseline = () => {
    localStorage.setItem("router_baseline_config", baselineConfig);
    toast({
      title: "Baseline Saved",
      description: "Configuration baseline has been saved locally",
    });
  };

  const loadBaseline = () => {
    const saved = localStorage.getItem("router_baseline_config");
    if (saved) {
      setBaselineConfig(saved);
      toast({
        title: "Baseline Loaded",
        description: "Configuration baseline has been loaded",
      });
    } else {
      toast({
        title: "No Saved Baseline",
        description: "No saved baseline found, using demo configuration",
        variant: "destructive",
      });
    }
  };

  const stats = intentResult
    ? {
        total: intentResult.compliant + intentResult.deviated + intentResult.missing,
        compliant: intentResult.compliant,
        deviated: intentResult.deviated,
        missing: intentResult.missing,
        extra: intentResult.extra,
      }
    : null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Configuration Compliance
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Compare router configurations against baseline standards and
            visualize deviations. Save expected configurations and detect drift.
          </p>
        </div>

        <Tabs defaultValue="compare" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="results" disabled={!comparisonResult}>
              Results
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!comparisonResult}>
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Baseline Config */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Baseline Configuration
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadBaseline}>
                      <Upload className="h-4 w-4 mr-1" />
                      Load
                    </Button>
                    <Button variant="outline" size="sm" onClick={saveBaseline}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={baselineConfig}
                    onChange={(e) => setBaselineConfig(e.target.value)}
                    className="font-mono text-sm h-80 resize-none"
                    placeholder="Paste expected/baseline configuration here..."
                  />
                </CardContent>
              </Card>

              {/* Actual Config */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Actual Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={actualConfig}
                    onChange={(e) => setActualConfig(e.target.value)}
                    className="font-mono text-sm h-80 resize-none"
                    placeholder="Paste actual router configuration here..."
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={compareConfigs} className="px-8">
                Compare Configurations
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-500">
                      {stats.compliant}
                    </div>
                    <p className="text-sm text-muted-foreground">Compliant</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-amber-500">
                      {stats.deviated}
                    </div>
                    <p className="text-sm text-muted-foreground">Deviated</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-500">
                      {stats.missing}
                    </div>
                    <p className="text-sm text-muted-foreground">Missing</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {comparisonResult && <DeviationsList items={comparisonResult} />}
          </TabsContent>

          <TabsContent value="charts">
            {stats && <ComplianceChart stats={stats} items={comparisonResult || []} />}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
