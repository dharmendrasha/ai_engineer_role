import React, { useEffect, useState } from "react";
import { IncidentResponse, Severity, Category } from "../types/incident";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Clock,
  Hash,
  Server,
  Brain,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import "./IncidentCard.css";

// Props interface following Interface Segregation Principle
interface IncidentCardProps {
  incident: IncidentResponse;
  isNew?: boolean;
}

// Component following Single Responsibility Principle - only displays incident card
const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  isNew = false,
}) => {
  const [isHighlighted, setIsHighlighted] = useState(isNew);

  // Remove highlight after 3 seconds
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);
  // Get severity variant and icon
  const getSeverityVariant = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
        return {
          variant: "destructive" as const,
          icon: AlertTriangle,
          color: "text-red-600",
        };
      case Severity.HIGH:
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          color: "text-orange-600",
        };
      case Severity.MEDIUM:
        return {
          variant: "secondary" as const,
          icon: Info,
          color: "text-yellow-600",
        };
      case Severity.LOW:
        return {
          variant: "outline" as const,
          icon: CheckCircle,
          color: "text-green-600",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: Info,
          color: "text-gray-600",
        };
    }
  };

  // Get category icon from Lucide
  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.HARDWARE:
        return "🔧";
      case Category.SOFTWARE:
        return "💻";
      case Category.NETWORK:
        return "🌐";
      case Category.SECURITY:
        return "🔒";
      case Category.DATABASE:
        return "🗄️";
      case Category.APPLICATION:
        return "📱";
      case Category.USER_ACCESS:
        return "👤";
      case Category.PERFORMANCE:
        return "⚡";
      default:
        return "📋";
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const severityInfo = getSeverityVariant(incident.aiSeverity);
  const SeverityIcon = severityInfo.icon;

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 hover:shadow-lg",
        isHighlighted &&
          "ring-2 ring-green-500 shadow-green-500/25 animate-pulse"
      )}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 animate-bounce"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            NEW
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg leading-tight flex-1">
            {incident.title}
          </h3>
          <Badge variant={severityInfo.variant} className="shrink-0">
            <SeverityIcon className="h-3 w-3 mr-1" />
            {incident.aiSeverity}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            {incident.id}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(incident.createdAt)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Affected Service:</span>
          <span>{incident.affectedService}</span>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Description:</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {incident.description}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Brain className="h-4 w-4 text-blue-600" />
            AI Analysis Results
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">
              {getCategoryIcon(incident.aiCategory)}
            </span>
            <span className="font-medium">Category:</span>
            <Badge variant="outline">{incident.aiCategory}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Suggested Action:
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic pl-6">
              {incident.aiSuggestedAction}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
