import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";

import App from "./App";
import { msalConfig } from "./auth/msalConfig";
import ApiClient from "./services/ApiClient";
import "./index.css";

const msalInstance = new PublicClientApplication(msalConfig);

async function startApp() {
  await msalInstance.initialize();

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) msalInstance.setActiveAccount(accounts[0]);

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const account = (event.payload as any).account;
      msalInstance.setActiveAccount(account);
    }
  });

  await ApiClient.init({
    clientId: import.meta.env.VITE_AAD_CLIENT_ID as string,
    tenantId: import.meta.env.VITE_AAD_TENANT_ID as string,
    apiScope: import.meta.env.VITE_AAD_API_SCOPE as string,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
    redirectUri: import.meta.env.VITE_AAD_REDIRECT_URI as string,
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <HashRouter>
          <App />
        </HashRouter>
      </MsalProvider>
    </React.StrictMode>
  );
}

startApp();
