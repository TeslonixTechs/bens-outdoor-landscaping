const businessContact = {
  phone: "",
  email: "",
  facebook: ""
};

const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNavigation.classList.toggle("is-open", !isOpen);
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNavigation.classList.remove("is-open");
  }
});

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelector('[name="service"]').value = card.dataset.service;
  });
});

const projectDialog = document.querySelector(".project-dialog");
document.querySelectorAll(".project-card").forEach((card) => {
  card.querySelector(".project-link").addEventListener("click", () => {
    const image = card.querySelector(".project-image-wrap img");
    document.querySelector("#project-dialog-image").src = image.src;
    document.querySelector("#project-dialog-image").alt = image.alt;
    document.querySelector("#project-dialog-type").textContent = card.querySelector(".project-type").textContent;
    document.querySelector("#project-dialog-title").textContent = card.querySelector(".project-detail h3").textContent;
    document.querySelector("#project-dialog-description").textContent = card.querySelector(".project-detail div > p:last-child").textContent;
    projectDialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const phoneDisplay = document.querySelector("#phone-display");
const emailDisplay = document.querySelector("#email-display");
const facebookDisplay = document.querySelector("#facebook-display");

if (businessContact.phone) {
  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${businessContact.phone.replace(/[^+\d]/g, "")}`;
  phoneLink.textContent = businessContact.phone;
  phoneDisplay.replaceChildren(phoneLink);
}

if (businessContact.email) {
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${businessContact.email}`;
  emailLink.textContent = businessContact.email;
  emailDisplay.replaceChildren(emailLink);
  document.querySelector("#form-note").textContent = "Your enquiry will open in your email app for you to review and send.";
}

if (businessContact.facebook) {
  const facebookLink = document.createElement("a");
  facebookLink.href = businessContact.facebook;
  facebookLink.target = "_blank";
  facebookLink.rel = "noreferrer";
  facebookLink.textContent = "Visit our Facebook page ↗";
  facebookDisplay.replaceChildren(facebookLink);
}

const imageInput = document.querySelector('[name="image"]');
imageInput.addEventListener("change", () => {
  document.querySelector("#file-name").textContent = imageInput.files[0]?.name ?? "No image selected";
});

document.querySelector("#quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formNote = document.querySelector("#form-note");

  if (!businessContact.email) {
    formNote.textContent = "This enquiry form needs the business email address added before it can send. You can still review the details entered here.";
    return;
  }

  const formData = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Landscaping quote enquiry: ${formData.get("service")}`);
  const details = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    `Phone: ${formData.get("phone") || "Not provided"}`,
    `Service: ${formData.get("service")}`,
    `Location / postcode: ${formData.get("location")}`,
    "",
    "Project details:",
    formData.get("project"),
    "",
    `Selected image: ${imageInput.files[0]?.name || "None"}`
  ].join("\n");

  window.location.href = `mailto:${businessContact.email}?subject=${subject}&body=${encodeURIComponent(details)}`;
  formNote.textContent = imageInput.files.length
    ? "Your email app should open with the enquiry. Attach your selected garden photo before sending."
    : "Your email app should open with the enquiry details ready to review and send.";
});