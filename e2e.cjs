const { chromium } = require("playwright-core");

const URL = "https://cacarotmaster.github.io/guerrafria-mision/";
const CHROME = "/opt/data/.playwright/chromium-1228/chrome-linux64/chrome";
const NAME = "Karol Prueba";

async function clickByText(page, text, tag = "button") {
  const el = page.locator(`${tag}:text-is("${text}")`).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.click();
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const context = await browser.newContext({
    viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });
  page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url()));

  let pass = 0, fail = 0;
  const check = (name, ok, detail = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} | ${name} ${detail}`); };

  try {
    // 1. Carga
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector("h1", { timeout: 20000 });
    const h1 = await page.locator("h1").innerText();
    check("Carga · título h1 'Guerra Fría'", h1.includes("Guerra Fría"), "→ " + h1);

    // 2. Nombre obligatorio
    const btnDisabled = await page.locator(".btn-green").first().isDisabled();
    check("Botón inicio deshabilitado sin nombre", btnDisabled === true);
    await page.fill(".nameinput", NAME);
    await clickByText(page, "🚀 ¡Empezar aventura!");
    await page.waitForSelector(".mappool", { timeout: 15000 });

    // 3. Mapa: mundo 1 activo, mundo 2 bloqueado
    const activeText = await page.locator(".node.active").innerText();
    check("Mundo 1 activo con ▶", activeText.includes("El Telón de Acero") && activeText.includes("▶"), "→ " + activeText.replace(/\n/g, " ").slice(0, 50));
    const world2 = page.locator(".node", { hasText: "Carrera" });
    const w2text = await world2.innerText();
    check("Mundo 2 bloqueado 🔒 (con nombre visible)", w2text.includes("Bloqueado") && w2text.includes("🔒") && w2text.includes("Carrera"), "→ " + w2text.replace(/\n/g, " ").slice(0, 40));

    // 4. Entrar al mundo 1
    await page.locator(".node.active").click();
    await page.waitForSelector(".worldintro", { timeout: 10000 });
    check("Se abrió mundo 1 (vitrina de 4 actividades)", (await page.locator(".nodeCard").count()) === 4);

    // 5. Abrir actividad 1 = video
    await page.locator(".nodeCard.active").first().click();
    await page.waitForSelector(".mediawrap .scene", { timeout: 10000 });
    const sceneText = await page.locator(".scene").innerText();
    check("Actividad video: escena + título", sceneText.includes("El nacimiento de la Guerra Fría"), "→ " + sceneText.slice(0, 40));
    const continueDisabled = await page.locator(".btn-green:has-text('Continuar')").isDisabled();
    check("'Continuar' bloqueado antes del video", continueDisabled === true);

    // 6. Reproducir y esperar el gate (~30s)
    await page.locator(".playbtn").click();
    await page.waitForFunction(() => {
      const b = [...document.querySelectorAll(".btn-green")].find((x) => x.textContent.includes("Continuar"));
      return b && !b.disabled;
    }, { timeout: 45000 });
    check("'Continuar' se desbloquea tras ver video (gate ~30s)", true);
    await clickByText(page, "Continuar ▶");

    // 7. Responder pregunta del video
    await page.waitForSelector(".qcard", { timeout: 10000 });
    await page.locator(".opt", { hasText: "La división de Europa entre el bloque" }).click();
    await page.waitForSelector(".feedback.ok", { timeout: 8000 });
    check("Video: respuesta correcta +100", (await page.locator(".feedback.ok").innerText()).includes("+100"));
    await clickByText(page, "Completar ✅");

    // 8. Actividad 2 = audio (escuchar)
    await page.waitForSelector(".mediawrap .scene", { timeout: 10000 });
    const audioScene = await page.locator(".scene").innerText();
    check("Actividad audio: escena 🎧", audioScene.includes("Escucha con atención"), "→ " + audioScene.slice(0, 30));
    await page.locator(".playbtn").click();
    await page.waitForFunction(() => {
      const b = [...document.querySelectorAll(".btn-green")].find((x) => x.textContent.includes("Continuar"));
      return b && !b.disabled;
    }, { timeout: 25000 });
    await clickByText(page, "Continuar ▶");
    await page.waitForSelector(".qcard", { timeout: 8000 });
    await page.locator(".opt", { hasText: "El 5 de marzo de 1946, en Fulton" }).click();
    await page.waitForSelector(".feedback.ok", { timeout: 8000 });
    await clickByText(page, "Completar ✅");

    // 9. Actividad 3 = choice (2 preguntas)
    await page.waitForSelector(".qcard", { timeout: 8000 });
    await page.locator(".opt", { hasText: "El bloque capitalista" }).click();
    await page.waitForSelector(".feedback.ok", { timeout: 8000 });
    await clickByText(page, "Siguiente ▶");
    await page.locator(".opt", { hasText: "OTAN" }).click();
    await page.waitForSelector(".feedback.ok", { timeout: 8000 });
    await clickByText(page, "Completar ✅");

    // 10. Actividad 4 = true/falso
    await page.waitForSelector(".qcard", { timeout: 8000 });
    await page.locator(".opt", { hasText: "Falso" }).last().click();
    await page.waitForSelector(".feedback.ok", { timeout: 8000 });
    await clickByText(page, "Completar ✅");

    // 11. Celebración mundo 1
    await page.waitForSelector(".celebrate", { timeout: 8000 });
    const cel = await page.locator(".celebrate").innerText();
    check("Mundo 1 completado (celebración) + XP", cel.includes("Mundo completado") && cel.includes("500 XP"), "→ " + cel.replace(/\n/g, " ").slice(0, 60));

    // 12. Volver al mapa → mundo 2 desbloqueado
    await clickByText(page, "Continuar ▶");
    await page.waitForSelector(".mappool", { timeout: 8000 });
    const world2now = await page.locator(".node", { hasText: "Carrera" }).innerText();
    check("Mundo 2 ahora desbloqueado (activo ▶)", world2now.includes("▶") && !world2now.includes("Bloqueado"), "→ " + world2now.replace(/\n/g, " ").slice(0, 40));
    const w1now = await page.locator(".node", { hasText: "Telón" }).innerText();
    check("Mundo 1 marcado como completado 🏆", w1now.includes("Completado"), "→ " + w1now.replace(/\n/g, " ").slice(0, 30));

    // 13. Reporte final via progreso sembrado (7 mundos completos)
    const full = { hearts: 3, worldScores: [500, 500, 500, 500, 500, 500, 500], completedWorlds: [true, true, true, true, true, true, true], activityIdx: [4, 4, 4, 4, 4, 4, 4], correct: 30, answered: 35 };
    await page.evaluate(([n, p]) => localStorage.setItem("gf_" + n, JSON.stringify(p)), [NAME, full]);
    await page.reload({ waitUntil: "networkidle" });
    await page.fill(".nameinput", NAME);
    await clickByText(page, "▶ Continuar mi misión");
    await page.waitForSelector(".mappool", { timeout: 10000 });
    await clickByText(page, "🏆 Ver mi desempeño");
    await page.waitForSelector(".report", { timeout: 10000 });
    const rep = await page.locator(".report").innerText();
    check("Reporte final: nombre del estudiante", rep.includes(NAME));
    check("Reporte final: 7/7 mundos + puntaje 3500", rep.includes("7 / 7") && rep.includes("3500"), "→ " + rep.replace(/\n/g, " ").slice(0, 80));
    check("Reporte final: medalla LEYENDA", rep.includes("LEYENDA") || rep.includes("MEDALLA"));

  } catch (e) {
    fail++;
    console.log("FAIL | excepción: " + e.message);
  }

  console.log("\n=== RESUMEN: " + pass + " pasan, " + fail + " fallan ===");
  if (errors.length) { console.log("\nERRORES DEL NAVEGADOR:"); errors.slice(0, 12).forEach((e) => console.log("  " + e)); }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
