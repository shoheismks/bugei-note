function AchievementPopup({ achievement }) {
  if (!achievement) return null;

  return (
    <div className="achievement-popup">
      <div className="achievement-popup-inner">
        <div className="popup-title">
          新実績解除
        </div>

        <h2>{achievement.name}</h2>

        <p>{achievement.rarity}</p>

        <p className="hint">
          館主コメント
        </p>

        <p>{achievement.comment}</p>
      </div>
    </div>
  );
}

export default AchievementPopup;