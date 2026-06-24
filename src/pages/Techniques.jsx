import { useEffect, useState } from "react";
import { BookOpen, Library, Plus, Search } from "lucide-react";
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

  const [noteDraft, setNoteDraft] = useState({
    point: "",
    mistake: "",
    teaching: "",
    insight: "",
  });

  const groups = {
    居合: techniques.filter((t) => t.art === "居合"),
    剣術: techniques.filter((t) => t.art === "剣術"),
    柔術: techniques.filter((t) => t.art === "柔術"),
    杖術: techniques.filter((t) => t.art === "杖術"),
  };

  useEffect(() => {
    if (!selectedTechnique) return;

    setNoteDraft(getNote(selectedTechnique.id));
  }, [selectedTechnique]);

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

  const saveSelectedNote = async () => {
    if (!selectedTechnique) return;

    await saveNote(selectedTechnique.id, noteDraft);
    alert("メモを保存しました");
  };

  return (
    <main className="techniques-main">
      <section className="card hero technique-hero-card">
        <div className="technique-hero-heading">
          <div>
            <p className="metric-label">SKILL LIBRARY</p>
            <h2>Skill Map</h2>
          </div>
          <Library aria-hidden="true" size={24} />
        </div>

        <div className="technique-hero-percent">{learnedPercent}%</div>

        <div className="technique-hero-stats">
          <div>
            <span>習得技</span>
            <strong>{learnedCount} / {techniques.length}</strong>
          </div>
          <div>
            <span>教えられる技</span>
            <strong>{masteredCount}</strong>
          </div>
        </div>

        <div className="technique-progress-bar">
          <span style={{ width: `${learnedPercent}%` }} />
        </div>
      </section>

      <section className="card technique-search-card">
        <div className="technique-section-heading">
          <Search aria-hidden="true" size={20} />
          <p className="metric-label">SEARCH</p>
        </div>
        <input
          type="text"
          placeholder="技名・メモを検索"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
      </section>

      <section className="card technique-art-card">
        <h2>流派進捗</h2>

        <div className="technique-art-grid">
        {artProgressList.map((art) => (
          <div key={art.name} className="technique-art-tile">
            <div>
              <span>{art.name}</span>
              <strong>{art.percent}%</strong>
            </div>
            <small>教えられる技 {art.mastered} / {art.count}</small>
            <div className="technique-mini-bar">
              <span style={{ width: `${art.percent}%` }} />
            </div>
          </div>
        ))}
        </div>
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
            <div className="technique-list-heading">
              <h2>{art}</h2>
              <span>{artPercent}%</span>
            </div>

            <div className="technique-progress-bar small">
              <span style={{ width: `${artPercent}%` }} />
            </div>

            <p className="hint">
              {filteredTechniques.length}/{artTechniques.length}技 表示中
            </p>

            <div className="technique-list">
            {filteredTechniques.map((technique) => {
              const level = getTechniqueLevel(technique.id);

              return (
                <div
                  key={technique.id}
                  className={`technique-row ${
                    selectedTechnique?.id === technique.id ? "is-selected" : ""
                  }`}
                >
                  <button
                    className="technique-name-button"
                    onClick={() => setSelectedTechnique(technique)}
                  >
                    {technique.name}
                  </button>

                  <span className="technique-level-label">{levelLabels[level]}</span>

                  <div className="technique-mini-bar">
                    <span style={{ width: `${(level / 3) * 100}%` }} />
                  </div>

                  <button
                    className="technique-level-button"
                    onClick={() => changeLevel(technique.id)}
                    aria-label={`${technique.name}の習熟度を上げる`}
                  >
                    <Plus aria-hidden="true" size={16} />
                    Lv UP
                  </button>
                </div>
              );
            })}
            </div>
          </section>
        );
      })}

      {selectedTechnique && (
        <section className="card technique-note-card">
          <div className="technique-section-heading">
            <BookOpen aria-hidden="true" size={20} />
            <div>
              <p className="metric-label">{selectedTechnique.art}</p>
              <h2>{selectedTechnique.name}</h2>
            </div>
          </div>

          <textarea
            placeholder="ポイント"
            value={noteDraft.point}
            onChange={(e) =>
              setNoteDraft({
                ...noteDraft,
                point: e.target.value,
              })
            }
          />

          <textarea
            placeholder="失敗例"
            value={noteDraft.mistake}
            onChange={(e) =>
              setNoteDraft({
                ...noteDraft,
                mistake: e.target.value,
              })
            }
          />

          <textarea
            placeholder="指導法"
            value={noteDraft.teaching}
            onChange={(e) =>
              setNoteDraft({
                ...noteDraft,
                teaching: e.target.value,
              })
            }
          />

          <textarea
            placeholder="気づき"
            value={noteDraft.insight}
            onChange={(e) =>
              setNoteDraft({
                ...noteDraft,
                insight: e.target.value,
              })
            }
          />

          <button className="primary" onClick={saveSelectedNote}>
            メモを保存
          </button>

          <button onClick={() => setSelectedTechnique(null)}>
            閉じる
          </button>
        </section>
      )}
    </main>
  );
}

export default Techniques;
