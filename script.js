(() => {
  // ✅ Вставь сюда ПОЛНЫЙ URL веб-приложения Apps Script (Deploy -> Web app -> .../exec)
  // Пример: https://script.google.com/macros/s/AKfycbxxxxxxx/exec
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4ybFL9dW-QsZj3_XLz21iKxdx11VjNcMCObnTcoQc9f2N9SfxOZ8RA-o0SbuteVkuwQ/exec";

  const form = document.getElementById("guestForm");
  const note = document.getElementById("note");

  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

  // ✅ защита от повторного навешивания обработчика (если скрипт подключён 2 раза)
  if (form.dataset.bound === "1") return;
  form.dataset.bound = "1";

  function makeRequestId() {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function showMessage(msg, ok = true) {
    if (!note) return;
    note.textContent = msg;
    note.style.color = ok ? "#2e7d32" : "#c62828";
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.style.opacity = isLoading ? "0.7" : "";
    submitBtn.style.pointerEvents = isLoading ? "none" : "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ защита от двойного клика / повторной отправки
    if (form.dataset.sending === "1") return;
    form.dataset.sending = "1";
    setLoading(true);

    try {
      if (!SCRIPT_URL || SCRIPT_URL.includes("PASTE_YOUR_WEBAPP_URL_HERE")) {
        showMessage("Ошибка: не указан SCRIPT_URL (вставь ссылку /exec из Apps Script).", false);
        return;
      }

      const fd = new FormData(form);

      const payload = {
        name: (fd.get("name") || "").toString().trim(),
        attend: (fd.get("attend") || "").toString().trim(),
        drink: (fd.get("drink") || "").toString().trim(),
        comment: (fd.get("comment") || "").toString().trim(),
        requestId: makeRequestId(),
        // honeypot если есть скрытое поле website (можно не добавлять в HTML — это не мешает)
        website: (fd.get("website") || "").toString().trim(),
      };

      if (!payload.name || !payload.attend) {
        showMessage("Заполни имя и выбери присутствие.", false);
        return;
      }

      showMessage("Отправляю...");

      // ✅ ВАЖНО для телефона (Safari/iOS): text/plain => без preflight OPTIONS
      const resp = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const raw = await resp.text();

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Сервер вернул не JSON: " + raw);
      }

      if (!resp.ok || !data.ok) {
        throw new Error(data?.error || `HTTP ${resp.status}`);
      }

      showMessage("Спасибо! Ответ отправлен ✅");
      form.reset();
    } catch (err) {
      console.error(err);
      showMessage("Ошибка отправки: " + (err?.message || err), false);
    } finally {
      form.dataset.sending = "0";
      setLoading(false);
    }
  });
})();




