import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

function HomeStatusRadar({ combatPower }) {
  const safeCombatPower = combatPower || {
    strength: 0,
    budo: 0,
    continuity: 0,
    knowledge: 0,
    bodyControl: 0,
  };

  const data = [
    { status: "筋力", value: safeCombatPower.strength },
    { status: "武芸", value: safeCombatPower.budo },
    { status: "継続", value: safeCombatPower.continuity },
    { status: "知識", value: safeCombatPower.knowledge },
    { status: "身体操作", value: safeCombatPower.bodyControl },
  ];

  const totalPower =
    safeCombatPower.strength +
    safeCombatPower.budo +
    safeCombatPower.continuity +
    safeCombatPower.knowledge +
    safeCombatPower.bodyControl;

  const stats = [
    safeCombatPower.strength,
    safeCombatPower.budo,
    safeCombatPower.continuity,
    safeCombatPower.knowledge,
    safeCombatPower.bodyControl,
  ];

  const maxValue = Math.max(...stats);

  let masterType = "現代サムライ";

  if (maxValue === safeCombatPower.strength) {
    masterType = "剛力武者";
  } else if (maxValue === safeCombatPower.budo) {
    masterType = "剣術家";
  } else if (maxValue === safeCombatPower.continuity) {
    masterType = "求道者";
  } else if (maxValue === safeCombatPower.knowledge) {
    masterType = "軍師";
  } else if (maxValue === safeCombatPower.bodyControl) {
    masterType = "古流の達人";
  }

  const typeDescription = {
    剛力武者: "力で敵を圧する者",
    剣術家: "武芸を極める者",
    求道者: "日々の積み重ねを武器とする者",
    軍師: "知識と戦略で勝つ者",
    古流の達人: "身体操作を極めた者",
    現代サムライ: "総合力に優れた武芸者",
  };

  return (
    <section className="card">
      <h2>館主ステータス</h2>

      <div className="big-rank">{masterType}</div>

      <p>総合戦闘力：{totalPower}</p>

      <p className="hint">
        {typeDescription[masterType]}
      </p>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="52%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid />

            <PolarAngleAxis
              dataKey="status"
              tick={{
                fill: "#93c5fd",
                fontSize: 16,
                fontWeight: "bold",
              }}
            />

            <PolarRadiusAxis
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            <Radar
              name="戦闘力"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="best-record">
        <p>筋力 {safeCombatPower.strength}</p>
        <p>武芸 {safeCombatPower.budo}</p>
        <p>継続 {safeCombatPower.continuity}</p>
        <p>知識 {safeCombatPower.knowledge}</p>
        <p>身体操作 {safeCombatPower.bodyControl}</p>
      </div>

      <p className="hint">
        数値は0〜100。数値は下の一覧で確認。
      </p>
    </section>
  );
}

export default HomeStatusRadar;
