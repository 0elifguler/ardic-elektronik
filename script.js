// main.js
(() => {
  const $ = (s, r=document) => r.querySelector(s);

  // Footer yıl
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobil menü
  const navToggle = $("#navToggle");
  const nav = $("#nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      navToggle.setAttribute("aria-expanded", "false");
    }));
  }

  // Basit form doğrulama + demo mesajı
  function bindForm(formId, noteId, extraCheck) {
    const form = $(formId);
    const note = $(noteId);
    if (!form || !note) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.className = "formNote";
      note.textContent = "";

      const data = new FormData(form);
      const phone = String(data.get("phone") || "").replace(/\s/g, "");

      if (phone.length < 10) {
        note.classList.add("err");
        note.textContent = "Lütfen geçerli bir telefon numarası girin.";
        return;
      }

      if (typeof extraCheck === "function" && !extraCheck(data, note)) return;

      // Buraya n8n webhook ekleyebilirsin:
      // fetch("WEBHOOK_URL", { method:"POST", body: data });

      note.classList.add("ok");
      note.textContent = "Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.";
      form.reset();
    });
  }

  bindForm("#miniForm", "#miniFormNote");
  bindForm("#quoteForm", "#quoteFormNote");
  bindForm("#contactForm", "#contactFormNote", (data, note) => {
    const msg = String(data.get("message") || "").trim();
    if (msg.length < 5) {
      note.classList.add("err");
      note.textContent = "Lütfen mesajınızı yazın.";
      return false;
    }
    return true;
  });

  // Referans slider: butonlarla kaydır + sürükle + ok tuşları
  const track = $("#refTrack");
  const prev = $("#refPrev");
  const next = $("#refNext");

  function scrollByAmount(dir) {
    if (!track) return;
    const amount = Math.max(320, Math.floor(track.clientWidth * 0.75));
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  if (prev) prev.addEventListener("click", () => scrollByAmount(-1));
  if (next) next.addEventListener("click", () => scrollByAmount(1));

  if (track) {
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") scrollByAmount(-1);
      if (e.key === "ArrowRight") scrollByAmount(1);
    });

    let down = false, startX = 0, startScroll = 0;

    track.addEventListener("pointerdown", (e) => {
      down = true;
      track.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startScroll = track.scrollLeft;
    });

    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });

    const stop = () => { down = false; };
    track.addEventListener("pointerup", stop);
    track.addEventListener("pointercancel", stop);
    track.addEventListener("pointerleave", stop);
  }
  
})();
const form = document.getElementById("contactForm");
const note = document.getElementById("contactFormNote");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    note.className = "formNote";
    note.textContent = "";

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) throw new Error();

      note.classList.add("ok");
      note.textContent = "Teşekkürler! Mesajınız başarıyla gönderildi.";
      form.reset();
    } catch {
      note.classList.add("err");
      note.textContent = "Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.";
    }
  });
}
