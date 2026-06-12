import { useState } from "react";
import { techniques } from "../data/techniques";

export function useTechniques() {
  const [techniqueLevels, setTechniqueLevels] = useState(() => {
    return JSON.parse(
      localStorage.getItem("techniqueLevels") || "{}"
    );
  });

  const getTechniqueLevel = (id) => {
    return techniqueLevels[id] ?? 0;
  };

  const updateTechniqueLevel = (id, level) => {
    const updated = {
      ...techniqueLevels,
      [id]: level,
    };

    setTechniqueLevels(updated);
    localStorage.setItem(
      "techniqueLevels",
      JSON.stringify(updated)
    );
  };

  const resetTechniques = () => {
    setTechniqueLevels({});
    localStorage.removeItem("techniqueLevels");
  };

  const learnedCount = techniques.filter((technique) => {
    return getTechniqueLevel(technique.id) > 0;
  }).length;

  const masteredCount = techniques.filter((technique) => {
    return getTechniqueLevel(technique.id) >= 3;
  }).length;

  const getTechniquePower = () => {
    return techniques.reduce((sum, technique) => {
      const level = getTechniqueLevel(technique.id);

      if (level === 1) return sum + 1;
      if (level === 2) return sum + 3;
      if (level === 3) return sum + 5;

      return sum;
    }, 0);
  };

  return {
    techniqueLevels,
    getTechniqueLevel,
    updateTechniqueLevel,
    resetTechniques,
    learnedCount,
    masteredCount,
    getTechniquePower,
  };
}