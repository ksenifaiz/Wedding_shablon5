if (window.__guestFormInit) {
  console.log("guestForm already initialized");
} else {
  window.__guestFormInit = true;
  // дальше весь твой код
}
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

const form = document.getElementById("guestForm");
const note = document.getElementById("note");
const btn = form.querySelector('button[type="submit"]');

let sending = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (sending) return;     // ✅ не даст отправить 2-3 раза
  sending = true;
  btn.disabled = true;

  const fd = new FormData(form);

  // ⚠️ добавляем requestId для защиты на сервере
  const payload = {
    requestId: ${Date.now()}_${Math.random().toString(16).slice(2)},
    name: (fd.get("name") || "").trim(),
    attend: (fd.get("attend") || "").trim(),
    drink: (fd.get("drink") || "").trim(),
  };

  note.textContent = "Отправляю...";

  try {
    // (ниже будет спец-версия для телефона)
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok  data.ok === false) throw new Error(data.error  "Ошибка");

    note.textContent = "Спасибо! Ответ отправлен ✅";
    form.reset();
  } catch (err) {
    console.error(err);
    note.textContent = "Ошибка отправки: " + err.message;
  } finally {
    sending = false;
    btn.disabled = false;
  }
});
    });

}


