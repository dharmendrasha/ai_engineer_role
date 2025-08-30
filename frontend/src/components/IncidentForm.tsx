import React, { useState, useEffect } from "react";
import { IncidentRequest } from "../types/incident";
import { IncidentApiService } from "../services/incidentService";
import { useIncident } from "../context/IncidentContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CheckCircle, AlertCircle, Send, Sparkles } from "lucide-react";
import "./IncidentForm.css";

// Props interface following Interface Segregation Principle
interface IncidentFormProps {
  onSuccess?: () => void;
}

// Component following Single Responsibility Principle - only handles form
const IncidentForm: React.FC<IncidentFormProps> = ({ onSuccess }) => {
  const { state, dispatch } = useIncident();

  // Form state
  const [formData, setFormData] = useState<IncidentRequest>({
    title: "",
    description: "",
    affectedService: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Auto-scroll to dashboard after success
  const scrollToDashboard = () => {
    const dashboardSection = document.querySelector(".dashboard-section");
    if (dashboardSection) {
      dashboardSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (state.successMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATIONS" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage, dispatch]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "CLEAR_NOTIFICATIONS" });

    try {
      // Create incident via API
      const newIncident = await IncidentApiService.createIncident(formData);

      // Update context state
      dispatch({ type: "ADD_INCIDENT", payload: newIncident });

      // Reset form
      setFormData({ title: "", description: "", affectedService: "" });

      // Auto-scroll to dashboard after a short delay to show success message
      setTimeout(() => {
        scrollToDashboard();
      }, 500);

      // Call success callback
      onSuccess?.();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to create incident. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          Report New Incident
        </CardTitle>
        <CardDescription>
          AI-powered incident triage system will analyze and categorize your
          report
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {state.successMessage && (
          <Alert
            variant="success"
            className="animate-in slide-in-from-top duration-300"
          >
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-2">
              {state.successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {state.error && (
          <Alert
            variant="destructive"
            className="animate-in slide-in-from-top duration-300"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Incident Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={255}
              placeholder="Brief description of the incident"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              maxLength={1000}
              rows={4}
              placeholder="Detailed description of the incident (AI will analyze this to determine category and severity)"
              className="w-full min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affectedService">Affected Service *</Label>
            <Input
              id="affectedService"
              name="affectedService"
              value={formData.affectedService}
              onChange={handleInputChange}
              required
              maxLength={255}
              placeholder="e.g., Email Service, Database, Network Infrastructure"
              className="w-full"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Analyzing with AI...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Create Incident
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentForm;
