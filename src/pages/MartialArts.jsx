import { martialAchievements } from "../martialAchievements";
import {
  martialXpToRank,
  martialTitle,
  getNextMartialRankXp,
} from "../martialRank";

function MartialArts({
  martialArt,
  setMartialArt,
  martialMenu,
  setMartialMenu,
  martialCount,
  setMartialCount,
  martialDate,
  setMartialDate,
  martialRecords,
  saveMartialRecord,
  deleteMartialRecord,
}) {
  const getXpByArt = (art) => {
    return martialRecords
      .filter((record) => record.art === art)
      .reduce((sum, record) => sum + Number(record.xp || 0), 0);
  };

  const totalMartialXp = martialRecords.reduce((sum, record) => {
    return sum + Number(record.xp || 0);
  }, 0);

  const martialRank = martialXpToRank(totalMartialXp);
  const martialRankTitle = martialTitle(martialRank);
  const totalProgress = getNextMartialRankXp(totalMartialXp);

  const iaiXp = getXpByArt("居合");
  const kenjutsuXp = getXpByArt("剣術");
  const jujutsuXp = getXpByArt("柔術");
  const joXp = getXpByArt("杖術");

  const arts = [
    { name: "居合", xp: iaiXp, icon: "⚔" },
    { name: "剣術", xp: kenjutsuXp, icon: "🗡" },
    { name: "柔術", xp: jujutsuXp, icon: "🥋" },
    { name: "杖術", xp: joXp, icon: "🪵" },
  ];

  const unlockedMartialAchievements = martialAchievements.filter(
    (achievement) => {
      if (achievement.id === "first_budo") return martialRecords.length >= 1;
      if (achievement.id === "ten_xp") return totalMartialXp >= 10;
      if (achievement.id === "fifty_xp") return totalMartialXp >= 50;
      if (achievement.id === "hundred_xp") return totalMartialXp >= 100;
      if (achievement.id === "threehundred_xp") return totalMartialXp >= 300;
      if (achievement.id === "thousand_xp") return totalMartialXp >= 1000;
      if (achievement.id === "ultimate_bushi") return totalMartialXp >= 3000;

      if (achievement.id === "iai_master") return iaiXp >= 300;
      if (achievement.id === "kenjutsu_master") return kenjutsuXp >= 300;
      if (achievement.id === "jujutsu_master") return jujutsuXp >= 300;

      if (achievement.id?.startsWith("iai_")) return iaiXp >= 100;
      if (achievement.id?.startsWith("kenjutsu_")) return kenjutsuXp >= 100;
      if (achievement.id?.startsWith("jujutsu_")) return jujutsuXp >= 100;

      return false;
    }
  );

  return (
    <main>
      <section className="card hero">
        <h2>⚔ 総合武芸段位</h2>

        <div className="big-rank">{martialRank}</div>

        <h3>{martialRankTitle}</h3>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${totalProgress.percent}%` }}
          />
        </div>

        <p>総合武芸XP：{totalMartialXp}</p>
        <p>次の昇段まで：{totalProgress.remaining}XP</p>
      </section>

      <section className="card">
        <h2>流派別段位</h2>

        {arts.map((art) => {
          const rank = martialXpToRank(art.xp);
          const title = martialTitle(rank);
          const progress = getNextMartialRankXp(art.xp);

          return (
            <div className="rank-card" key={art.name}>
              <div className="rank-row">
                <span>
                  {art.icon} {art.name}
                </span>

                <strong>
                  {rank} / {title}
                </strong>
              </div>

              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <p className="hint">XP：{art.xp}</p>
              <p className="hint">次の昇段まで：{progress.remaining}XP</p>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2>武芸記録</h2>

        <select
          value={martialArt}
          onChange={(e) => setMartialArt(e.target.value)}
        >
          <option value="居合">居合</option>
          <option value="剣術">剣術</option>
          <option value="柔術">柔術</option>
          <option value="杖術">杖術</option>
        </select>

        <select
          value={martialMenu}
          onChange={(e) => setMartialMenu(e.target.value)}
        >
          <option value="素振り">素振り</option>
          <option value="抜刀">抜刀</option>
          <option value="納刀">納刀</option>
          <option value="型">型</option>
          <option value="受身">受身</option>
          <option value="投げ込み">投げ込み</option>
          <option value="組太刀">組太刀</option>
        </select>

        <input
          type="number"
          placeholder="回数・本数"
          value={martialCount}
          onChange={(e) => setMartialCount(e.target.value)}
        />

        <input
          type="date"
          value={martialDate}
          onChange={(e) => setMartialDate(e.target.value)}
        />

        <button className="primary" onClick={saveMartialRecord}>
          武芸記録を保存
        </button>
      </section>

      <section className="card">
        <h2>武芸実績</h2>

        <p>
          解除数：{unlockedMartialAchievements.length} /{" "}
          {martialAchievements.length}
        </p>

        {unlockedMartialAchievements.length === 0 && (
          <p className="hint">まだ何も解除されていません。まず稽古。</p>
        )}

        {unlockedMartialAchievements.map((achievement) => (
          <div className="achievement-card" key={achievement.id}>
            <h3>🏆 {achievement.name}</h3>
            <p>{achievement.rarity}</p>
            <p className="hint">館主コメント</p>
            <p>{achievement.comment}</p>
          </div>
        ))}
      </section>

      {martialRecords.length === 0 && (
        <section className="card">
          <p>武芸記録はまだありません。</p>
          <p className="hint">刀も記録も、抜かねば始まらぬ。</p>
        </section>
      )}

      {martialRecords.map((record, index) => (
        <section className="card" key={index}>
          <p>{new Date(record.date).toLocaleString()}</p>

          <p>
            {record.art}：{record.menu}
          </p>

          <p>{record.count}回 / 本</p>

          <p>獲得武芸XP：+{record.xp}</p>

          <button onClick={() => deleteMartialRecord(index)}>削除</button>
        </section>
      ))}
    </main>
  );
}

export default MartialArts;
