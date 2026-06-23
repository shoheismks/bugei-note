import SegmentedTabs from "../components/SegmentedTabs";
import Body from "./Body";
import Rank from "./Rank";
import HomeStatusRadar from "../components/home/HomeStatusRadar";
import HomeBodyCard from "../components/home/HomeBodyCard";

const bodyTabs = [
  { id: "record", label: "身体記録" },
  { id: "analysis", label: "身体分析" },
  { id: "report", label: "レポート" },
];

function BodyHub(props) {
  return (
    <main>
      <section className="card hero">
        <h2>身体</h2>
        <p className="hint">身体記録、分析、レポートを確認します。</p>
      </section>

      <SegmentedTabs
        items={bodyTabs}
        value={props.bodyTab}
        onChange={props.setBodyTab}
      />

      {props.bodyTab === "record" && (
        <Body
          weight={props.weight}
          setWeight={props.setWeight}
          bodyFat={props.bodyFat}
          setBodyFat={props.setBodyFat}
          bodyRecords={props.bodyRecords}
          saveBodyRecord={props.saveBodyRecord}
          deleteBodyRecord={props.deleteBodyRecord}
        />
      )}

      {props.bodyTab === "analysis" && (
        <>
          <HomeStatusRadar combatPower={props.combatPower} />
          <HomeBodyCard
            totalXp={props.totalXp}
            savedWeight={props.savedWeight}
            savedBodyFat={props.savedBodyFat}
            resetAllData={props.resetAllData}
          />
        </>
      )}

      {props.bodyTab === "report" && (
        <Rank
          overallScore={props.overallScore}
          totalXp={props.totalXp + props.martialXp}
          weightClass={props.weightClass}
          trainingRecords={props.trainingRecords}
          martialRecords={props.martialRecords}
          bodyRecords={props.bodyRecords}
          journalRecords={props.journalRecords}
          stepRecords={props.stepRecords}
          unlockedAchievements={props.unlockedAchievements}
          unlockedTitles={props.unlockedTitles}
          selectedTitle={props.selectedTitle}
          combatPower={props.combatPower}
          getPartBestScore={props.getPartBestScore}
          getBestRecord={props.getBestRecord}
          getRecordScore={props.getRecordScore}
        />
      )}
    </main>
  );
}

export default BodyHub;
