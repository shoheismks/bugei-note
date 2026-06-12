import { useState } from "react";
import { techniques } from "../data/techniques";

const levelLabels = [
  "未習得",
  "知っている",
  "できる",
  "教えられる",
];

function Techniques({
  getTechniqueLevel,
  updateTechniqueLevel,
  learnedCount,
  masteredCount,
  getNote,
  saveNote,
}) {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [searchWord, setSearchWord] = useState("");

  const groups = {
    居合: techniques.filter((t) => t.art === "居合"),
    剣術: techniques.filter((t) => t.art === "剣術"),
    柔術: techniques.filter((t) => t.art === "柔術"),
    杖術: techniques.filter((t) => t.art === "杖術"),
  };

  const selectedNote = selectedTechnique
    ? getNote(selectedTechnique.id)
    : null;

  const totalCount = techniques.length;

  const learnedPercent =
    totalCount > 0
      ? Math.round((learnedCount / totalCount) * 100)
      : 0;

  const getArtLearnedPercent = (artTechniques) => {
    if (artTechniques.length === 0) return 0;

    const learned = artTechniques.filter((technique) => {
      return getTechniqueLevel(technique.id) > 0;
    }).length;

    return Math.round((learned / artTechniques.length) * 100);
  };

  const getArtMasteredCount = (artTechniques) => {
    return artTechniques.filter((technique) => {
      return getTechniqueLevel(technique.id) === 3;
    }).length;
  };

  const iaidoPercent = getArtLearnedPercent(groups.居合);
  const kenjutsuPercent = getArtLearnedPercent(groups.剣術);
  const jujutsuPercent = getArtLearnedPercent(groups.柔術);
  const jojutsuPercent = getArtLearnedPercent(groups.杖術);

  const artProgressList = [
    {
      name: "居合",
      percent: iaidoPercent,
      count: groups.居合.length,
      mastered: getArtMasteredCount(groups.居合),
    },
    {
      name: "剣術",
      percent: kenjutsuPercent,
      count: groups.剣術.length,
      mastered: getArtMasteredCount(groups.剣術),
    },
    {
      name: "柔術",
      percent: jujutsuPercent,
      count: groups.柔術.length,
      mastered: getArtMasteredCount(groups.柔術),
    },
    {
      name: "杖術",
      percent: jojutsuPercent,
      count: groups.杖術.length,
      mastered: getArtMasteredCount(groups.杖術),
    },
  ];

  const changeLevel = (id) => {
    const current = getTechniqueLevel(id);
    const next = current >= 3 ? 0 : current + 1;

    updateTechniqueLevel(id, next);
  };

  const matchesSearch = (technique) => {
    if (!searchWord) return true;

    const note = getNote(technique.id);

    const targetText = `
      ${technique.name}
      ${technique.art}
      ${note.point}
      ${note.mistake}
      ${note.teaching}
      ${note.insight}
    `.toLowerCase();

    return targetText.includes(searchWord.toLowerCase());
  };

  return (
    <main>
      <section className="card hero">
        <h2>📚 武芸図鑑</h2>

        <div className="big-rank">{learnedPercent}%</div>

        <p>
          習得技：{learnedCount}/{techniques.length}
        </p>

        <p>教えられる技：{masteredCount}</p>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${learnedPercent}%` }}
          />
        </div>

        <input
          type="text"
          placeholder="技名・メモ検索"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />

        <p className="hint">
          技名を押すとメモ、習熟度ボタンでレベル変更。
        </p>
      </section>

      <section className="card">
        <h2>🏯 流派進捗</h2>

        {artProgressList.map((art) => (
          <div key={art.name} className="rank-card">
            <h3>
              {art.percent >= 100
                ? `🏆 ${art.name}皆伝`
                : art.percent >= 80
                ? `📘 ${art.name}研究家`
                : art.name}
            </h3>

            <p>
              習得率：{art.percent}% / {art.count}技
            </p>

            <p>
              教えられる技：{art.mastered}
            </p>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${art.percent}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {Object.entries(groups).map(([art, artTechniques]) => {
        const filteredTechniques =
          artTechniques.filter(matchesSearch);

        if (filteredTechniques.length === 0) {
          return null;
        }

        const artPercent = getArtLearnedPercent(artTechniques);

        return (
          <section className="card" key={art}>
            <h2>{art} {artPercent}%</h2>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${artPercent}%` }}
              />
            </div>

            <p className="hint">
              {filteredTechniques.length}/{artTechniques.length}技 表示中
            </p>

            {filteredTechniques.map((technique) => {
              const level = getTechniqueLevel(technique.id);

              return (
                <div
                  key={technique.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <strong
                    onClick={() => setSelectedTechnique(technique)}
                    style={{ cursor: "pointer" }}
                  >
                    {technique.name}
                  </strong>

                  <p>レベル：{levelLabels[level]}</p>

                  <div className="xp-bar">
                    <div
                      className="xp-fill"
                      style={{
                        width: `${(level / 3) * 100}%`,
                      }}
                    />
                  </div>

                  <button onClick={() => changeLevel(technique.id)}>
                    習熟度を上げる
                  </button>
                </div>
              );
            })}
          </section>
        );
      })}

      {selectedTechnique && (
        <section className="card">
          <h2>📖 {selectedTechnique.name}</h2>

          <p>流派：{selectedTechnique.art}</p>

          <textarea
            placeholder="ポイント"
            value={selectedNote.point}
            onChange={(e) =>
              saveNote(selectedTechnique.id, {
                ...selectedNote,
                point: e.target.value,
              })
            }
          />

          <textarea
            placeholder="失敗例"
            value={selectedNote.mistake}
            onChange={(e) =>
              saveNote(selectedTechnique.id, {
                ...selectedNote,
                mistake: e.target.value,
              })
            }
          />

          <textarea
            placeholder="指導法"
            value={selectedNote.teaching}
            onChange={(e) =>
              saveNote(selectedTechnique.id, {
                ...selectedNote,
                teaching: e.target.value,
              })
            }
          />

          <textarea
            placeholder="気づき"
            value={selectedNote.insight}
            onChange={(e) =>
              saveNote(selectedTechnique.id, {
                ...selectedNote,
                insight: e.target.value,
              })
            }
          />

          <button onClick={() => setSelectedTechnique(null)}>
            閉じる
          </button>
        </section>
      )}
    </main>
  );
}

export default Techniques;