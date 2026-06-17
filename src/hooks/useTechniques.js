import { useEffect, useState } from "react";
import { techniques } from "../data/techniques";
import { supabase } from "../lib/supabase";

export function useTechniques() {
  const [techniqueLevels, setTechniqueLevels] = useState(() => {
    return JSON.parse(
      localStorage.getItem("techniqueLevels") || "{}"
    );
  });

  useEffect(() => {
    loadTechniqueLevels();
  }, []);

  const loadTechniqueLevels = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("technique_levels")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log(error.message);
      return;
    }

    const levels = {};

    (data || []).forEach((record) => {
      levels[record.technique_id] = record.level;
    });

    setTechniqueLevels(levels);
    localStorage.setItem(
      "techniqueLevels",
      JSON.stringify(levels)
    );
  };

  const getTechniqueLevel = (id) => {
    return techniqueLevels[id] ?? 0;
  };

  const updateTechniqueLevel = async (id, level) => {
    const updated = {
      ...techniqueLevels,
      [id]: level,
    };

    setTechniqueLevels(updated);
    localStorage.setItem(
      "techniqueLevels",
      JSON.stringify(updated)
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: existing, error: selectError } = await supabase
      .from("technique_levels")
      .select("id")
      .eq("user_id", user.id)
      .eq("technique_id", id)
      .maybeSingle();

    if (selectError) {
      alert(selectError.message);
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from("technique_levels")
        .update({
          level: Number(level),
        })
        .eq("id", existing.id);

      if (error) {
        alert(error.message);
      }

      return;
    }

    const { error } = await supabase
      .from("technique_levels")
      .insert({
        user_id: user.id,
        technique_id: id,
        level: Number(level),
      });

    if (error) {
      alert(error.message);
    }
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