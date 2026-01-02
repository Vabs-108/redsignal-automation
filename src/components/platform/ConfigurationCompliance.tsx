import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComplianceChart } from "./ComplianceChart";
import { DeviationsList } from "./DeviationsList";
import { compareByIntent, ComparisonResult, formatSectionName } from "@/lib/configParser";
import { processConfiguration, getConfigStats } from "@/lib/configProcessor";

interface ConfigItem {
  key: string;
  baselineValue: string;
  actualValue: string;
  status: "compliant" | "deviated" | "missing";
}

export function ConfigurationCompliance() {
  const { toast } = useToast();
  const [baselineConfig, setBaselineConfig] = useState("");
  const [actualConfig, setActualConfig] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [configStats, setConfigStats] = useState<{
    baseline: { lines: number; commands: number; interfaces: number };
    actual: { lines: number; commands: number; interfaces: number };
  } | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ConfigItem[] | null>(null);
  const [intentResult, setIntentResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Auto-load demo configs from files on mount
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const [baselineRes, actualRes] = await Promise.all([
          fetch("/configs/baseline-demo.txt"),
          fetch("/configs/actual-demo.txt"),
        ]);

        const [baselineRaw, actualRaw] = await Promise.all([
          baselineRes.text(),
          actualRes.text(),
        ]);

        // Process and clean the configs
        const baselineProcessed = processConfiguration(baselineRaw);
        const actualProcessed = processConfiguration(actualRaw);

        const baselineStats = getConfigStats(baselineProcessed.cleanedConfig);
        const actualStats = getConfigStats(actualProcessed.cleanedConfig);

        setBaselineConfig(baselineProcessed.cleanedConfig);
        setActualConfig(actualProcessed.cleanedConfig);
        setConfigStats({
          baseline: {
            lines: baselineProcessed.lineCount,
            commands: baselineStats.commandLines,
            interfaces: baselineStats.interfaces,
          },
          actual: {
            lines: actualProcessed.lineCount,
            commands: actualStats.commandLines,
            interfaces: actualStats.interfaces,
          },
        });

        toast({
          title: "Configurations Loaded",
          description: `Baseline: ${baselineStats.commandLines} commands, Actual: ${actualStats.commandLines} commands`,
        });
      } catch (error) {
        toast({
          title: "Failed to Load Configurations",
          description: "Could not load demo configuration files",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfigs();
  }, [toast]);

  // Intent-based comparison
  const compareConfigs = async () => {
    if (!baselineConfig || !actualConfig) return;

    setIsComparing(true);

    try {
      const result = compareByIntent(baselineConfig, actualConfig);

      // Convert to ConfigItem format
      const configItems: ConfigItem[] = result.deviations.map((dev) => ({
        key: `${formatSectionName(dev.section)}::${dev.intent}`,
        baselineValue: dev.expected,
        actualValue: dev.actual,
        status: dev.actual === "NOT CONFIGURED" ? "missing" : "deviated",
      }));

      // Add compliant items for stats
      for (let i = 0; i < result.compliant; i++) {
        configItems.push({
          key: `compliant-${i}`,
          baselineValue: "configured",
          actualValue: "configured",
          status: "compliant",
        });
      }

      setComparisonResult(configItems);
      setIntentResult(result);

      toast({
        title: "Comparison Complete",
        description: `${result.deviated + result.missing} deviations, ${result.extra} extra configs`,
      });
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: "Error during configuration comparison",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
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

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading configurations...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Configuration Compliance
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Compare router configurations against baseline standards with 
            intelligent intent-based matching. Detects meaningful deviations only.
          </p>
        </div>

        {/* Config Stats */}
        {configStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Baseline Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Badge variant="outline">{configStats.baseline.lines} lines</Badge>
                  <Badge variant="outline">{configStats.baseline.commands} commands</Badge>
                  <Badge variant="outline">{configStats.baseline.interfaces} interfaces</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Actual Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Badge variant="outline">{configStats.actual.lines} lines</Badge>
                  <Badge variant="outline">{configStats.actual.commands} commands</Badge>
                  <Badge variant="outline">{configStats.actual.interfaces} interfaces</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compare Button */}
        {!comparisonResult && (
          <div className="flex justify-center mb-8">
            <Button size="lg" onClick={compareConfigs} disabled={isComparing} className="px-8">
              {isComparing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Comparing...
                </>
              ) : (
                "Compare Configurations"
              )}
            </Button>
          </div>
        )}

        {/* Results */}
        {comparisonResult && (
          <Tabs defaultValue="results" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-500">{stats.compliant}</div>
                      <p className="text-sm text-muted-foreground">Compliant</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-amber-500">{stats.deviated}</div>
                      <p className="text-sm text-muted-foreground">Deviated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-500">{stats.missing}</div>
                      <p className="text-sm text-muted-foreground">Missing</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-500">{stats.extra}</div>
                      <p className="text-sm text-muted-foreground">Extra</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              <DeviationsList items={comparisonResult} />
            </TabsContent>

            <TabsContent value="charts">
              {stats && <ComplianceChart stats={stats} items={comparisonResult} />}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
}
