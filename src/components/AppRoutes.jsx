import Home from "../pages/Home";
import PracticeHub from "../pages/PracticeHub";
import BodyHub from "../pages/BodyHub";
import BugeiHub from "../pages/BugeiHub";
import SettingsPage from "../pages/Settings";

function AppRoutes(props) {
  const { tab } = props;

  if (tab === "home") return <Home {...props} />;

  if (tab === "training") return <PracticeHub {...props} />;

  if (tab === "body") return <BodyHub {...props} />;

  if (tab === "martial") return <BugeiHub {...props} />;

  if (tab === "settings") {
    return (
      <SettingsPage
        profile={props.profile}
        saveProfile={props.saveProfile}
        gender={props.gender}
        saveGender={props.saveGender}
        weightClass={props.weightClass}
        selectedTitle={props.selectedTitle}
        changeTitle={props.changeTitle}
        unlockedTitles={props.unlockedTitles}
        levelData={props.levelData}
        overallScore={props.overallScore}
        combatPower={props.combatPower}
        handleLogout={props.handleLogout}
      />
    );
  }

  return null;
}

export default AppRoutes;
