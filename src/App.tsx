import { Routes, Route } from "react-router-dom";
import { AuthGate } from "./auth/AuthGate";

import CandidateStatusTracker from "./components/CandidateStatusTracker";
import { CstView } from "./components/cst-view";
import DownPage from "./components/commons/down-page";

export default function App() {
  // TODO: replace this with your real context source
  const context = { isServedFromLocalhost: true };

  return (
    <AuthGate>
      <Routes>
        <Route
          path="/"
          element={<CandidateStatusTracker context={context} />}
        />
        <Route path="/cst-view" element={<CstView context={context} />} />
        <Route path="*" element={<DownPage />} />
      </Routes>
    </AuthGate>
  );
}
