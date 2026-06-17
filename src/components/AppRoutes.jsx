import Home from "../pages/Home";
import Body from "../pages/Body";
import Training from "../pages/Training";
import Rank from "../pages/Rank";
import Achievement from "../pages/Achievement";
import MartialArts from "../pages/MartialArts";
import BudoJournal from "../pages/BudoJournal";
import Titles from "../pages/Titles";
import Missions from "../pages/Missions";
import Steps from "../pages/Steps";
import Techniques from "../pages/Techniques";
import Backup from "../pages/Backup";
import Profile from "../pages/Profile";

function AppRoutes(props) {
  const { tab } = props;

  if (tab === "home") return <Home {...props} />;

  if (tab === "body") {
    return (
      <Body
        weight={props.weight}
        setWeight={props.setWeight}
        bodyFat={props.bodyFat}
        setBodyFat={props.setBodyFat}
        bodyRecords={props.bodyRecords}
        saveBodyRecord={props.saveBodyRecord}
        deleteBodyRecord={props.deleteBodyRecord}
      />
    );
  }

  if (tab === "training") {
    return (
      <Training
        trainingPart={props.trainingPart}
        exercise={props.exercise}
        trainingWeight={props.trainingWeight}
        reps={props.reps}
        sets={props.sets}
        isTimeBased={props.isTimeBased}
        isDumbbell={props.isDumbbell}
        lastXp={props.lastXp}
        rankUpMessage={props.rankUpMessage}
        trainingRecords={props.trainingRecords}
        setExercise={props.setExercise}
        setTrainingWeight={props.setTrainingWeight}
        setReps={props.setReps}
        setSets={props.setSets}
        handlePartChange={props.handlePartChange}
        saveTrainingRecord={props.handleSaveTrainingRecord}
        deleteTrainingRecord={props.deleteTrainingRecord}
        getRecordScore={props.getRecordScore}
      />
    );
  }

  if (tab === "rank") {
    return (
      <Rank
        overallScore={props.overallScore}
        totalXp={props.totalXp + props.martialXp}
        weightClass={props.weightClass}
        getPartBestScore={props.getPartBestScore}
        getBestRecord={props.getBestRecord}
        getRecordScore={props.getRecordScore}
      />
    );
  }

  if (tab === "achievement") {
    return (
      <Achievement
        unlockedAchievements={props.unlockedAchievements}
      />
    );
  }

  if (tab === "martial") {
    return (
      <MartialArts
        martialArt={props.martialArt}
        setMartialArt={props.setMartialArt}
        martialMenu={props.martialMenu}
        setMartialMenu={props.setMartialMenu}
        martialCount={props.martialCount}
        setMartialCount={props.setMartialCount}
        martialRecords={props.martialRecords}
        saveMartialRecord={props.saveMartialRecord}
        deleteMartialRecord={props.deleteMartialRecord}
      />
    );
  }

  if (tab === "journal") {
    return (
      <BudoJournal
        journalText={props.journalText}
        setJournalText={props.setJournalText}
        journalSearch={props.journalSearch}
        setJournalSearch={props.setJournalSearch}
        journalRecords={props.journalRecords}
        saveJournalRecord={props.saveJournalRecord}
        deleteJournalRecord={props.deleteJournalRecord}
      />
    );
  }

  if (tab === "titles") {
    return <Titles unlockedTitles={props.unlockedTitles} />;
  }

  if (tab === "missions") {
    return (
      <Missions
        trainingRecords={props.trainingRecords}
        martialRecords={props.martialRecords}
        journalRecords={props.journalRecords}
        bodyRecords={props.bodyRecords}
      />
    );
  }

  if (tab === "steps") {
    return (
      <Steps
        steps={props.steps}
        setSteps={props.setSteps}
        stepRecords={props.stepRecords}
        saveStepRecord={props.saveStepRecord}
        deleteStepRecord={props.deleteStepRecord}
      />
    );
  }

  if (tab === "techniques") {
    return (
      <Techniques
        getTechniqueLevel={props.getTechniqueLevel}
        updateTechniqueLevel={props.updateTechniqueLevel}
        learnedCount={props.learnedCount}
        masteredCount={props.masteredCount}
        getNote={props.getNote}
        saveNote={props.saveNote}
      />
    );
  }

  if (tab === "profile") {
    return (
      <Profile
        profile={props.profile}
        saveProfile={props.saveProfile}
      />
    );
  }

  if (tab === "backup") {
    return <Backup />;
  }

  return null;
}

export default AppRoutes;