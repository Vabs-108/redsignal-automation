// Intent-based configuration parser and comparator

export interface ParsedCommand {
  section: string;
  intent: string;
  normalizedValue: string;
  originalLine: string;
  isVariable?: boolean;
  required?: boolean;
}

export interface ComplianceRule {
  pattern: RegExp;
  intent: string;
  normalize: (match: RegExpMatchArray) => string;
  allowVariables?: string[];
  required?: boolean;
}

// Define compliance rules for different command types
const complianceRules: ComplianceRule[] = [
  // Hostname - allow any value
  {
    pattern: /^hostname\s+(.+)$/i,
    intent: "hostname",
    normalize: () => "hostname:configured",
    allowVariables: ["hostname"],
  },
  // Interface IP configuration
  {
    pattern: /^ip\s+address\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)$/i,
    intent: "ip-address",
    normalize: (m) => `ip:${m[1]}/${m[2]}`,
    required: true,
  },
  // Duplex settings
  {
    pattern: /^duplex\s+(auto|full|half)$/i,
    intent: "duplex",
    normalize: (m) => `duplex:${m[1].toLowerCase()}`,
  },
  // Speed settings
  {
    pattern: /^speed\s+(auto|\d+)$/i,
    intent: "speed",
    normalize: (m) => `speed:${m[1].toLowerCase()}`,
  },
  // OSPF network statements
  {
    pattern: /^network\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+area\s+(\d+)$/i,
    intent: "ospf-network",
    normalize: (m) => `ospf-network:${m[1]}/${m[2]}/area${m[3]}`,
    required: true,
  },
  // Static routes
  {
    pattern: /^ip\s+route\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)$/i,
    intent: "static-route",
    normalize: (m) => `route:${m[1]}/${m[2]}->${m[3]}`,
    required: true,
  },
  // NTP server
  {
    pattern: /^ntp\s+server\s+(\d+\.\d+\.\d+\.\d+)$/i,
    intent: "ntp-server",
    normalize: (m) => `ntp:${m[1]}`,
    allowVariables: ["ntp-server"],
  },
  // Logging host
  {
    pattern: /^logging\s+host\s+(\d+\.\d+\.\d+\.\d+)$/i,
    intent: "logging-host",
    normalize: (m) => `logging-host:${m[1]}`,
    allowVariables: ["logging-host"],
  },
  // Logging trap level
  {
    pattern: /^logging\s+trap\s+(\w+)$/i,
    intent: "logging-level",
    normalize: (m) => `logging-level:${m[1].toLowerCase()}`,
    required: true,
  },
  // Router process
  {
    pattern: /^router\s+(ospf|eigrp|bgp)\s+(\d+)$/i,
    intent: "routing-process",
    normalize: (m) => `routing:${m[1].toLowerCase()}/${m[2]}`,
    required: true,
  },
  // Interface declaration
  {
    pattern: /^interface\s+(.+)$/i,
    intent: "interface",
    normalize: (m) => `interface:${m[1]}`,
    required: true,
  },
  // Description
  {
    pattern: /^description\s+(.+)$/i,
    intent: "description",
    normalize: () => "description:configured",
    allowVariables: ["description"],
  },
  // Shutdown
  {
    pattern: /^(no\s+)?shutdown$/i,
    intent: "shutdown-state",
    normalize: (m) => `shutdown:${m[1] ? "no" : "yes"}`,
    required: true,
  },
  // Access-list
  {
    pattern: /^(ip\s+)?access-list\s+(.+)$/i,
    intent: "access-list",
    normalize: (m) => `acl:${m[2]}`,
  },
  // Banner
  {
    pattern: /^banner\s+(\w+)\s+(.+)$/i,
    intent: "banner",
    normalize: (m) => `banner:${m[1]}`,
    allowVariables: ["banner-text"],
  },
];

// Commands that can vary between devices (expected variables)
const variableCommands = new Set([
  "hostname",
  "description",
  "banner-text",
]);

// Parse a single line using rules
function parseLine(line: string, currentSection: string): ParsedCommand | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed === "!") return null;

  for (const rule of complianceRules) {
    const match = trimmed.match(rule.pattern);
    if (match) {
      return {
        section: currentSection,
        intent: rule.intent,
        normalizedValue: rule.normalize(match),
        originalLine: trimmed,
        isVariable: rule.allowVariables && rule.allowVariables.length > 0,
        required: rule.required,
      };
    }
  }

  // Fallback for unrecognized commands
  return {
    section: currentSection,
    intent: "generic",
    normalizedValue: `generic:${trimmed.toLowerCase().replace(/\s+/g, "-")}`,
    originalLine: trimmed,
  };
}

// Parse entire configuration into structured commands
export function parseConfiguration(config: string): Map<string, ParsedCommand[]> {
  const lines = config.split("\n");
  const sections = new Map<string, ParsedCommand[]>();
  let currentSection = "global";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "!") continue;

    // Check if this is a section header (not indented)
    if (!line.startsWith(" ") && !line.startsWith("\t")) {
      // Check for interface or router declarations
      const interfaceMatch = trimmed.match(/^interface\s+(.+)$/i);
      const routerMatch = trimmed.match(/^router\s+(\w+)\s+(\d+)$/i);

      if (interfaceMatch) {
        currentSection = `interface:${interfaceMatch[1]}`;
      } else if (routerMatch) {
        currentSection = `router:${routerMatch[1]}:${routerMatch[2]}`;
      } else {
        currentSection = "global";
      }
    }

    const parsed = parseLine(trimmed, currentSection);
    if (parsed) {
      if (!sections.has(currentSection)) {
        sections.set(currentSection, []);
      }
      sections.get(currentSection)!.push(parsed);
    }
  }

  return sections;
}

