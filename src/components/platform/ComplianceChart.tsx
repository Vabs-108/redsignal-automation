import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ConfigItem {
  key: string;
  baselineValue: string;
  actualValue: string;
  status: "compliant" | "deviated" | "missing";
}

interface ComplianceChartProps {
  stats: {
    total: number;
    compliant: number;
    deviated: number;
    missing: number;
  };
  items: ConfigItem[];
}

const COLORS = {
  compliant: "#22c55e",
  deviated: "#f59e0b",
  missing: "#ef4444",
};

const chartConfig = {
  compliant: {
    label: "Compliant",
    color: COLORS.compliant,
  },
  deviated: {
    label: "Deviated",
    color: COLORS.deviated,
  },
  missing: {
    label: "Missing",
    color: COLORS.missing,
  },
};

export function ComplianceChart({ stats, items }: ComplianceChartProps) {
  const pieData = [
    { name: "Compliant", value: stats.compliant, fill: COLORS.compliant },
    { name: "Deviated", value: stats.deviated, fill: COLORS.deviated },
    { name: "Missing", value: stats.missing, fill: COLORS.missing },
  ].filter((d) => d.value > 0);

  // Group deviations by section
  const sectionStats = items.reduce((acc, item) => {
    const section = item.key.split("::")[0] || "General";
    if (!acc[section]) {
      acc[section] = { compliant: 0, deviated: 0, missing: 0 };
    }
    acc[section][item.status]++;
    return acc;
  }, {} as Record<string, { compliant: number; deviated: number; missing: number }>);

  const barData = Object.entries(sectionStats)
    .map(([section, data]) => ({
      section: section.length > 20 ? section.substring(0, 20) + "..." : section,
      fullSection: section,
      ...data,
    }))
    .slice(0, 10); // Limit to 10 sections for readability

  const compliancePercentage = stats.total > 0 
    ? Math.round((stats.compliant / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compliance Overview Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-bold">{compliancePercentage}%</div>
                <div className="text-sm text-muted-foreground">Compliant</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deviations by Section Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Deviations by Section</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="section" 
                type="category" 
                width={120}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="compliant" name="Compliant" fill={COLORS.compliant} stackId="a" />
              <Bar dataKey="deviated" name="Deviated" fill={COLORS.deviated} stackId="a" />
              <Bar dataKey="missing" name="Missing" fill={COLORS.missing} stackId="a" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Compliance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Config Items</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {stats.compliant}
              </div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="text-4xl font-bold text-amber-500 mb-2">
                {stats.deviated}
              </div>
              <div className="text-sm text-muted-foreground">Deviated</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-4xl font-bold text-red-500 mb-2">
                {stats.missing}
              </div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
