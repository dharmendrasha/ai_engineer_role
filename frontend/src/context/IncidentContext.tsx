import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { IncidentResponse, Severity } from "../types/incident";

// State interface
interface IncidentState {
  incidents: IncidentResponse[];
  loading: boolean;
  error: string | null;
  selectedSeverity: Severity | null;
  successMessage: string | null;
  newIncidentId: number | null;
}

// Action types
type IncidentAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INCIDENTS"; payload: IncidentResponse[] }
  | { type: "ADD_INCIDENT"; payload: IncidentResponse }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SELECTED_SEVERITY"; payload: Severity | null }
  | { type: "SET_SUCCESS_MESSAGE"; payload: string | null }
  | { type: "SET_NEW_INCIDENT_ID"; payload: number | null }
  | { type: "CLEAR_NOTIFICATIONS" };

// Initial state
const initialState: IncidentState = {
  incidents: [],
  loading: false,
  error: null,
  selectedSeverity: null,
  successMessage: null,
  newIncidentId: null,
};

// Reducer function following Single Responsibility Principle
function incidentReducer(
  state: IncidentState,
  action: IncidentAction
): IncidentState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_INCIDENTS":
      return {
        ...state,
        incidents: action.payload,
        loading: false,
        error: null,
      };
    case "ADD_INCIDENT":
      return {
        ...state,
        incidents: [action.payload, ...state.incidents],
        loading: false,
        error: null,
        successMessage: "Incident created successfully! AI analysis completed.",
        newIncidentId: action.payload.id,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        successMessage: null,
      };
    case "SET_SELECTED_SEVERITY":
      return { ...state, selectedSeverity: action.payload };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.payload };
    case "SET_NEW_INCIDENT_ID":
      return { ...state, newIncidentId: action.payload };
    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        error: null,
        successMessage: null,
        newIncidentId: null,
      };
    default:
      return state;
  }
}

// Context interface
interface IncidentContextType {
  state: IncidentState;
  dispatch: React.Dispatch<IncidentAction>;
}

// Create context
const IncidentContext = createContext<IncidentContextType | undefined>(
  undefined
);

// Provider props
interface IncidentProviderProps {
  children: ReactNode;
}

// Provider component following Single Responsibility Principle
export const IncidentProvider: React.FC<IncidentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(incidentReducer, initialState);

  return (
    <IncidentContext.Provider value={{ state, dispatch }}>
      {children}
    </IncidentContext.Provider>
  );
};

// Custom hook following Interface Segregation Principle
export const useIncident = (): IncidentContextType => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncident must be used within an IncidentProvider");
  }
  return context;
};
