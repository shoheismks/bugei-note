import {
  scoreToRank,
  scoreToSamuraiTitle,
  scoreToXp,
} from "../../rank";

import {
  martialXpToRank,
  martialTitle,
} from "../../martialRank";

function HomeRankCard({
  overallScore,
  martialXp,
  martialRecords,
}) {
  const overallXp = scoreToXp(overallScore);

  const getXpByArt = (art) => {
    return martialRecords
      .filter((record) => record.art === art)
      .reduce((sum, record) => sum + Number(record.xp || 0), 0);
  };

  const iaiXp = getXpByArt("居合");
  const kenjutsuXp = getXpByArt("剣術");
  const jujutsuXp = getXpByArt("柔術");
  const joXp = getXpByArt("杖術");

  const martialRank = martialXpToRank(martialXp);
  const martialRankTitle = martialTitle(martialRank);

  return (
    <section className="card">
      <h2>総合段位</h2>

      <div className="big-rank">
        {scoreToRank(overallScore)}
      </div>

      <h3>{scoreToSamuraiTitle(overallScore)}</h3>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{
            width: `${overallXp.percent}%`,
          }}
        />
      </div>

      <p>
        段位経験値：
        {overallXp.currentXp}/{overallXp.nextXp}XP
      </p>

      <p>
        次の昇段まで：
        {overallXp.remaining}XP
      </p>

      <hr />

      <h2>⚔ 総合武芸段位</h2>

      <div className="big-rank">
        {martialRank}
      </div>

      <p>{martialRankTitle}</p>

      <p>武芸XP：{martialXp}</p>

      <hr />

      <h2>流派別段位</h2>

      <p>⚔ 居合：{martialXpToRank(iaiXp)}</p>
      <p>🗡 剣術：{martialXpToRank(kenjutsuXp)}</p>
      <p>🥋 柔術：{martialXpToRank(jujutsuXp)}</p>
      <p>🪵 杖術：{martialXpToRank(joXp)}</p>
    </section>
  );
}

export default HomeRankCard;