import React from "react";
import { IncidentProvider } from "./context/IncidentContext";
import IncidentForm from "./components/IncidentForm";
import IncidentList from "./components/IncidentList";
import { Shield, Activity } from "lucide-react";
import "./App.css";

// Main App component following Single Responsibility Principle
function App() {
  return (
    <IncidentProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <Activity className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  AI-Powered Incident Triage Assistant
                </h1>
                <p className="text-gray-600 mt-1">
                  Intelligent incident reporting and categorization system
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <section className="form-section">
            <IncidentForm />
          </section>

          <section className="dashboard-section">
            <IncidentList />
          </section>
        </main>

        <footer className="bg-gray-900 text-white py-6 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="opacity-80">
              &copy; 2025 ITSM Triage Assistant - Powered by AI
            </p>
          </div>
        </footer>
      </div>
    </IncidentProvider>
  );
}

export default App;
