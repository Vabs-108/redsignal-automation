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
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Deviated</Badge>;
      case "missing":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Missing</Badge>;
    }
  };

  const formatKey = (key: string) => {
    const parts = key.split("::");
    if (parts.length > 1) {
      return (
        <div>
          <span className="text-muted-foreground text-xs">{parts[0]}</span>
          <br />
          <span className="font-mono">{parts[1]}</span>
        </div>
      );
    }
    return <span className="font-mono">{key}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Configuration Deviations ({deviations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deviations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>All configurations are compliant!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Configuration Item</TableHead>
                  <TableHead>Expected Value</TableHead>
                  <TableHead>Actual Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviations.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{getStatusIcon(item.status)}</TableCell>
                    <TableCell>{formatKey(item.key)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                        {item.baselineValue}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded">
                        {item.actualValue}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
