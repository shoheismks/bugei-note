import { useState } from "react";
import BodyChartCard from "../components/body/BodyChartCard";

function Body({
  weight,
  setWeight,
  bodyFat,
  setBodyFat,
  bodyRecords,
  saveBodyRecord,
  deleteBodyRecord,
}) {
  const [targetWeight, setTargetWeight] = useState(
    Number(localStorage.getItem("targetWeight")) || 78
  );

  const [targetBodyFat, setTargetBodyFat] = useState(
    Number(localStorage.getItem("targetBodyFat")) || 15
  );

  const saveTarget = () => {
    localStorage.setItem("targetWeight", targetWeight);
    localStorage.setItem("targetBodyFat", targetBodyFat);

    alert("目標を保存しました");
  };

  return (
    <main>
      <BodyChartCard
        bodyRecords={bodyRecords}
        targetWeight={targetWeight}
        targetBodyFat={targetBodyFat}
      />

      <section className="card">
        <h2>身体目標</h2>

        <input
          type="number"
          placeholder="目標体重 kg"
          value={targetWeight}
          onChange={(e) => setTargetWeight(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="目標体脂肪率 %"
          value={targetBodyFat}
          onChange={(e) => setTargetBodyFat(Number(e.target.value))}
        />

        <button className="primary" onClick={saveTarget}>
          目標を保存
        </button>
      </section>

      <section className="card">
        <h2>身体記録</h2>

        <input
          type="number"
          placeholder="体重 kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="体脂肪率 %"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
        />

        <button className="primary" onClick={saveBodyRecord}>
          身体記録を保存
        </button>
      </section>

      {bodyRecords.length === 0 && (
        <section className="card">
          <p>身体記録はまだありません</p>
        </section>
      )}

      {bodyRecords.map((record, index) => (
        <section className="card" key={index}>
          <p>{new Date(record.date).toLocaleString()}</p>
          <p>体重：{record.weight}kg</p>
          <p>体脂肪率：{record.bodyFat || "未入力"}%</p>

          <button onClick={() => deleteBodyRecord(index)}>
            削除
          </button>
        </section>
      ))}
    </main>
  );
}

export default Body;