// Configuration file processor for handling large configs
// Handles loading, cleaning, batching, and preparing configs for comparison

export interface ProcessingResult {
  cleanedConfig: string;
  lineCount: number;
  sections: string[];
  processingTime: number;
}

export interface BatchInfo {
  batchIndex: number;
  totalBatches: number;
  startLine: number;
  endLine: number;
  content: string;
}

// Clean configuration by removing comments, empty lines, and normalizing whitespace
export function cleanConfiguration(config: string): string {
  const lines = config.split("\n");
  const cleanedLines: string[] = [];

  for (const line of lines) {
    // Remove inline comments (after !) but keep section separators
    let cleanLine = line;
    
    // Skip pure comment lines starting with !
    if (line.trim().startsWith("!")) {
      // Keep section separator lines for context
      if (line.includes("---") || line.includes("===") || line.includes("Interface") || line.includes("Configuration")) {
        continue; // Skip decorative comments
      }
      continue;
    }

    // Remove trailing whitespace
    cleanLine = cleanLine.trimEnd();

    // Skip empty lines
    if (!cleanLine) continue;

    cleanedLines.push(cleanLine);
  }

  return cleanedLines.join("\n");
}

// Split configuration into batches for processing
export function splitIntoBatches(config: string, batchSize: number = 500): BatchInfo[] {
  const lines = config.split("\n");
  const batches: BatchInfo[] = [];
  const totalBatches = Math.ceil(lines.length / batchSize);

  for (let i = 0; i < lines.length; i += batchSize) {
    const batchLines = lines.slice(i, Math.min(i + batchSize, lines.length));
    batches.push({
      batchIndex: Math.floor(i / batchSize),
      totalBatches,
      startLine: i + 1,
      endLine: Math.min(i + batchSize, lines.length),
      content: batchLines.join("\n"),
    });
  }

  return batches;
}

// Process configuration file
export function processConfiguration(rawConfig: string): ProcessingResult {
  const startTime = performance.now();
  
  const cleanedConfig = cleanConfiguration(rawConfig);
  const lines = cleanedConfig.split("\n");
  
  // Extract section names
  const sections: string[] = [];
  for (const line of lines) {
    const interfaceMatch = line.match(/^interface\s+(.+)$/i);
    const routerMatch = line.match(/^router\s+(\w+)\s+(\d+)$/i);
    
    if (interfaceMatch) {
      sections.push(`Interface: ${interfaceMatch[1]}`);
    } else if (routerMatch) {
      sections.push(`Router: ${routerMatch[1].toUpperCase()} ${routerMatch[2]}`);
    }
  }

  const processingTime = performance.now() - startTime;

  return {
    cleanedConfig,
    lineCount: lines.length,
    sections,
    processingTime,
  };
}

// Load configuration from a file URL
export async function loadConfigFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load config: ${response.statusText}`);
  }
  return response.text();
}

// Load configuration from an uploaded file
export function loadConfigFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// Get statistics about the configuration
export function getConfigStats(config: string): {
  totalLines: number;
  commandLines: number;
  interfaces: number;
  routingProtocols: string[];
  accessLists: number;
} {
  const lines = config.split("\n");
  let commandLines = 0;
  let interfaces = 0;
  const routingProtocols: Set<string> = new Set();
  let accessLists = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("!")) continue;
    
    commandLines++;

    if (/^interface\s+/i.test(trimmed)) {
      interfaces++;
    }
    
    const routerMatch = trimmed.match(/^router\s+(\w+)/i);
    if (routerMatch) {
      routingProtocols.add(routerMatch[1].toUpperCase());
    }

    if (/^(ip\s+)?access-list/i.test(trimmed)) {
      accessLists++;
    }
  }

  return {
    totalLines: lines.length,
    commandLines,
    interfaces,
    routingProtocols: Array.from(routingProtocols),
    accessLists,
  };
}

// Validate configuration format
export function validateConfig(config: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config || config.trim().length === 0) {
    errors.push("Configuration is empty");
    return { isValid: false, errors, warnings };
  }

  const lines = config.split("\n");
  
  // Check for minimum content
  if (lines.length < 5) {
    warnings.push("Configuration seems very short");
  }

  // Check for common configuration elements
  const hasHostname = lines.some(l => /^hostname\s+/i.test(l.trim()));
  const hasInterface = lines.some(l => /^interface\s+/i.test(l.trim()));
  
  if (!hasHostname) {
    warnings.push("No hostname configured");
  }

  if (!hasInterface) {
    warnings.push("No interfaces found in configuration");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
