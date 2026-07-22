document.documentElement.classList.add("js");

/*
 * Completa estos datos cuando estén confirmados.
 * El resto de la página se actualiza automáticamente.
 */
const CONFIG = {
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  mapsUrl: "",
  whatsappMessage:
    "Hola, quisiera información sobre los servicios del Centro de Especialidades Motoras.",
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function closeNavigation() {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
  siteNav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("nav-open", willOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

document.querySelectorAll("[data-photo]").forEach((image) => {
  const frame = image.closest("[data-photo-frame]");
  const markLoaded = () => {
    frame?.classList.add("is-loaded");
    frame?.classList.remove("is-missing");
  };
  const markMissing = () => {
    frame?.classList.add("is-missing");
    frame?.classList.remove("is-loaded");
  };

  image.addEventListener("load", markLoaded);
  image.addEventListener("error", markMissing);

  if (image.complete) {
    image.naturalWidth ? markLoaded() : markMissing();
  }
});

function setContact(kind, value, href) {
  const element = document.querySelector(`[data-contact="${kind}"]`);
  if (!element || !value) return;

  element.href = href;
  element.removeAttribute("aria-disabled");
  const valueElement = element.querySelector("[data-contact-value]");
  if (valueElement) valueElement.textContent = value;
}

if (CONFIG.whatsapp) {
  const cleanNumber = CONFIG.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  setContact("whatsapp", CONFIG.whatsapp, whatsappUrl);

  const primaryContact = document.querySelector("#primary-contact");
  if (primaryContact) {
    primaryContact.href = whatsappUrl;
    primaryContact.textContent = "Escribir por WhatsApp";
    primaryContact.target = "_blank";
    primaryContact.rel = "noreferrer";
  }
}

if (CONFIG.phone) setContact("phone", CONFIG.phone, `tel:${CONFIG.phone.replace(/\s/g, "")}`);
if (CONFIG.email) setContact("email", CONFIG.email, `mailto:${CONFIG.email}`);
if (CONFIG.address) setContact("address", CONFIG.address, CONFIG.mapsUrl || "#contacto");

document.querySelectorAll('[aria-disabled="true"]').forEach((element) => {
  element.addEventListener("click", (event) => event.preventDefault());
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    )
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
