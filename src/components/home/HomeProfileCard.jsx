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
    <section className="card hero home-profile-card">
      <p className="profile-kicker">SHU・HA・RI Member</p>

      <div className="big-rank">{selectedTitle}</div>

      <h2>下越翔平</h2>

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
