import ProfilePreview, { type ProfileData } from "./panes/ProfilePreview";
import SettingsPane from "./panes/SettingsPane";
import BillingPane from "./panes/BillingPane";
import TokensPane from "./panes/TokensPane";
import ActivityPane from "./panes/ActivityPane";
import HelpPane from "./panes/HelpPane";
import SourcesPane from "./panes/SourcesPane";
import PortraitPane from "./panes/PortraitPane";
import PublishPane from "./panes/PublishPane";
import AgentsPane from "./panes/AgentsPane";
import PrivateContextPane from "./panes/PrivateContextPane";

interface ShellPreviewPaneProps {
  activePane: string;
  username: string;
  mode: "public" | "private";
  profileData?: ProfileData;
  profileId?: string;
}

const ShellPreviewPane = ({ activePane, username, mode, profileData, profileId }: ShellPreviewPaneProps) => {
  switch (activePane) {
    case "profile":
      return <ProfilePreview username={username} mode={mode} profileData={profileData} />;
    case "settings":
      return <SettingsPane username={username} profileId={profileId} />;
    case "billing":
      return <BillingPane />;
    case "tokens":
      return <TokensPane username={username} profileId={profileId} />;
    case "activity":
      return <ActivityPane username={username} profileId={profileId} />;
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
    case "private":
      return <PrivateContextPane username={username} profileId={profileId} />;
    default:
      return <ProfilePreview username={username} mode={mode} profileData={profileData} />;
  }
};

export default ShellPreviewPane;
