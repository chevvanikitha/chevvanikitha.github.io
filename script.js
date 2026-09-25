const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

const updateActiveNav = () => {
  const y = window.scrollY + 130;
  let current = "home";

  sections.forEach((section) => {
    if (y >= section.offsetTop) current = section.id;
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

/* Profile photo upload.
   The image is stored locally in this browser, so it does not expose the
   user's photo to a server. Large images are resized before storage. */
const photoInput = document.getElementById("photoInput");
const profilePreview = document.getElementById("profilePreview");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const changePhoto = document.getElementById("changePhoto");
const photoUpload = document.querySelector(".photo-upload");

const PHOTO_KEY = "nikithaPortfolioProfilePhoto";

function showPhoto(dataUrl) {
  profilePreview.src = dataUrl;
  profilePreview.hidden = false;
  photoPlaceholder.hidden = true;
  changePhoto.hidden = false;
  photoUpload.textContent = "Replace Photo";
}

function loadSavedPhoto() {
  const saved = localStorage.getItem(PHOTO_KEY);
  if (saved) showPhoto(saved);
}

function resizeImage(file, maxSize = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

photoInput?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const dataUrl = await resizeImage(file);
    showPhoto(dataUrl);
    localStorage.setItem(PHOTO_KEY, dataUrl);
  } catch (error) {
    console.error(error);
    alert("The photo could not be loaded. Please try another image.");
  }

  photoInput.value = "";
});

changePhoto?.addEventListener("click", () => photoInput?.click());

loadSavedPhoto();
