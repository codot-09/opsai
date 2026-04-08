import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext, useWorkspaceContext } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { hasWorkspace, workspaceLoading } = useWorkspaceContext();
  const [authChecked, setAuthChecked] = useState(false);
  const [workspaceChecked, setWorkspaceChecked] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  useEffect(() => {
    if (!workspaceLoading) {
      setWorkspaceChecked(true);
    }
  }, [workspaceLoading]);

  if (!authChecked || !workspaceChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-sm text-gray-600">Restoring session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasWorkspace) {
    return <Navigate to="/workspace" replace />;
  }

  return children;
}
