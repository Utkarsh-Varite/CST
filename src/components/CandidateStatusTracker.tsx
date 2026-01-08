import * as React from "react";
import { ConsultantListView } from "./consultants-list-view";
import DownPage from "./commons/down-page";

export type StandaloneContext = {
  isServedFromLocalhost?: boolean;
  pageContext?: { user?: { displayName?: string; email?: string } };
};

interface ICandidateStatusTrackerProps {
  context: StandaloneContext;
}

export default class CandidateStatusTracker extends React.Component<ICandidateStatusTrackerProps> {
  private readonly isMaintenanceMode: boolean = false;

  public render(): React.ReactElement {
    if (this.isMaintenanceMode) return <DownPage />;
    return <ConsultantListView context={this.props.context} />;
  }
}
