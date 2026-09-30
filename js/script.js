// nav background on scroll
const nav = document.getElementById("siteNav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
function closeMenu() {
  menuBtn.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-locked");
}
function toggleMenu() {
  const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-locked", !isOpen);
}
menuBtn.addEventListener("click", toggleMenu);
document.getElementById("mobileMenuClose").addEventListener("click", closeMenu);
mobileMenu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    item.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
});

// contact form — submits to Formspree via fetch, then shows the success message without leaving the page
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const formError = document.getElementById("formError");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".form-submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
    if (formError) formError.classList.remove("show");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactForm.classList.add("hide");
        if (formSuccess) formSuccess.classList.add("show");
      } else {
        const raw = await response.text();
        console.warn(
          "Formspree responded with status",
          response.status,
          "— raw response:",
          raw,
        );
        let message = "Form submission failed";
        try {
          const data = JSON.parse(raw);
          if (data && data.errors) {
            message = data.errors.map((er) => er.message).join(", ");
          } else if (data && data.error) {
            message = data.error;
          }
        } catch (_) {
          /* not JSON — raw text already logged above */
        }
        throw new Error(message);
      }
    } catch (err) {
      if (formError) formError.classList.add("show");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send it over →";
      }
    }
  });
}

// reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => io.observe(el));
