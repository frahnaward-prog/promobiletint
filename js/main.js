/*==========================================
  PRO MOBILE TINT
  Main JavaScript
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==========================================
      MOBILE NAVIGATION
    ==========================================*/

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            document.body.classList.toggle("menu-open");

        });

        // Close menu when clicking a navigation link
        document.querySelectorAll(".nav-menu a").forEach(link => {

            link.addEventListener("click", () => {

                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("menu-open");

            });

        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {

            if (
                !menuToggle.contains(e.target) &&
                !navMenu.contains(e.target)
            ) {

                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("menu-open");

            }

        });

    }

    /*==========================================
      STICKY HEADER
    ==========================================*/

    const header = document.querySelector(".header");

    if (header) {

        window.addEventListener("scroll", () => {

            header.classList.toggle("scrolled", window.scrollY > 80);

        });

    }

    /*==========================================
      SMOOTH SCROLLING
    ==========================================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

    /*==========================================
      SCROLL REVEAL
    ==========================================*/

    const sections = document.querySelectorAll("section");

    if (sections.length > 0) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        }, {

            threshold: 0.15

        });

        sections.forEach(section => {

            section.classList.add("hidden");

            observer.observe(section);

        });

    }

    /*==========================================
      ANIMATED COUNTERS
    ==========================================*/

    const counters = document.querySelectorAll(".counter");

    if (counters.length > 0) {

        counters.forEach(counter => {

            const target = parseInt(counter.textContent.replace(/\D/g, ""));

            const suffix = counter.textContent.replace(/[0-9]/g, "");

            const updateCounter = () => {

                const current = parseInt(counter.dataset.count || 0);

                const increment = Math.ceil(target / 60);

                if (current < target) {

                    const next = Math.min(current + increment, target);

                    counter.dataset.count = next;

                    counter.textContent = next + suffix;

                    requestAnimationFrame(updateCounter);

                }

            };

            const counterObserver = new IntersectionObserver((entries) => {

                if (entries[0].isIntersecting) {

                    updateCounter();

                    counterObserver.disconnect();

                }

            });

            counterObserver.observe(counter);

        });

    }

});
/*====================================================
PRO MOBILE TINT SALE POPUP
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("saleOverlay");
    const popup = document.querySelector(".sale-popup");
    const closeBtn = document.getElementById("closeSale");

    if (!overlay || !popup || !closeBtn) return;

    const STORAGE_KEY = "proMobileTintSalePopup";
    const ONE_DAY = 24 * 60 * 60 * 1000;

    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown || (now - Number(lastShown)) > ONE_DAY) {

        setTimeout(() => {

            overlay.classList.add("active");
            document.body.style.overflow = "hidden";

            localStorage.setItem(STORAGE_KEY, now);

        }, 1000);

    }

    function closePopup() {

        overlay.classList.remove("active");
        document.body.style.overflow = "";

    }

    closeBtn.addEventListener("click", closePopup);

    overlay.addEventListener("click", (e) => {

        if (e.target === overlay) {

            closePopup();

        }

    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closePopup();

        }

    });
});