import React, { createContext, useContext } from 'react';
import { useAuth, useWorkspace } from '../hooks/useAuth.js';

// Create contexts
const AuthContext = createContext();
const WorkspaceContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Workspace Provider
export const WorkspaceProvider = ({ children }) => {
  const workspace = useWorkspace();

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hooks to use the contexts
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
};

// Combined provider for convenience
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </AuthProvider>
  );
};