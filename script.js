const form = document.getElementById("guestForm");
const note = document.getElementById("note");

if (form && note) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const name = (fd.get("name") || "").toString().trim();
        const attend = (fd.get("attend") || "").toString().trim();
        const drink = (fd.get("drink") || "").toString().trim();

        if (!name || !attend) {
            note.textContent = "Заполните имя и отметьте присутствие.";
            return;
        }

        // Тут позже подключим отправку в Telegram / Google Apps Script
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4ybFL9dW-QsZj3_XLz21iKxdx11VjNcMCObnTcoQc9f2N9SfxOZ8RA-o0SbuteVkuwQ/exec";

const SCRIPT_URL = "ВСТАВЬ_ТВОЙ_WEB_APP_URL"; // .../exec

const form = document.getElementById("guestForm");
const note = document.getElementById("note");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(form);

  const payload = {
    name: (fd.get("name") || "").toString().trim(),
    attend: (fd.get("attend") || "").toString().trim(),
    drink: (fd.get("drink") || "").toString().trim(),
    // website: "" // если добавишь honeypot
  };

  if (!payload.name || !payload.attend) {
    note.textContent = "Заполните имя и отметьте присутствие.";
    return;
  }

  try {
    note.textContent = "Отправляю...";

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // ✅ без preflight на iOS
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch (e) {}

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `HTTP ${res.status}: ${text}`);
    }

    note.textContent = "Спасибо! Ответ отправлен ✅";
    form.reset();
  } catch (err) {
    console.error(err);
    note.textContent = "Ошибка отправки: " + err.message;
  }
});
    });

}

