const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const quoteForm = document.querySelector("#quote-form");
const formSuccess = document.querySelector("#form-success");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

if (quoteForm && formSuccess) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formSuccess.hidden = false;
    quoteForm.reset();
    formSuccess.focus?.();
  });
}
