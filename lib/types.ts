// Form submission data
export interface AccessLogEntry {
  unitNumber: number;
  firstName: string;
}

// Entry with timestamp for Google Sheets
export interface TimestampedEntry extends AccessLogEntry {
  timestamp: string;
}

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
  warnings?: string[];
}

// Form validation errors
export interface FormErrors {
  unitNumber?: string;
  firstName?: string;
}
