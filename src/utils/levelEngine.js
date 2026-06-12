export function getLevelFromCombatPower(combatPower) {
  const total = combatPower?.total || 0;

  const level = Math.floor(total / 10) + 1;

  const currentXp = total % 10;
  const nextXp = 10;

  return {
    level,
    currentXp,
    nextXp,
    remaining: nextXp - currentXp,
  };
}