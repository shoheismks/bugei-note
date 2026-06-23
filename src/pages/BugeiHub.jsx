import SegmentedTabs from "../components/SegmentedTabs";
import Titles from "./Titles";
import Achievement from "./Achievement";
import Techniques from "./Techniques";
import Ranking from "./Ranking";
import Rivals from "./Rivals";

const bugeiTabs = [
  { id: "titles", label: "称号" },
  { id: "achievement", label: "実績" },
  { id: "techniques", label: "図鑑" },
  { id: "ranking", label: "ランキング" },
  { id: "rivals", label: "ライバル" },
];

function BugeiHub(props) {
  return (
    <main>
      <section className="card hero">
        <h2>武芸</h2>
        <p className="hint">称号、実績、図鑑、仲間との比較を確認します。</p>
      </section>

      <SegmentedTabs
        items={bugeiTabs}
        value={props.bugeiTab}
        onChange={props.setBugeiTab}
      />

      {props.bugeiTab === "titles" && (
        <Titles
          unlockedTitles={props.unlockedTitles}
          selectedTitle={props.selectedTitle}
        />
      )}

      {props.bugeiTab === "achievement" && (
        <Achievement unlockedAchievements={props.unlockedAchievements} />
      )}

      {props.bugeiTab === "techniques" && (
        <Techniques
          getTechniqueLevel={props.getTechniqueLevel}
          updateTechniqueLevel={props.updateTechniqueLevel}
          learnedCount={props.learnedCount}
          masteredCount={props.masteredCount}
          getNote={props.getNote}
          saveNote={props.saveNote}
        />
      )}

      {props.bugeiTab === "ranking" && <Ranking />}

      {props.bugeiTab === "rivals" && <Rivals />}
    </main>
  );
}

export default BugeiHub;
