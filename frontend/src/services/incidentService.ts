import axios from "axios";
import { IncidentRequest, IncidentResponse } from "../types/incident";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service following Single Responsibility Principle
export class IncidentApiService {
  // Create a new incident
  static async createIncident(
    incident: IncidentRequest
  ): Promise<IncidentResponse> {
    try {
      const response = await apiClient.post<IncidentResponse>(
        "/incidents",
        incident
      );
      return response.data;
    } catch (error) {
      console.error("Error creating incident:", error);
      throw new Error("Failed to create incident");
    }
  }

  // Get all incidents
  static async getAllIncidents(): Promise<IncidentResponse[]> {
    try {
      const response = await apiClient.get<IncidentResponse[]>("/incidents");
      return response.data;
    } catch (error) {
      console.error("Error fetching incidents:", error);
      throw new Error("Failed to fetch incidents");
    }
  }

  // Get incident by ID
  static async getIncidentById(id: number): Promise<IncidentResponse> {
    try {
      const response = await apiClient.get<IncidentResponse>(
        `/incidents/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching incident:", error);
      throw new Error("Failed to fetch incident");
    }
  }

  // Get incidents by severity
  static async getIncidentsBySeverity(
    severity: string
  ): Promise<IncidentResponse[]> {
    try {
      const response = await apiClient.get<IncidentResponse[]>(
        `/incidents/severity/${severity}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching incidents by severity:", error);
      throw new Error("Failed to fetch incidents by severity");
    }
  }
}

export default IncidentApiService;
