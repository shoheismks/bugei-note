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

  const sortedRecords = [...(bodyRecords || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const latestRecord = sortedRecords[sortedRecords.length - 1];
  const currentWeight = latestRecord?.weight || "-";
  const currentBodyFat = latestRecord?.bodyFat || "-";
  const weightGap =
    latestRecord?.weight && targetWeight
      ? (Number(latestRecord.weight) - Number(targetWeight)).toFixed(1)
      : "-";

  return (
    <main>
      <section className="card product-card body-status-card">
        <p className="metric-label">BODY STATUS</p>
        <div className="body-status-grid">
          <div>
            <span>現在体重</span>
            <strong>{currentWeight}</strong>
            <small>kg</small>
          </div>
          <div>
            <span>現在体脂肪</span>
            <strong>{currentBodyFat}</strong>
            <small>%</small>
          </div>
          <div>
            <span>目標体重</span>
            <strong>{targetWeight}</strong>
            <small>kg</small>
          </div>
          <div>
            <span>目標との差</span>
            <strong>{weightGap}</strong>
            <small>kg</small>
          </div>
        </div>
      </section>

      <BodyChartCard
        bodyRecords={bodyRecords}
        targetWeight={targetWeight}
        targetBodyFat={targetBodyFat}
      />

      <section className="card goal-card">
        <p className="metric-label">GOAL</p>
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

      {bodyRecords.length > 0 && (
        <section className="card body-history-list">
          <h2>履歴</h2>

          {bodyRecords.map((record, index) => (
            <div className="body-history-item" key={index}>
              <p>{new Date(record.date).toLocaleString()}</p>
              <strong>{record.weight}kg</strong>
              <span>体脂肪率 {record.bodyFat || "未入力"}%</span>

              <button onClick={() => deleteBodyRecord(index)}>
                削除
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default Body;
