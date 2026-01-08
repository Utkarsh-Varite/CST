// src/services/ApiClient.ts
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  // type AccountInfo,
  type AuthenticationResult,
} from "@azure/msal-browser";

type ApiClientConfig = {
  clientId: string; // SPA app client id
  tenantId: string; // tenant guid (recommended) or "common"
  apiScope: string; // e.g. "api://.../user_impersonation"
  apiBaseUrl: string; // e.g. "https://...azurewebsites.net/api"
  redirectUri?: string; // default: window.location.origin
};

export default class ApiClient {
  private static msal: PublicClientApplication | null = null;
  private static cfg: ApiClientConfig | null = null;

  /** Call once at app startup */
  static async init(config: ApiClientConfig): Promise<void> {
    this.cfg = config;

    this.msal = new PublicClientApplication({
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        redirectUri: config.redirectUri ?? window.location.origin,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
      },
    });

    await this.msal.initialize();

    // If you ever switch to loginRedirect, this will complete the redirect flow.
    const redirectResult = await this.msal.handleRedirectPromise();
    if (redirectResult?.account) {
      this.msal.setActiveAccount(redirectResult.account);
      return;
    }

    // Reuse a cached account if present
    const accounts = this.msal.getAllAccounts();
    if (accounts.length > 0) {
      this.msal.setActiveAccount(accounts[0]);
    }
  }

  /** True if an account is available */
  static isSignedIn(): boolean {
    this.ensureInit();
    return !!this.msal!.getActiveAccount();
  }

  /** Useful for showing user name/email in UI */
  static getActiveUser(): { name?: string; username?: string } | null {
    this.ensureInit();
    const acc = this.msal!.getActiveAccount();
    if (!acc) return null;
    return { name: acc.name, username: acc.username };
  }

  /**
   * Interactive sign-in (recommended).
   * NOTE: login uses basic scopes; API scope is acquired during token request.
   */
  static async login(): Promise<void> {
    this.ensureInit();

    const result: AuthenticationResult = await this.msal!.loginPopup({
      scopes: ["openid", "profile", "email"],
    });

    if (result.account) this.msal!.setActiveAccount(result.account);

    // Optional: immediately ensure the API token can be acquired (catch issues early)
    await this.getAccessToken();
  }

  static async logout(): Promise<void> {
    this.ensureInit();
    const acc = this.msal!.getActiveAccount();
    await this.msal!.logoutPopup({ account: acc ?? undefined });
    this.msal!.setActiveAccount(null);
  }

  static async get<T = any>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  static async post<T = any, B = any>(path: string, body: B): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  static async put<T = any, B = any>(path: string, body: B): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  private static async request<T>(
    method: "GET" | "POST" | "PUT",
    path: string,
    body?: any
  ): Promise<T> {
    this.ensureInit();

    const token = await this.getAccessToken(); // ensures signed in + token present
    const url = `${this.cfg!.apiBaseUrl.replace(/\/$/, "")}/${path.replace(
      /^\//,
      ""
    )}`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`${method} ${path} failed: ${res.status} ${txt}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    return contentType.includes("application/json")
      ? res.json()
      : (null as any);
  }

  private static async getAccessToken(): Promise<string> {
    this.ensureInit();

    const acc = this.msal!.getActiveAccount();
    if (!acc) {
      throw new Error("Not signed in. Call ApiClient.login() first.");
    }

    const scopes = [this.cfg!.apiScope];

    try {
      const result = await this.msal!.acquireTokenSilent({
        account: acc,
        scopes,
      });
      return result.accessToken;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        const result = await this.msal!.acquireTokenPopup({ scopes });
        if (result.account) this.msal!.setActiveAccount(result.account);
        return result.accessToken;
      }
      throw e;
    }
  }

  private static ensureInit(): void {
    if (!this.msal || !this.cfg) {
      throw new Error(
        "ApiClient not initialized. Call ApiClient.init(...) first."
      );
    }
  }
}
