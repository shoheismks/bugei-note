import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useProfile() {
  const [profile, setProfile] = useState({
    dojo_name: localStorage.getItem("dojo_name") || "下越翔平",
    title: localStorage.getItem("selectedTitle") || "現代サムライ",
    martial_style: localStorage.getItem("martial_style") || "",
    bio: localStorage.getItem("bio") || "",
    avatar_url: localStorage.getItem("avatar_url") || "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.log(error.message);
      return;
    }

    if (!data) return;

    setProfile({
      dojo_name: data.dojo_name || "下越翔平",
      title: data.title || "現代サムライ",
      martial_style: data.martial_style || "",
      bio: data.bio || "",
      avatar_url: data.avatar_url || "",
    });

    localStorage.setItem("dojo_name", data.dojo_name || "下越翔平");
    localStorage.setItem("selectedTitle", data.title || "現代サムライ");
    localStorage.setItem("martial_style", data.martial_style || "");
    localStorage.setItem("bio", data.bio || "");
    localStorage.setItem("avatar_url", data.avatar_url || "");
  };

  const saveProfile = async (newProfile) => {
    setProfile(newProfile);

    localStorage.setItem("dojo_name", newProfile.dojo_name || "");
    localStorage.setItem("selectedTitle", newProfile.title || "");
    localStorage.setItem("martial_style", newProfile.martial_style || "");
    localStorage.setItem("bio", newProfile.bio || "");
    localStorage.setItem("avatar_url", newProfile.avatar_url || "");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: existing, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (selectError) {
      alert(selectError.message);
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from("profiles")
        .update({
          dojo_name: newProfile.dojo_name,
          title: newProfile.title,
          martial_style: newProfile.martial_style,
          bio: newProfile.bio,
          avatar_url: newProfile.avatar_url,
        })
        .eq("id", existing.id);

      if (error) alert(error.message);
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      dojo_name: newProfile.dojo_name,
      title: newProfile.title,
      martial_style: newProfile.martial_style,
      bio: newProfile.bio,
      avatar_url: newProfile.avatar_url,
    });

    if (error) alert(error.message);
  };

  return {
    profile,
    setProfile,
    saveProfile,
  };
}