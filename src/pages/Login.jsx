import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");

  const login = async () => {
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("ログイン用メールを送信しました");
  };

  return (
    <main>
      <section className="card hero">
        <h2>SHU・HA・RI Login</h2>
        <p className="hint">Learn. Adapt. Transcend.</p>
        <p className="hint">
          メールアドレスにログインリンクを送ります。
        </p>
      </section>

      <section className="card">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="primary" onClick={login}>
          ログインメール送信
        </button>
      </section>
    </main>
  );
}

export default Login;
