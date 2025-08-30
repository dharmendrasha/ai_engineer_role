import React, { useEffect, useCallback } from "react";
import { IncidentResponse, Severity } from "../types/incident";
import { IncidentApiService } from "../services/incidentService";
import { useIncident } from "../context/IncidentContext";
import IncidentCard from "./IncidentCard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
} from "lucide-react";
import "./IncidentList.css";

// Component following Single Responsibility Principle - only handles incident listing
export const IncidentList: React.FC = () => {
  const { state, dispatch } = useIncident();
  const { incidents } = state;

  const loadIncidents = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const incidentsData: IncidentResponse[] =
        await IncidentApiService.getAllIncidents();
      dispatch({ type: "SET_INCIDENTS", payload: incidentsData });
    } catch (error) {
      console.error("Failed to load incidents:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load incidents" });
    }
  }, [dispatch]);

  const getStats = useCallback(() => {
    const total = incidents.length;
    const highPriority = incidents.filter(
      (inc: IncidentResponse) => inc.aiSeverity === Severity.HIGH
    ).length;
    const mediumPriority = incidents.filter(
      (inc: IncidentResponse) => inc.aiSeverity === Severity.MEDIUM
    ).length;
    const lowPriority = incidents.filter(
      (inc: IncidentResponse) => inc.aiSeverity === Severity.LOW
    ).length;

    return { total, highPriority, mediumPriority, lowPriority };
  }, [incidents]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const stats = getStats();

  const getSeverityBadgeVariant = (severity: Severity) => {
    switch (severity) {
      case Severity.HIGH:
        return "destructive";
      case Severity.MEDIUM:
        return "secondary";
      case Severity.LOW:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Incident Dashboard
            </CardTitle>
            <Button
              onClick={loadIncidents}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {stats.highPriority}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.mediumPriority}
                </p>
                <p className="text-sm text-muted-foreground">Medium Priority</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.lowPriority}
                </p>
                <p className="text-sm text-muted-foreground">Low Priority</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              All Incidents ({incidents.length})
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {stats.highPriority} High
              </Badge>
              <Badge variant="secondary" className="gap-1">
                {stats.mediumPriority} Medium
              </Badge>
              <Badge variant="outline" className="gap-1">
                {stats.lowPriority} Low
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No incidents found
              </h3>
              <p className="text-muted-foreground">
                No incidents have been created yet. Create your first incident
                to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {incidents.map((incident: IncidentResponse) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentList;
