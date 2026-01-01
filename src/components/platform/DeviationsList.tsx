import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface ConfigItem {
  key: string;
  baselineValue: string;
  actualValue: string;
  status: "compliant" | "deviated" | "missing";
}

interface DeviationsListProps {
  items: ConfigItem[];
}

export function DeviationsList({ items }: DeviationsListProps) {
  const deviations = items.filter((item) => item.status !== "compliant");

  const getStatusIcon = (status: ConfigItem["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deviated":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "missing":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ConfigItem["status"]) => {
    switch (status) {
      case "compliant":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Compliant</Badge>;
      case "deviated":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Value Mismatch</Badge>;
      case "missing":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Missing</Badge>;
    }
  };

  const formatKey = (key: string) => {
    const parts = key.split("::");
    if (parts.length > 1) {
      return (
        <div>
          <span className="text-xs font-medium text-primary">{parts[0]}</span>
          <br />
          <span className="font-mono text-muted-foreground">{parts[1]}</span>
        </div>
      );
    }
    return <span className="font-mono">{key}</span>;
  };

  // Group deviations by section for better organization
  const groupedDeviations = deviations.reduce((acc, item) => {
    const section = item.key.split("::")[0] || "Global";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, ConfigItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Meaningful Deviations ({deviations.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Intent-based comparison: grouped by section, normalized values, order-independent
        </p>
      </CardHeader>
      <CardContent>
        {deviations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="font-medium">All configurations are compliant!</p>
            <p className="text-sm mt-1">No meaningful deviations detected</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDeviations).map(([section, sectionItems]) => (
              <div key={section} className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground border-b pb-2">
                  <Info className="h-4 w-4 text-primary" />
                  {section}
                  <Badge variant="secondary" className="ml-auto">{sectionItems.length}</Badge>
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Status</TableHead>
                        <TableHead>Intent</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Actual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sectionItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getStatusIcon(item.status)}</TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {item.key.split("::")[1] || item.key}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded block max-w-xs truncate">
                              {item.baselineValue}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded block max-w-xs truncate">
                              {item.actualValue}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
