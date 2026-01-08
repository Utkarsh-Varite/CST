import { useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useLocation, useNavigate } from "react-router-dom";
import { loginRequest } from "./msalConfig";
import Loader from "../components/commons/loader";

const POST_LOGIN_PATH_KEY = "cst.postLoginPath";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      const intendedPath = `${location.pathname}${location.search}`;
      sessionStorage.setItem(POST_LOGIN_PATH_KEY, intendedPath);
      instance.loginRedirect(loginRequest);
    }
  }, [isAuthenticated, inProgress, instance, location.pathname, location.search]);

  // After login, return user to their intended route (if any)
  useEffect(() => {
    if (!isAuthenticated || inProgress !== InteractionStatus.None) return;
    const intendedPath = sessionStorage.getItem(POST_LOGIN_PATH_KEY);
    if (!intendedPath) return;
    sessionStorage.removeItem(POST_LOGIN_PATH_KEY);
    const currentPath = `${location.pathname}${location.search}`;
    if (intendedPath !== currentPath) {
      navigate(intendedPath, { replace: true });
    }
  }, [isAuthenticated, inProgress, location.pathname, location.search, navigate]);

  // During redirect / login, render nothing (or replace with Loader)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Signing you in..." />
      </div>
    );
  }

  return <>{children}</>;
}
