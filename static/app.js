document.documentElement.classList.add("js-ready");

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterCount = document.querySelector(".filter-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      const visible = category === "all" || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterCount.textContent = `${String(visibleCount).padStart(2, "0")} ${visibleCount === 1 ? "project" : "projects"}`;
  });
});

const dialog = document.querySelector(".project-dialog");
const dialogImage = dialog.querySelector(".dialog-image");
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    dialog.querySelector(".dialog-eyebrow").textContent = card.dataset.eyebrow;
    dialog.querySelector("#dialog-title").textContent = card.dataset.title;
    dialog.querySelector(".dialog-description").textContent =
      card.dataset.description;
    dialog.querySelector(".dialog-details").textContent = card.dataset.details;
    dialogImage.src = card.dataset.image;
    dialogImage.alt = card.dataset.imageAlt;
    const stack = dialog.querySelector(".dialog-stack");
    stack.replaceChildren(
      ...card.dataset.stack.split("|").map((item) => {
        const tag = document.createElement("span");
        tag.textContent = item;
        return tag;
      }),
    );
    dialog.showModal();
  });
});
dialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  siteNav.classList.toggle("is-open", !open);
});
siteNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }),
);

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