export interface DeviationResult {
  section: string;
  intent: string;
  description: string;
  expected: string;
  actual: string;
  severity: "critical" | "warning" | "info";
  isVariable: boolean;
}

export interface ComparisonResult {
  compliant: number;
  deviated: number;
  missing: number;
  extra: number;
  deviations: DeviationResult[];
  sectionStats: Map<string, { compliant: number; deviated: number; missing: number }>;
}

// Compare configurations by intent
export function compareByIntent(
  baseline: string,
  actual: string,
  allowedVariables: Set<string> = new Set(["hostname", "description", "ntp-server", "logging-host"])
): ComparisonResult {
  const baselineSections = parseConfiguration(baseline);
  const actualSections = parseConfiguration(actual);
  
  const deviations: DeviationResult[] = [];
  const sectionStats = new Map<string, { compliant: number; deviated: number; missing: number }>();
  
  let compliant = 0;
  let deviated = 0;
  let missing = 0;
  let extra = 0;

  // Helper to update section stats
  const updateSectionStats = (section: string, status: "compliant" | "deviated" | "missing") => {
    if (!sectionStats.has(section)) {
      sectionStats.set(section, { compliant: 0, deviated: 0, missing: 0 });
    }
    const stats = sectionStats.get(section)!;
    stats[status]++;
  };

  // Check each baseline section
  for (const [section, baselineCommands] of baselineSections) {
    const actualCommands = actualSections.get(section) || [];
    
    // Create intent maps for comparison (ignores order)
    const actualIntentMap = new Map<string, ParsedCommand>();
    for (const cmd of actualCommands) {
      // Use intent + normalized value as key for matching
      const key = `${cmd.intent}:${cmd.normalizedValue.split(":")[0]}`;
      actualIntentMap.set(key, cmd);
    }

    for (const baselineCmd of baselineCommands) {
      const intentKey = `${baselineCmd.intent}:${baselineCmd.normalizedValue.split(":")[0]}`;
      const actualCmd = actualIntentMap.get(intentKey);

      // Skip variable commands if allowed
      if (baselineCmd.isVariable && allowedVariables.has(baselineCmd.intent)) {
        if (actualCmd) {
          compliant++;
          updateSectionStats(section, "compliant");
        } else {
          missing++;
          updateSectionStats(section, "missing");
          deviations.push({
            section,
            intent: baselineCmd.intent,
            description: `Missing ${baselineCmd.intent} configuration`,
            expected: baselineCmd.originalLine,
            actual: "NOT CONFIGURED",
            severity: baselineCmd.required ? "critical" : "warning",
            isVariable: true,
          });
        }
        continue;
      }

      if (!actualCmd) {
        missing++;
        updateSectionStats(section, "missing");
        deviations.push({
          section,
          intent: baselineCmd.intent,
          description: `Missing required configuration`,
          expected: baselineCmd.originalLine,
          actual: "NOT CONFIGURED",
          severity: baselineCmd.required ? "critical" : "warning",
          isVariable: false,
        });
      } else if (actualCmd.normalizedValue !== baselineCmd.normalizedValue) {
        deviated++;
        updateSectionStats(section, "deviated");
        deviations.push({
          section,
          intent: baselineCmd.intent,
          description: `Configuration mismatch for ${baselineCmd.intent}`,
          expected: baselineCmd.originalLine,
          actual: actualCmd.originalLine,
          severity: baselineCmd.required ? "critical" : "warning",
          isVariable: false,
        });
      } else {
        compliant++;
        updateSectionStats(section, "compliant");
      }
    }
  }

  // Check for extra commands not in baseline
  for (const [section, actualCommands] of actualSections) {
    const baselineCommands = baselineSections.get(section) || [];
    const baselineIntentMap = new Map<string, ParsedCommand>();
    
    for (const cmd of baselineCommands) {
      const key = `${cmd.intent}:${cmd.normalizedValue.split(":")[0]}`;
      baselineIntentMap.set(key, cmd);
    }

    for (const actualCmd of actualCommands) {
      const intentKey = `${actualCmd.intent}:${actualCmd.normalizedValue.split(":")[0]}`;
      if (!baselineIntentMap.has(intentKey)) {
        // Check if this is a meaningful extra (not just ordering)
        if (actualCmd.intent !== "generic") {
          extra++;
          deviations.push({
            section,
            intent: actualCmd.intent,
            description: `Extra configuration not in baseline`,
            expected: "NOT IN BASELINE",
            actual: actualCmd.originalLine,
            severity: "info",
            isVariable: false,
          });
        }
      }
    }
  }

  return {
    compliant,
    deviated,
    missing,
    extra,
    deviations,
    sectionStats,
  };
}

// Get human-readable section name
export function formatSectionName(section: string): string {
  if (section === "global") return "Global";
  if (section.startsWith("interface:")) return section.replace("interface:", "");
  if (section.startsWith("router:")) {
    const parts = section.split(":");
    return `${parts[1].toUpperCase()} ${parts[2]}`;
  }
  return section;
}

// Get severity color class
export function getSeverityClass(severity: "critical" | "warning" | "info"): string {
  switch (severity) {
    case "critical":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    case "info":
      return "text-blue-500";
  }
}
