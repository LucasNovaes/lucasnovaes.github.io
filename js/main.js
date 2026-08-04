/* ---------------- 3D tilt on the business card ---------------- */

const card = document.getElementById("businessCard");
const stage = card?.closest(".card-stage");
const shadow = document.querySelector(".card-stage__shadow");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (card && stage && finePointer && !reducedMotion) {
    const MAX_TILT = 14;

    stage.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        card.style.transform = `rotateY(${(px - 0.5) * MAX_TILT * 2}deg) rotateX(${(0.5 - py) * MAX_TILT * 2}deg) translateZ(12px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        card.style.setProperty("--sheen-opacity", "1");
        shadow?.style.setProperty("--shadow-scale", `${1 - Math.abs(px - 0.5) * 0.35}`);
    });

    stage.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.setProperty("--sheen-opacity", "0");
        shadow?.style.setProperty("--shadow-scale", "1");
    });
}

/* ---------------- scroll reveal ---------------- */

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(index, 4) * 80}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

revealItems.forEach((item) => observer.observe(item));

/* ---------------- copy email ---------------- */

const copyBtn = document.getElementById("copyEmailBtn");
copyBtn?.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add("is-copied");
        setTimeout(() => copyBtn.classList.remove("is-copied"), 1600);
    } catch {
        window.location.href = `mailto:${email}`;
    }
});

/* ---------------- 3D background ----------------
   Loaded last and dynamically: three.js comes from a CDN, so a network
   failure here must not take the rest of the page down with it. */

const canvas = document.getElementById("scene");
if (canvas) {
    import("./scene.js")
        .then(({ initScene }) => initScene(canvas))
        .catch(() => canvas.remove());
}
