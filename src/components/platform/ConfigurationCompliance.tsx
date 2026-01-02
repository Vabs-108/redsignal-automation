import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ComplianceChart } from "./ComplianceChart";
import { DeviationsList } from "./DeviationsList";
import { ConfigFileLoader } from "./ConfigFileLoader";
import { compareByIntent, ComparisonResult, formatSectionName } from "@/lib/configParser";
import { splitIntoBatches, type ProcessingResult } from "@/lib/configProcessor";

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
  const [baselineStats, setBaselineStats] = useState<ProcessingResult | null>(null);
  const [actualStats, setActualStats] = useState<ProcessingResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ConfigItem[] | null>(null);
  const [intentResult, setIntentResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [showRawConfig, setShowRawConfig] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const handleBaselineLoaded = (config: string, stats: ProcessingResult) => {
    setBaselineConfig(config);
    setBaselineStats(stats);
    setComparisonResult(null);
    setIntentResult(null);
  };

  const handleActualLoaded = (config: string, stats: ProcessingResult) => {
    setActualConfig(config);
    setActualStats(stats);
    setComparisonResult(null);
    setIntentResult(null);
  };

  // Intent-based comparison with batch processing for large configs
  const compareConfigs = async () => {
    if (!baselineConfig || !actualConfig) {
      toast({
        title: "Missing Configuration",
        description: "Please load both baseline and actual configurations",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);

    try {
      // For large configs, process in batches
      const baselineLines = baselineConfig.split("\n").length;
      const actualLines = actualConfig.split("\n").length;
      
      if (baselineLines > 1000 || actualLines > 1000) {
        const baselineBatches = splitIntoBatches(baselineConfig, 500);
        const actualBatches = splitIntoBatches(actualConfig, 500);
        
        setProcessingProgress({ current: 0, total: baselineBatches.length + actualBatches.length });

        // Process in chunks to avoid blocking UI
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setProcessingProgress({ 
          current: baselineBatches.length + actualBatches.length, 
          total: baselineBatches.length + actualBatches.length 
        });
      }

      // Perform the actual comparison
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
        title: "Comparison Complete",
        description: `Found ${totalDeviations} deviations, ${result.extra} extra configs`,
      });
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
      setProcessingProgress(null);
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

  const canCompare = baselineConfig.length > 0 && actualConfig.length > 0;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Configuration Compliance
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Load router configurations from files or use demo configs. 
            Compare against baseline standards with intelligent intent-based matching.
          </p>
        </div>

        <Tabs defaultValue="load" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="load">Load</TabsTrigger>
            <TabsTrigger value="compare" disabled={!canCompare}>
              Compare
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!comparisonResult}>
              Results
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!comparisonResult}>
              Charts
            </TabsTrigger>
          </TabsList>

          {/* Load Tab */}
          <TabsContent value="load" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConfigFileLoader
                label="Baseline Configuration"
                variant="baseline"
                onConfigLoaded={handleBaselineLoaded}
              />
              <ConfigFileLoader
                label="Actual Configuration"
                variant="actual"
                onConfigLoaded={handleActualLoaded}
              />
            </div>

            {/* Quick Stats */}
            {(baselineStats || actualStats) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Loaded Configurations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Baseline</p>
                      {baselineStats ? (
                        <div className="flex gap-2">
                          <Badge variant="outline">{baselineStats.lineCount} lines</Badge>
                          <Badge variant="outline">{baselineStats.sections.length} sections</Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">Not loaded</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Actual</p>
                      {actualStats ? (
                        <div className="flex gap-2">
                          <Badge variant="outline">{actualStats.lineCount} lines</Badge>
                          <Badge variant="outline">{actualStats.sections.length} sections</Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">Not loaded</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {canCompare && (
              <div className="flex justify-center">
                <Button size="lg" onClick={compareConfigs} disabled={isComparing} className="px-8">
                  {isComparing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {processingProgress 
                        ? `Processing ${processingProgress.current}/${processingProgress.total}...`
                        : "Comparing..."}
                    </>
                  ) : (
                    "Compare Configurations"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Compare Tab - View Raw Configs */}
          <TabsContent value="compare" className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRawConfig(!showRawConfig)}
              >
                {showRawConfig ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Raw
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Raw
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Baseline Configuration
                    {baselineStats && (
                      <Badge variant="secondary" className="ml-auto">
                        {baselineStats.lineCount} lines
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showRawConfig ? (
                    <Textarea
                      value={baselineConfig}
                      readOnly
                      className="font-mono text-xs h-80 resize-none"
                    />
                  ) : (
                    <div className="h-80 overflow-y-auto p-3 bg-muted/50 rounded-lg">
                      <pre className="font-mono text-xs whitespace-pre-wrap">
                        {baselineConfig.slice(0, 2000)}
                        {baselineConfig.length > 2000 && (
                          <span className="text-muted-foreground">
                            {"\n\n... and {baselineConfig.split('\\n').length - 50} more lines"}
                          </span>
                        )}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Actual Configuration
                    {actualStats && (
                      <Badge variant="secondary" className="ml-auto">
                        {actualStats.lineCount} lines
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showRawConfig ? (
                    <Textarea
                      value={actualConfig}
                      readOnly
                      className="font-mono text-xs h-80 resize-none"
                    />
                  ) : (
                    <div className="h-80 overflow-y-auto p-3 bg-muted/50 rounded-lg">
                      <pre className="font-mono text-xs whitespace-pre-wrap">
                        {actualConfig.slice(0, 2000)}
                        {actualConfig.length > 2000 && (
                          <span className="text-muted-foreground">
                            {"\n\n... and {actualConfig.split('\\n').length - 50} more lines"}
                          </span>
                        )}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={compareConfigs} disabled={isComparing} className="px-8">
                {isComparing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  "Run Comparison"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-500">
                      {stats.extra}
                    </div>
                    <p className="text-sm text-muted-foreground">Extra</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {comparisonResult && <DeviationsList items={comparisonResult} />}
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts">
            {stats && <ComplianceChart stats={stats} items={comparisonResult || []} />}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
