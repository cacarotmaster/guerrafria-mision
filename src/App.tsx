import { useState, useEffect, useRef, Fragment } from "react";
import {
  WORLDS, World, Activity, POINTS_PER_QUESTION, START_HEARTS, MAX_SCORE,
  medalFor, accuracyMessage,
} from "./game/data";

const BASE = import.meta.env.BASE_URL; // "/guerrafria/"

interface Progress {
  hearts: number;
  worldScores: number[];
  completedWorlds: boolean[];
  activityIdx: number[];
  correct: number;
  answered: number;
}

const LEN = WORLDS.length;
function freshProgress(): Progress {
  return {
    hearts: START_HEARTS,
    worldScores: new Array(LEN).fill(0),
    completedWorlds: new Array(LEN).fill(false),
    activityIdx: new Array(LEN).fill(0),
    correct: 0,
    answered: 0,
  };
}

function loadProgress(name: string): Progress | null {
  try {
    const raw = localStorage.getItem("gf_" + name);
    if (!raw) return null;
    const p = JSON.parse(raw) as Progress;
    if (!p.worldScores || p.worldScores.length !== LEN) return null;
    return p;
  } catch {
    return null;
  }
}
function saveProgress(name: string, p: Progress) {
  try { localStorage.setItem("gf_" + name, JSON.stringify(p)); } catch { /* ignore */ }
}

type Screen = "start" | "map" | "world" | "activity" | "worldComplete" | "final";

const LETTERS = ["A", "B", "C", "D"];

