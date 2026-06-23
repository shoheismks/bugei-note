function HomeCombatCard({
  combatPower,
  levelData,
  playerClass,
}) {
  const safeCombatPower = combatPower || {
    strength: 0,
    budo: 0,
    continuity: 0,
    knowledge: 0,
    bodyControl: 0,
    stepBonus: 0,
    techniquePower: 0,
    total: 0,
  };

  const safeLevelData = levelData || {
    level: 1,
    currentXp: 0,
    nextXp: 10,
    remaining: 10,
  };

  const levelPercent =
    (safeLevelData.currentXp / safeLevelData.nextXp) * 100;

  return (
    <section className="card product-card combat-card">
      <p className="metric-label">COMBAT POWER</p>

      <div className="big-rank metric-value">{safeCombatPower.total}</div>

      <h4>筋力 {safeCombatPower.strength}</h4>
      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${safeCombatPower.strength}%` }}
        />
      </div>

      <h4>
        武芸 {safeCombatPower.budo}
        {safeCombatPower.techniquePower > 0 &&
          `（図鑑補正 +${safeCombatPower.techniquePower}）`}
      </h4>
      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${safeCombatPower.budo}%` }}
        />
      </div>

      <h4>
        継続 {safeCombatPower.continuity}
        {safeCombatPower.stepBonus > 0 &&
          `（歩数補正 +${safeCombatPower.stepBonus}）`}
      </h4>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${safeCombatPower.continuity}%` }}
        />
      </div>

      <h4>知識 {safeCombatPower.knowledge}</h4>
      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${safeCombatPower.knowledge}%` }}
        />
      </div>

      <h4>身体操作 {safeCombatPower.bodyControl}</h4>
      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${safeCombatPower.bodyControl}%` }}
        />
      </div>

      <hr />

      <div className="level-panel">
        <p className="metric-label">WARRIOR</p>

        <div className="big-rank level-value">
          Lv.{safeLevelData.level}
        </div>

        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${levelPercent}%` }}
          />
        </div>

        <p>次のレベルまで：{safeLevelData.remaining}</p>

        <p className="class-label">{playerClass}</p>
      </div>
    </section>
  );
}

export default HomeCombatCard;
