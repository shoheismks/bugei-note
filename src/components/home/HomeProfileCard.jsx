import { titles } from "../../titles.js";

function HomeProfileCard({
  selectedTitle,
  changeTitle,
  unlockedTitles,
}) {
  const safeUnlockedTitles = unlockedTitles || ["現代サムライ"];

  const selectableTitles = titles.filter((title) =>
    safeUnlockedTitles.includes(title.name)
  );

  return (
    <section className="card hero">
      <h2>武芸館</h2>

      <p>館主：下越翔平</p>

      <h3>称号</h3>

      <div className="big-rank">{selectedTitle}</div>

      <select
        value={selectedTitle}
        onChange={(e) => changeTitle(e.target.value)}
      >
        {selectableTitles.map((title) => (
          <option key={title.id} value={title.name}>
            {title.name}
          </option>
        ))}
      </select>

      <p className="hint">
        称号解除数：{safeUnlockedTitles.length}/{titles.length}
      </p>
    </section>
  );
}

export default HomeProfileCard;