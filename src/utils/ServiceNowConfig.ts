import { serviceNowAPI } from "@/services/ServiceNowAPI";

export interface ServiceNowCredentials {
  baseUrl: string;
  bearerToken: string;
}

const STORAGE_KEY = 'servicenow-config';

export class ServiceNowConfig {
  // Get stored credentials
  static getCredentials(): ServiceNowCredentials | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const credentials = JSON.parse(stored) as ServiceNowCredentials;
        return credentials;
      }
    } catch (error) {
      console.error('Error reading ServiceNow credentials:', error);
    }
    return null;
  }

  // Save credentials
  static saveCredentials(baseUrl: string, bearerToken: string): void {
    try {
      const credentials: ServiceNowCredentials = { baseUrl, bearerToken };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
      
      // Update the API configuration
      serviceNowAPI.setConfig(baseUrl, bearerToken);
    } catch (error) {
      console.error('Error saving ServiceNow credentials:', error);
    }
  }

  // Clear credentials
  static clearCredentials(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      serviceNowAPI.setConfig(null, null);
    } catch (error) {
      console.error('Error clearing ServiceNow credentials:', error);
    }
  }

  // Initialize API with stored credentials
  static initializeAPI(): void {
    const credentials = this.getCredentials();
    if (credentials) {
      serviceNowAPI.setConfig(credentials.baseUrl, credentials.bearerToken);
    }
  }

  // Check if credentials are configured
  static isConfigured(): boolean {
    return serviceNowAPI.isConfigured();
  }

  // Get current configuration
  static getCurrentConfig() {
    return serviceNowAPI.getConfig();
  }
} 