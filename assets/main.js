const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });
}

document.querySelectorAll("[data-quote-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const lines = [
      "Hi Clarity Window Washing,",
      "",
      "I would like a quote.",
      "",
      `Stories: ${data.get("stories") || "Not supplied"}`,
      `Bedrooms: ${data.get("bedrooms") || "Not supplied"}`,
      `Cleaning type: ${data.get("cleaning") || "Not supplied"}`,
      `Name: ${data.get("name") || "Not supplied"}`,
      `Phone: ${data.get("phone") || "Not supplied"}`,
      `Address: ${data.get("address") || "Not supplied"}`,
      `Timing: ${data.get("timing") || "Not supplied"}`,
    ];

    const message = data.get("message");
    if (message) {
      lines.push(`Notes: ${message}`);
    }

    const messageBody = lines.join("\n");
    const subject = encodeURIComponent("Window washing quote request");
    const body = encodeURIComponent(messageBody);
    const actions = form.querySelector(".quote-actions");
    const textLink = form.querySelector("[data-send-text]");
    const emailLink = form.querySelector("[data-send-email]");

    textLink.href = `sms:+64212411722?&body=${body}`;
    emailLink.href = `mailto:vivan@claritywindowashing.co.nz?subject=${subject}&body=${body}`;
    actions.hidden = false;
    actions.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
