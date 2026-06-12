export function getCombatPower({
  overallScore,
  martialXp,
  trainingStreak,
  journalRecords,
  bodyRecords,
  stepRecords,
  techniquePower,
}) {
  const strength = Math.round(overallScore || 0);

  const budo = Math.min(
    100,
    Math.round((martialXp || 0) / 10)+
        Math.round((techniquePower || 0) / 2)
  );

  const bestSteps = Math.max(
    0,
    ...(stepRecords || []).map((record) =>
      Number(record.steps || 0)
    )
  );

  let stepBonus = 0;

  if (bestSteps >= 20000) stepBonus = 10;
  else if (bestSteps >= 15000) stepBonus = 8;
  else if (bestSteps >= 10000) stepBonus = 5;
  else if (bestSteps >= 5000) stepBonus = 2;

  const continuity = Math.min(
    100,
    Math.round((trainingStreak || 0) * 5) + stepBonus
  );

  const knowledge = Math.min(
    100,
    (journalRecords || []).length * 5
  );

  const bodyControl = Math.min(
    100,
    (bodyRecords || []).length * 3
  );

  const total =
    strength +
    budo +
    continuity +
    knowledge +
    bodyControl;

  return {
    strength,
    budo,
    continuity,
    knowledge,
    bodyControl,
    stepBonus,
    techniquePower,
    total,
    
  };
}