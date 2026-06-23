import SegmentedTabs from "../components/SegmentedTabs";
import Training from "./Training";
import MartialArts from "./MartialArts";
import Steps from "./Steps";
import BudoJournal from "./BudoJournal";

const practiceTabs = [
  { id: "strength", label: "筋力" },
  { id: "martial", label: "武芸" },
  { id: "steps", label: "歩数" },
  { id: "journal", label: "日誌" },
];

function PracticeHub(props) {
  return (
    <main>
      <section className="card hero">
        <h2>稽古</h2>
        <p className="hint">筋力・武芸・歩数・日誌をまとめて記録します。</p>
      </section>

      <SegmentedTabs
        items={practiceTabs}
        value={props.practiceTab}
        onChange={props.setPracticeTab}
      />

      {props.practiceTab === "strength" && (
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
          trainingDate={props.trainingDate}
          setTrainingDate={props.setTrainingDate}
          handlePartChange={props.handlePartChange}
          saveTrainingRecord={props.handleSaveTrainingRecord}
          deleteTrainingRecord={props.deleteTrainingRecord}
          getRecordScore={props.getRecordScore}
        />
      )}

      {props.practiceTab === "martial" && (
        <MartialArts
          martialArt={props.martialArt}
          setMartialArt={props.setMartialArt}
          martialMenu={props.martialMenu}
          setMartialMenu={props.setMartialMenu}
          martialCount={props.martialCount}
          setMartialCount={props.setMartialCount}
          martialDate={props.martialDate}
          setMartialDate={props.setMartialDate}
          martialRecords={props.martialRecords}
          saveMartialRecord={props.saveMartialRecord}
          deleteMartialRecord={props.deleteMartialRecord}
        />
      )}

      {props.practiceTab === "steps" && (
        <Steps
          steps={props.steps}
          setSteps={props.setSteps}
          stepDate={props.stepDate}
          setStepDate={props.setStepDate}
          stepRecords={props.stepRecords}
          saveStepRecord={props.saveStepRecord}
          deleteStepRecord={props.deleteStepRecord}
        />
      )}

      {props.practiceTab === "journal" && (
        <BudoJournal
          journalText={props.journalText}
          setJournalText={props.setJournalText}
          journalSearch={props.journalSearch}
          setJournalSearch={props.setJournalSearch}
          journalRecords={props.journalRecords}
          saveJournalRecord={props.saveJournalRecord}
          deleteJournalRecord={props.deleteJournalRecord}
        />
      )}
    </main>
  );
}

export default PracticeHub;
