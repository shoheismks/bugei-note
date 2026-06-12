import { parts, timeBasedExercises } from "../data";
import { scoreToRank, scoreToSamuraiTitle, scoreToXp } from "../rank";

function Rank({
  overallScore,
  totalXp,
  weightClass,
  getPartBestScore,
  getBestRecord,
  getRecordScore,
}) {
  return (
    <main>
      <section className="card hero">
        <h2>総合段位</h2>

        <div className="big-rank">
          {scoreToRank(overallScore)}
        </div>

        <h3>
          {scoreToSamuraiTitle(overallScore)}
        </h3>

        <p>階級：{weightClass}</p>
        <p>累計XP：{totalXp}</p>
      </section>

      <section className="card">
        <h2>部位別段位</h2>

        {parts.map((part) => {
          const score = getPartBestScore(part);
          const bestRecord = getBestRecord(part);

          return (
            <div key={part} style={{ marginBottom: "20px" }}>
              <h3>{part}</h3>

              <p>
                {scoreToRank(score)}
                {" / "}
                {scoreToSamuraiTitle(score)}
              </p>

              {bestRecord ? (
                <>
                  <p>{bestRecord.exercise}</p>

                  <p>
                    {timeBasedExercises.includes(bestRecord.exercise)
                      ? `${bestRecord.reps}秒`
                      : `${bestRecord.weight}kg × ${bestRecord.reps}回`}
                  </p>

                  {!timeBasedExercises.includes(bestRecord.exercise) && (
                    <p>
                      推定1RM：
                      {getRecordScore(bestRecord).toFixed(1)}
                      kg
                    </p>
                  )}
                </>
              ) : (
                <p>記録なし</p>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default Rank;