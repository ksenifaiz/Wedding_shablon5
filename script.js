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
        const note = document.getElementById("note"); // если показываешь сообщение

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fd = new FormData(form);

            const payload = {
                name: fd.get("name"),      // input name="name"
                attend: fd.get("attend"),  // radio name="attend"
                drink: fd.get("drink"),    // radio name="drink"
                comment: fd.get("comment") || "" // если есть поле comment
                // website: "" // если используешь honeypot
            };

            try {
                const res = await fetch(SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (!data.ok) throw new Error(data.error || "Unknown error");

                if (note) note.textContent = "Спасибо! Ответ отправлен ✅";
                form.reset();
            } catch (err) {
                if (note) note.textContent = "Ошибка отправки: " + err.message;
                console.error(err);
            }
        });
    });
}