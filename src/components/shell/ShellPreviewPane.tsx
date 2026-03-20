import ProfilePreview from "./panes/ProfilePreview";
import SettingsPane from "./panes/SettingsPane";
import BillingPane from "./panes/BillingPane";
import TokensPane from "./panes/TokensPane";
import ActivityPane from "./panes/ActivityPane";
import HelpPane from "./panes/HelpPane";
import SourcesPane from "./panes/SourcesPane";
import PortraitPane from "./panes/PortraitPane";
import PublishPane from "./panes/PublishPane";
import AgentsPane from "./panes/AgentsPane";

interface ShellPreviewPaneProps {
  activePane: string;
  username: string;
  mode: "public" | "private";
}

const ShellPreviewPane = ({ activePane, username, mode }: ShellPreviewPaneProps) => {
  switch (activePane) {
    case "profile":
      return <ProfilePreview username={username} mode={mode} />;
    case "settings":
      return <SettingsPane username={username} />;
    case "billing":
      return <BillingPane />;
    case "tokens":
      return <TokensPane />;
    case "activity":
      return <ActivityPane username={username} />;
    case "help":
      return <HelpPane />;
    case "sources":
      return <SourcesPane username={username} />;
    case "portrait":
      return <PortraitPane username={username} />;
    case "publish":
      return <PublishPane username={username} />;
    case "agents":
      return <AgentsPane username={username} />;
    default:
      return <ProfilePreview username={username} mode={mode} />;
  }
};

export default ShellPreviewPane;