export default function App() {
  const [name, setName] = useState("");
  const [screen, setScreen] = useState<Screen>("start");
  const [progress, setProgress] = useState<Progress>(freshProgress());
  const [curWorld, setCurWorld] = useState(0); // índice del mundo abierto
  const [curAct, setCurAct] = useState(0); // índice de la actividad jugada
  const [lastEarned, setLastEarned] = useState(0);
  const [fromResume, setFromResume] = useState(false);

  const activeWorld = progress.completedWorlds.findIndex((c) => !c);

  function begin(nameVal: string) {
    const saved = loadProgress(nameVal);
    setFromResume(!!saved);
    setProgress(saved ?? freshProgress());
    setScreen("map");
  }

  function update(next: Partial<Progress>) {
    setProgress((prev) => {
      const merged = { ...prev, ...next };
      saveProgress(name, merged);
      return merged;
    });
  }

  function handleAnswered(correct: boolean) {
    update({
      correct: progress.correct + (correct ? 1 : 0),
      answered: progress.answered + 1,
      hearts: correct ? progress.hearts : Math.max(0, progress.hearts - 1),
      worldScores: progress.worldScores.map((s, i) =>
        i === curWorld ? s + (correct ? POINTS_PER_QUESTION : 0) : s
      ),
    });
  }

  function handleActivityComplete() {
    const idx = curAct;
    update({ activityIdx: progress.activityIdx.map((a, i) => (i === curWorld ? a + 1 : a)) });
    const lastAct = WORLDS[curWorld].activities.length - 1;
    if (idx >= lastAct) {
      // mundo completado
      update({
        completedWorlds: progress.completedWorlds.map((c, i) => (i === curWorld ? true : c)),
      });
      setScreen("worldComplete");
    } else {
      setScreen("world");
    }
  }

  function recharge() {
    update({ hearts: START_HEARTS });
  }

  // ---------- Inicio ----------
  if (screen === "start") {
    return (
      <div className="app">
        <div className="start">
          <div className="biglogo">🧊🕶️</div>
          <h1>Guerra Fría</h1>
          <div className="sub">La Gran Misión · Recorre 7 mundos, derriba el Telón de Acero y llega al fin de la Guerra Fría.</div>
          <div>
            <div className="inputlabel">✍️ Escribe tu nombre para empezar:</div>
            <input
              className="nameinput"
              value={name}
              maxLength={40}
              placeholder="Tu nombre…"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && begin(name.trim())}
            />
          </div>
          <button className="btn btn-green" disabled={!name.trim()} onClick={() => begin(name.trim())}>
            {loadProgress(name.trim()) ? "▶ Continuar mi misión" : "🚀 ¡Empezar aventura!"}
          </button>
          <div className="worldsPill">
            {WORLDS.map((w) => (
              <span key={w.id} className={progress.completedWorlds[w.id] && false ? "on" : ""}>{w.emoji}</span>
            ))}
          </div>
          <div className="fineprint">📱 Funciona en celular, tableta y computador · 🎧 usa audífonos · 💯 gana puntos y desbloquea los 7 mundos</div>
        </div>
      </div>
    );
  }

  // ---------- Mapa ----------
  if (screen === "map") {
    return (
      <div className="app">
        <Header progress={progress} name={name} onRecharge={recharge} />
        <div className="mappool">
          {WORLDS.map((w, i) => {
            const done = progress.completedWorlds[i];
            const isActive = i === activeWorld;
            const locked = !done && !isActive;
            return (
              <Fragment key={w.id}>
                {i > 0 && <div className={"connector " + (progress.completedWorlds[i - 1] ? "on" : "")} />}
                <div
                  className={"node " + (done ? "done" : locked ? "locked" : "active")}
                  style={{ background: locked ? undefined : w.gradient }}
                  onClick={() => {
                    if (!locked) {
                      setCurWorld(i);
                      setCurAct(progress.activityIdx[i]);
                      setScreen("world");
                    }
                  }}
                >
                  <div className="big">{locked ? "🔒" : done ? "🏆" : w.emoji}</div>
                  <div className="info">
                    <div className="nname">{locked ? "🔒 Bloqueado" : w.name}</div>
                    <div className="ndate">{done ? "¡Completado!" : w.date + " · " + w.tagline}</div>
                  </div>
                  <div className="badge">{done ? "✅" : isActive ? "▶" : ""}</div>
                </div>
              </Fragment>
            );
          })}
          <button className="btn btn-purple" style={{ marginTop: 18, width: "78%", maxWidth: 380 }}
            onClick={() => activeWorld >= LEN && setScreen("final")}>
            {activeWorld >= LEN ? "🏆 Ver mi desempeño" : "Mapa · Desbloquea los 7 mundos"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Mundo (vitrina de actividades) ----------
  if (screen === "world") {
    const w = WORLDS[curWorld];
    return (
      <div className="app">
        <Header progress={progress} name={name} onRecharge={recharge} />
        <button className="btn btn-ghost" style={{ marginBottom: 14 }} onClick={() => setScreen("map")}>← Volver al mapa</button>
        <div className="worldintro">
          <div className="whero" style={{ background: w.gradient }}>
            <div className="big">{w.emoji}</div>
            <h2>{w.name}</h2>
            <div className="date">📅 {w.date}</div>
            <p>{w.summary}</p>
          </div>
          <div className="nodeRow">
            {w.activities.map((a, i) => {
              const done = i < progress.activityIdx[curWorld];
              const isActive = i === progress.activityIdx[curWorld];
              return (
                <button
                  key={a.id}
                  className={"nodeCard " + (done ? "done" : isActive ? "active" : "locked")}
                  disabled={!isActive}
                  onClick={() => { setCurAct(i); setScreen("activity"); }}
                >
                  <span className="ic">{done ? "✅" : a.kind === "video" ? "🎬" : a.kind === "listen" ? "🎧" : a.kind === "tf" ? "⚖️" : "🧠"}</span>
                  <span className="tt">{a.title}</span>
                  <span className="ic">{isActive ? "▶" : done ? "✔" : "🔒"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Actividad ----------
  if (screen === "activity") {
    const w = WORLDS[curWorld];
    const a = w.activities[curAct];
    return (
      <div className="app">
        <ActivityView
          world={w}
          activity={a}
          onExit={() => setScreen("world")}
          onAnswered={handleAnswered}
          onComplete={handleActivityComplete}
        />
      </div>
    );
  }

  // ---------- Mundo completado ----------
  if (screen === "worldComplete") {
    const w = WORLDS[curWorld];
    const earned = progress.worldScores[curWorld];
    return (
      <div className="app">
        <div className="celebrate">
          <div className="big">{w.emoji}</div>
          <h2>¡Mundo completado!</h2>
          <div className="confetti">🎉✨🎊</div>
          <div className="xp">⭐ {earned} XP</div>
          <p style={{ fontWeight: 800, marginTop: 18 }}>
            {curWorld + 1 < LEN
              ? `¡Genial! Desbloqueaste el siguiente mundo: ${WORLDS[curWorld + 1].emoji} ${WORLDS[curWorld + 1].name}`
              : "🏆 ¡Completaste los 7 mundos de la Guerra Fría!"}
          </p>
          <button
            className="btn btn-green"
            style={{ marginTop: 10 }}
            onClick={() =>
              curWorld + 1 < LEN
                ? (setCurWorld(curWorld + 1), setCurAct(0), setScreen("map"))
                : setScreen("final")
            }
          >
            {curWorld + 1 < LEN ? "Continuar ▶" : "🎖️ Ver mi Reporte de Desempeño"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Reporte final ----------
  if (screen === "final") {
    const total = progress.worldScores.reduce((a, b) => a + b, 0);
    const medal = medalFor(total);
    const pct = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;
    const completedCount = progress.completedWorlds.filter(Boolean).length;
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
    return (
      <div className="app">
        <div className="report">
          <div className="medal">{medal.emoji}</div>
          <h2>Reporte de Desempeño</h2>
          <div className="medalname" style={{ background: medal.color }}>
            MEDALLA {medal.name}
          </div>
          <div>
            <div className="bigscore">{total}</div>
            <div className="of">de {MAX_SCORE} puntos posibles</div>
          </div>
          <div className="reportcard">
            <h3>👤 Datos del estudiante</h3>
            <div className="refline">Nombre: <b>{name}</b></div>
            <div className="refline">Fecha: <b>{fecha}</b></div>
            <div className="refline">Mundos completados: <b>{completedCount} / 7</b></div>
            <div className="refline">Precisión: <b>{pct}%</b> ({progress.correct}/{progress.answered} aciertos)</div>
            <div className="refline">Corazones restantes: <b>{progress.hearts} ❤️</b></div>
          </div>
          <div className="reportcard">
            <h3>🌍 Progreso por mundo</h3>
            {WORLDS.map((w, i) => {
              const sc = progress.worldScores[i];
              const max = w.activities.reduce((a, x) => a + x.questions.length, 0) * POINTS_PER_QUESTION;
              const p = Math.round((sc / max || 0) * 100);
              return (
                <div className="worldbarrow" key={w.id}>
                  <span className="e">{w.emoji}</span>
                  <span className="nm">{progress.completedWorlds[i] ? "✔" : ""} {w.name}</span>
                  <span className="bar"><span className="fill" style={{ width: p + "%" }} /></span>
                  <span className="sc">{sc}</span>
                </div>
              );
            })}
          </div>
          <div className="reportcard">
            <h3>💬 Tu desempeño</h3>
            <p className="refline">{accuracyMessage(pct)}</p>
          </div>
          <button
            className="btn btn-purple"
            onClick={() => {
              setProgress(freshProgress());
              saveProgress(name, freshProgress());
              setScreen("map");
            }}
          >
            🔁 Jugar de nuevo
          </button>
          <div className="fineprint">📸 Toma una captura de pantalla de este reporte y compártela con tu docente para tu evaluación.</div>
        </div>
      </div>
    );
  }

  return null;
}

function Header({ progress, name, onRecharge }: { progress: Progress; name: string; onRecharge: () => void }) {
  const total = progress.worldScores.reduce((a, b) => a + b, 0);
  return (
    <div className="header">
      <div className="logo">🧊🌍</div>
      <div className="name">
        {name}
        <small>Misión Guerra Fría</small>
      </div>
      <div className="stats">
        <div className="stat" onClick={onRecharge} style={{ cursor: "pointer" }} title="Toca para recargar">❤️ {progress.hearts}</div>
        <div className="stat">⭐ {total}</div>
      </div>
    </div>
  );
}

// ---------- Vista de actividad (media + preguntas) ----------
function ActivityView({
  world, activity, onExit, onAnswered, onComplete,
}: {
  world: World;
  activity: Activity;
  onExit: () => void;
  onAnswered: (correct: boolean) => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"media" | "q">(activity.media ? "media" : "q");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  // estado multimedia
  const [played, setPlayed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const media = activity.media;
  const mediaDone = media ? played && elapsed >= media.gateSeconds : true;

  // crear audio y temporizador para fase media
  useEffect(() => {
    if (phase !== "media" || !media) return;
    const audio = new Audio(BASE + media.src);
    audioRef.current = audio;
    audio.addEventListener("playing", () => setPlayed(true));
    audio.addEventListener("ended", () => audioRef.current && (audioRef.current.currentTime = 0));
    const iv = setInterval(() => {
      setElapsed((e) => Math.min(e + 1, media.gateSeconds * 2));
    }, 1000);
    return () => { clearInterval(iv); audio.pause(); audioRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play().catch(() => setPlayed(true)); setPlayed(true); }
    else a.pause();
  }

  const totalQ = activity.questions.length;
  const q = activity.questions[qIndex];
  const isCorrect = selected === q.answer;
  const progressPct = Math.min(100, Math.round((elapsed / media!.gateSeconds) * 100));

  function next() {
    if (qIndex + 1 < totalQ) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setLocked(false);
    } else {
      onComplete();
    }
  }

  function pick(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    onAnswered(i === q.answer);
  }

  // -------- Fase media (video / audio) --------
  if (phase === "media" && media) {
    return (
      <>
        <div className="topbar">
          <button className="back" onClick={onExit}>←</button>
          <div className="progressdots">
            {Array.from({ length: totalQ }).map((_, i) => (
              <div key={i} className={"dot " + (i <= qIndex ? "fill" : "")} />
            ))}
          </div>
        </div>
        <div className="mediawrap">
          <div className="scene" style={{ background: world.gradient }}>
            {world.deco.map((d, i) => (
              <span key={i} className={"deco d" + (i + 1)}>{d}</span>
            ))}
            <div className="wtitle">{media.sceneTitle}</div>
            <div className="wemoji">{media.kind === "video" ? world.emoji : "🎧"}</div>
            {media.caption && <div className="caption">{media.caption}</div>}
          </div>
          <div className="audioPlayerWrap">
            <div className="audioRow">
              <button className="playbtn" onClick={togglePlay}>{audioRef.current && !audioRef.current.paused ? "⏸" : "▶"}</button>
              <div className="wave">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className={"bar " + (played ? "run" : "")} style={{ animationDelay: i * 0.07 + "s" }} />
                ))}
              </div>
              <div className="timer">{Math.min(elapsed, media.gateSeconds)}/{media.gateSeconds}s</div>
            </div>
            <div className="progressbar"><div className="fill" style={{ width: progressPct + "%" }} /></div>
            <div className="gateinfo">
              {media.kind === "video"
                ? "🎬 Mira y escucha el video completo para desbloquear la pregunta."
                : "🎧 Escucha el audio completo para desbloquear la pregunta."}
              {!played && " (toca ▶ para reproducir)"}
            </div>
            <button
              className="btn btn-green"
              style={{ marginTop: 12 }}
              disabled={!mediaDone}
              onClick={() => setPhase("q")}
            >
              {mediaDone ? "Continuar ▶" : "🔒 " + (played ? "Escucha/video…" : "Reproduce el video/audio…")}
            </button>
          </div>
        </div>
      </>
    );
  }

  // -------- Fase de preguntas --------
  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onExit}>←</button>
        <div className="progressdots">
          {Array.from({ length: totalQ }).map((_, i) => (
            <div key={i} className={"dot " + (i <= qIndex ? "fill" : "")} />
          ))}
        </div>
      </div>
      <div className="acttitle">{qIndex === 0 ? activity.title : "Pregunta " + (qIndex + 1)}</div>
      <div className="qcard">
        <div className="qtext">{q.text}</div>
        <div className="opts">
          {q.options.map((op, i) => {
            let cls = "opt";
            if (locked) {
              if (i === q.answer) cls += " correct";
              else if (i === selected) cls += " wrong";
            } else if (selected === i) {
              cls += " selected";
            }
            return (
              <button key={i} className={cls} disabled={locked} onClick={() => pick(i)}>
                <span className="letter">{LETTERS[i]}</span>
                <span>{op}</span>
              </button>
            );
          })}
        </div>
        {locked && (
          <div className={"feedback " + (isCorrect ? "ok" : "bad")}>
            {isCorrect ? "🎉 ¡Correcto! +" + POINTS_PER_QUESTION + " pts" : "❌ ¡Uy! Se te escapó un corazón 🥺"}
            <div style={{ marginTop: 8 }}>{activity.explain}</div>
            <button className={"btn " + (isCorrect ? "btn-green" : "btn-blue")} onClick={next}>
              {qIndex + 1 < totalQ ? "Siguiente ▶" : "Completar ✅"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
