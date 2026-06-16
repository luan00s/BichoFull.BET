import { useEffect, useState } from "react";

const API = "http://localhost:3000";

function Historico({ setTela }) {
  const nomeUsuario = localStorage.getItem("nome") || "usuário";
  const token       = localStorage.getItem("token");

  const [saldo,    setSaldo]    = useState(Number(localStorage.getItem("saldo") || 1000));
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function buscarDados() {
      try {
        // Histórico de apostas (com JOIN nos sorteios via backend)
        const resH = await fetch(`${API}/historico`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataH = await resH.json();
        if (resH.ok) setHistorico(dataH);

        // Saldo atualizado
        const resS = await fetch(`${API}/saldo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataS = await resS.json();
        if (resS.ok) {
          setSaldo(Number(dataS.saldo));
          localStorage.setItem("saldo", String(dataS.saldo));
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    if (token) buscarDados();
  }, [token]);

  // Cor/label do resultado por status
  function labelResultado(item) {
    if (item.status === "pendente") return "⏳ Pendente";
    if (item.resultado === "GANHOU") return "🏆 GANHOU";
    return "❌ PERDEU";
  }

  return (
    <div className="dash-page">
      <header className="dash-top historico-top">
        <div className="dash-brand">
          <div className="dash-avatar">👤</div>
          <div className="dash-user-block">
            <div className="dash-user">olá, {nomeUsuario}</div>
            <div className="dash-balance">R$ {saldo.toFixed(2)}</div>
          </div>
        </div>

        <div className="historico-top-actions">
          <button onClick={() => setTela("dashboard")}>VOLTAR</button>
        </div>
      </header>

      <div className="historico-layout">

        {/* ── Apostas ── */}
        <div className="historico-box historico-apostas">
          <div className="historico-header">
            <h3>HISTÓRICO DE APOSTAS</h3>
          </div>
          <div className="historico-content">
            {historico.length > 0 ? (
              historico.map((item) => (
                <div key={item.id} className="historico-item">
                  <span>{new Date(item.criado_em).toLocaleDateString("pt-BR")}</span>
                  <span>{item.tipo_aposta}</span>
                  <span>R$ {Number(item.valor).toFixed(2)}</span>
                  <span>{labelResultado(item)}</span>
                </div>
              ))
            ) : (
              <div className="historico-empty">Nenhuma aposta registrada.</div>
            )}
          </div>
        </div>

        {/* ── Sorteios vinculados ── */}
        <div className="historico-box historico-side">
          <div className="historico-header">
            <h3>HISTÓRICO DE SORTEIOS</h3>
          </div>
          <div className="historico-content">
            {historico.filter(i => i.status === "processada").length > 0 ? (
              historico
                .filter((item) => item.status === "processada")
                .map((item) => (
                  <div key={`s-${item.id}`} className="historico-item">
                    <span>{item.premio_1 || "-"}</span>
                    <span>{item.premio_2 || "-"}</span>
                    <span>{item.premio_3 || "-"}</span>
                    <span>{item.premio_4 || "-"}</span>
                  </div>
                ))
            ) : (
              <div className="historico-empty">Nenhum sorteio registrado.</div>
            )}
          </div>
        </div>

        {/* ── Detalhes ── */}
        <div className="historico-box historico-bottom">
          <div className="historico-header">
            <h3>DETALHES DAS APOSTAS</h3>
          </div>
          <div className="historico-content">
            {historico.length > 0 ? (
              historico.map((item) => (
                <div key={`d-${item.id}`} className="historico-item">
                  <span>Animal: {item.animal ?? "-"}</span>
                  <span>Dezena: {item.dezena ?? "-"}</span>
                  <span>Milhar: {item.milhar ?? "-"}</span>
                  <span>
                    Ganho: R${" "}
                    {item.status === "pendente"
                      ? "0,00"
                      : Number(item.valor_ganho || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="historico-empty">Nenhum detalhe disponível.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Historico;
