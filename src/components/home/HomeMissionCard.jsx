import { getMissionBonus } from "../../utils/missionBonusEngine";

function HomeMissionCard({
  missionCount,
  recommendedMission,
}) {
  const missionBonus = getMissionBonus(missionCount);

  const safeRecommendedMission = recommendedMission || {
    title: "本日の任務確認中",
    description: "今日の行動を確認しています。",
  };

  return (
    <section className="card">
      <h2>🎯 本日のおすすめ任務</h2>

      <div className="big-rank">
        {safeRecommendedMission.title}
      </div>

      <p className="hint">
        {safeRecommendedMission.description}
      </p>

      <div
        className="card"
        style={{
          marginTop: "12px",
          border: missionBonus.achieved
            ? "2px solid gold"
            : "1px solid #555",
        }}
      >
        <h4>{missionBonus.title}</h4>

        <p>{missionBonus.description}</p>

        {missionBonus.achieved && (
          <p
            style={{
              fontWeight: "bold",
              color: "gold",
            }}
          >
            +{missionBonus.xp} XP
          </p>
        )}
      </div>

      <hr />

      <h2>📜 今日の任務</h2>

      <div className="big-rank">{missionCount}/4</div>

      <p className="hint">
        今日の記録状況。任務を斬れば、明日の自分が少し楽になる。
      </p>
    </section>
  );
}

export default HomeMissionCard;