import { useState } from "react";

const API = "http://localhost:3000";

function Login({ setTela }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function login() {
    if (!email || !senha) {
      alert("Preencha email e senha");
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("nome",     data.usuario?.nome  || "usuário");
        localStorage.setItem("email",    data.usuario?.email || email);
        localStorage.setItem("saldo",    String(data.usuario?.saldo ?? 1000));
        localStorage.setItem("is_admin", String(data.usuario?.is_admin || false));

        window.location.reload();
      } else {
        alert(data.erro || "Login inválido");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <h1 className="auth-logo">
            BICHOFULL.<span>BET</span>
          </h1>
        </div>

        <div className="auth-box">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="SENHA"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button onClick={login}>CONECTE-SE</button>

          <p className="auth-link-text">
            Não tem conta?{" "}
            <span onClick={() => setTela("cadastro")}>CADASTRAR</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
