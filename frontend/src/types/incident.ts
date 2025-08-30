export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum Category {
  HARDWARE = "HARDWARE",
  SOFTWARE = "SOFTWARE",
  NETWORK = "NETWORK",
  SECURITY = "SECURITY",
  DATABASE = "DATABASE",
  APPLICATION = "APPLICATION",
  USER_ACCESS = "USER_ACCESS",
  PERFORMANCE = "PERFORMANCE",
}

export interface IncidentRequest {
  title: string;
  description: string;
  affectedService: string;
}

export interface IncidentResponse {
  id: number;
  title: string;
  description: string;
  affectedService: string;
  aiSeverity: Severity;
  aiCategory: Category;
  aiSuggestedAction: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
