
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Heart,
  CalendarDays,
  MapPin,
  Check,
  Sparkles,
} from "lucide-react";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState(0);
  const [attendance, setAttendance] = useState("yes");
  const [guestName, setGuestName] = useState("");
  const [companions, setCompanions] = useState("0");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState("next");
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  const weddingDate = new Date("2027-02-05T00:00:00+01:00").getTime();
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, weddingDate - Date.now()));
  useEffect(() => {
    const updateCountdown = () => setTimeLeft(Math.max(0, weddingDate - Date.now()));
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);
  const days = Math.floor(timeLeft / 86400000);
  const hours = Math.floor((timeLeft % 86400000) / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

const copyIban = async () => {
  const iban = "000600001444992130115";

  try {
    const field = document.createElement("textarea");
    field.value = iban;
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(field);

    if (!copied) throw new Error("Falha ao copiar IBAN");

    setIbanCopied(true);
  } catch (error) {
    console.error("Não foi possível copiar o IBAN", error);
    setIbanCopied(false);
  }
};

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setMusicPlaying(true);
    } catch (error) {
      console.error('Não foi possível iniciar a música:', error);
      setMusicPlaying(false);
    }
  };

  const goTo = (nextScreen) => {
    if (nextScreen < 0 || nextScreen > 4) return;

    setDirection(nextScreen > screen ? "next" : "back");
    setScreen(nextScreen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guestName,
                attendance,
                companions: attendance === 'yes' ? companions : '0',
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Não foi possível enviar a confirmação.');
        }

        setSubmitted(true);

    } catch (error) {
        alert(error.message || 'Erro de ligação ao servidor.');
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <main className="wedding-app">
      <audio ref={audioRef} src="/audio/photograph.mp3" loop preload="auto" />
      <div className="fixed-world">
        <div className="world-photo" />
        <div className="world-shade" />
      </div>

      <div className="screen-indicator">
        <span>IVETH & YOLA</span>
        <span>{String(screen + 1).padStart(2, "0")} / 05</span>
      </div>

      <div className={`screen-stage transition-${direction}`} key={screen}>

        {/* TELA 1 — ABERTURA */}
        {screen === 0 && (
          <section className="wedding-screen entrance-screen">
            <div className="entrance-content">
              <span className="eyebrow">SAVE THE DATE</span>

              <div className="entrance-names">
                <h1>Iveth Jamba Isaac de Almeida</h1>
                <span className="ampersand">&</span>
                <h1>Yola Patrícia Fernandes Carmelino</h1>
              </div>

              <div className="opening-verse">
                <p>“O amor é paciente, o amor é bondoso. Tudo sofre, tudo crê, tudo espera, tudo suporta.”</p>
                <span>1 Coríntios 13:4–7</span>
              </div>

              <button
                className="main-action"
                onClick={() => { startMusic(); goTo(1); }}
              >
                ENTRAR NO CASAMENTO
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* TELA 2 — HISTÓRIA */}
        {screen === 1 && (
          <section className="wedding-screen">
            <div className="story-content">
              <span className="section-kicker">A NOSSA HISTÓRIA</span>
              <Heart className="section-icon" size={30} />

              <h2>
                Há encontros que
                <br />
                mudam tudo.
              </h2>

              <p>
                Entre tantos caminhos possíveis, as nossas vidas
                encontraram-se. E, com o tempo, nasceu uma história
                feita de carinho, cumplicidade e sonhos partilhados.
              </p>

              <p>
                Hoje queremos celebrar esse amor e começar,
                juntos, um novo capítulo.
              </p> 
              <span className="signature">
                Iveth & Yola
              </span>

              <button className="main-action" onClick={() => goTo(2)}>
                CONTINUAR
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* TELA 3 — CONVITE E DETALHES */}
        {screen === 2 && (
          <section className="wedding-screen">
            <div className="story-content details-content">

              <h2>O nosso grande dia</h2>

              <div className="detail-item">
                <CalendarDays size={25} />
                <div>
                  <span>DATAS DAS CERIMÓNIAS</span>
                  <p>4 de fevereiro de 2027 — Casamento tradicional</p><p>4 de fevereiro de 2027 — Casamento civil</p><p>5 de fevereiro de 2027 — Casamento religioso</p>
                </div>
              </div>

              <div className="detail-item">
                <MapPin size={25} />
                <div>
                  <span>LOCAL</span>
                  <p>Benguela</p>
                </div>
              </div>

              <div className="gift-contribution">
                <span className="section-kicker">PRESENTES E CONTRIBUIÇÕES</span>
                <p>Titular: SIMÃO ELAVOKO FERNANDES SAMBONGO</p>
                <p className="iban-number">0006 0000 144 499 213 0 115</p>
                <button type="button" className="copy-iban" onClick={copyIban}>
                  {ibanCopied ? "IBAN COPIADO" : "COPIAR IBAN"}
                </button>
              </div>

              <button className="main-action" onClick={() => goTo(3)}>
                CONFIRMAR PRESENÇA
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* TELA 4 — FORMULÁRIO */}
        {screen === 3 && (
          <section className="wedding-screen rsvp-screen">
            <div className="rsvp-card">
              <span className="section-kicker">
                A TUA PRESENÇA IMPORTA
              </span>

              <h2>A nossa história continuará.</h2>

              <p className="rsvp-intro">
                Confirma a tua presença preenchendo os dados abaixo.
              </p>

              {submitted ? (
                <div className="success-message">
                  <div className="wedding-countdown">
                    <h2>FALTAM PARA O GRANDE DIA</h2>
                    <div className="countdown-grid">
                      <div><strong>{days}</strong><span>DIAS</span></div>
                      <div><strong>{String(hours).padStart(2, "0")}</strong><span>HORAS</span></div>
                      <div><strong>{String(minutes).padStart(2, "0")}</strong><span>MINUTOS</span></div>
                      <div><strong>{String(seconds).padStart(2, "0")}</strong><span>SEGUNDOS</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="guestName">O teu nome</label>
                  <input
                    id="guestName"
                    type="text"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder="Escreve o teu nome"
                    required
                  />

                  <label>Vais estar presente?</label>
                  <div className="attendance-options">
                    <button
                      type="button"
                      className={attendance === "yes" ? "selected" : ""}
                      onClick={() => setAttendance("yes")}
                    >
                      Sim, estarei presente
                    </button>

                    <button
                      type="button"
                      className={attendance === "no" ? "selected" : ""}
                      onClick={() => setAttendance("no")}
                    >
                      Não poderei estar
                    </button>
                  </div>

                  {attendance === "yes" && (
                    <>
                      <label htmlFor="companions">
                        Número de acompanhantes
                      </label>
                      <select
                        id="companions"
                        value={companions}
                        onChange={(event) =>
                          setCompanions(event.target.value)
                        }
                      >
                        <option value="0">Apenas eu</option>
                        <option value="1">1 acompanhante</option>
                      </select>
                    </>
                  )}

                  <div className="official-invitation-notice">
  O convite oficial será entregue em breve.
</div>

                  <button className="submit-rsvp" type="submit">
                    {isSubmitting ? 'A ENVIAR...' : 'ENVIAR CONFIRMAÇÃO'}
                    <Heart size={17} />
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* TELA 5 — ENCERRAMENTO */}
        {screen === 4 && (
          <section className="wedding-screen closing-screen">
            <div className="closing-content">
              <Heart size={34} />

              <span className="section-kicker">
                COM TODO O NOSSO AMOR
              </span>

              <h2>
                A nossa história
                <br />
                continua...
              </h2>

              <p>Iveth & Yola</p>

              <span className="closing-message">
                Obrigado por fazeres parte deste momento.
              </span>

              <button
                className="main-action"
                onClick={() => {
                  setSubmitted(false);
                  goTo(0);
                }}
              >
                VOLTAR AO INÍCIO
                <ArrowDown size={17} />
              </button>
            </div>
          </section>
        )}
      </div>

      {/* NAVEGAÇÃO ENTRE TELAS */}
      {screen > 0 && (
        <button
          className="back-action"
          onClick={() => goTo(screen - 1)}
          aria-label="Voltar à tela anterior"
        >
          <ArrowLeft size={18} />
          VOLTAR
        </button>
      )}
    </main>
  );
}
