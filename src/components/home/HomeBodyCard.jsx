function HomeBodyCard({
  totalXp,
  savedWeight,
  savedBodyFat,
  resetAllData,
}) {
  return (
    <section className="card">
      <h2>身体情報</h2>

      <p>累計XP：{totalXp}XP</p>

      <p>現在体重：{savedWeight}kg</p>

      <p>現在体脂肪率：{savedBodyFat}%</p>

      <button
        className="danger"
        onClick={resetAllData}
      >
        データ初期化
      </button>
    </section>
  );
}

export default HomeBodyCard;
