import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { 
  loadConfigFromFile, 
  loadConfigFromUrl, 
  processConfiguration,
  getConfigStats,
  validateConfig,
  type ProcessingResult 
} from "@/lib/configProcessor";
import { useToast } from "@/hooks/use-toast";

interface ConfigFileLoaderProps {
  label: string;
  onConfigLoaded: (config: string, stats: ProcessingResult) => void;
  variant?: "baseline" | "actual";
}

const demoConfigs = {
  baseline: "/configs/baseline-demo.txt",
  actual: "/configs/actual-demo.txt",
};

export function ConfigFileLoader({ 
  label, 
  onConfigLoaded, 
  variant = "baseline" 
}: ConfigFileLoaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFile, setLoadedFile] = useState<{
    name: string;
    stats: ReturnType<typeof getConfigStats>;
    processingResult: ProcessingResult;
    validation: ReturnType<typeof validateConfig>;
  } | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const rawConfig = await loadConfigFromFile(file);
      const processingResult = processConfiguration(rawConfig);
      const stats = getConfigStats(processingResult.cleanedConfig);
      const validation = validateConfig(processingResult.cleanedConfig);

      setLoadedFile({
        name: file.name,
        stats,
        processingResult,
        validation,
      });

      onConfigLoaded(processingResult.cleanedConfig, processingResult);

      toast({
        title: "Configuration Loaded",
        description: `${file.name} - ${stats.commandLines} commands processed`,
      });
    } catch (error) {
      toast({
        title: "Failed to Load File",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const loadDemoConfig = async () => {
    setIsLoading(true);
    try {
      const url = demoConfigs[variant];
      const rawConfig = await loadConfigFromUrl(url);
      const processingResult = processConfiguration(rawConfig);
      const stats = getConfigStats(processingResult.cleanedConfig);
      const validation = validateConfig(processingResult.cleanedConfig);

      setLoadedFile({
        name: `Demo ${variant} config`,
        stats,
        processingResult,
        validation,
      });

      onConfigLoaded(processingResult.cleanedConfig, processingResult);

      toast({
        title: "Demo Configuration Loaded",
        description: `${stats.commandLines} commands from demo ${variant} config`,
      });
    } catch (error) {
      toast({
        title: "Failed to Load Demo",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConfig = () => {
    setLoadedFile(null);
    onConfigLoaded("", {
      cleanedConfig: "",
      lineCount: 0,
      sections: [],
      processingTime: 0,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className={`h-5 w-5 ${variant === "baseline" ? "text-primary" : "text-amber-500"}`} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Actions */}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.cfg,.conf,.config"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-1" />
            )}
            Upload File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDemoConfig}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-1" />
            Load Demo
          </Button>
          {loadedFile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConfig}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Loaded File Info */}
        {loadedFile && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {loadedFile.validation.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="font-medium text-sm">{loadedFile.name}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines:</span>
                <span className="font-mono">{loadedFile.processingResult.lineCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commands:</span>
                <span className="font-mono">{loadedFile.stats.commandLines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interfaces:</span>
                <span className="font-mono">{loadedFile.stats.interfaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ACLs:</span>
                <span className="font-mono">{loadedFile.stats.accessLists}</span>
              </div>
            </div>

            {/* Routing Protocols */}
            {loadedFile.stats.routingProtocols.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {loadedFile.stats.routingProtocols.map((proto) => (
                  <Badge key={proto} variant="secondary" className="text-xs">
                    {proto}
                  </Badge>
                ))}
              </div>
            )}

            {/* Sections */}
            {loadedFile.processingResult.sections.length > 0 && (
              <div className="max-h-24 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1">Sections:</p>
                <div className="flex flex-wrap gap-1">
                  {loadedFile.processingResult.sections.slice(0, 6).map((section, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-mono">
                      {section}
                    </Badge>
                  ))}
                  {loadedFile.processingResult.sections.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{loadedFile.processingResult.sections.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Warnings */}
            {loadedFile.validation.warnings.length > 0 && (
              <div className="text-xs text-amber-600">
                {loadedFile.validation.warnings.map((w, i) => (
                  <div key={i}>⚠ {w}</div>
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Processed in {loadedFile.processingResult.processingTime.toFixed(2)}ms
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadedFile && !isLoading && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Upload a .txt or .cfg file</p>
              <p className="text-xs">or load a demo configuration</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
