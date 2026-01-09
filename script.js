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

       
document.getElementById("guestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(e.target);

  const payload = {
    name: fd.get("name") || "",
    attend: fd.get("attend") || "",
    drink: fd.get("drink") || "",
    comment: fd.get("comment") || "",
    website: fd.get("website") || "" // если есть honeypot
  };

  const note = document.getElementById("note");

  try {
    if (note) note.textContent = "Отправляю...";

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      // ВАЖНО: text/plain — чтобы Safari НЕ делал preflight
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch(e) {}

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `HTTP ${res.status}: ${text}`);
    }

    if (note) note.textContent = "Спасибо! Ответ отправлен ✅";
    e.target.reset();
  } catch (err) {
    console.error(err);
    if (note) note.textContent = "Ошибка отправки: " + err.message;
  }
});
    });

}
