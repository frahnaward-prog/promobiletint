/* =====================================================
   PRO MOBILE TINT
   Premium Gallery JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
   BEFORE & AFTER SLIDER
========================================== */

const slider = document.querySelector(".comparison-slider");

if (slider) {

    const after = slider.querySelector(".comparison-after");
    const handle = slider.querySelector(".comparison-handle");

    let dragging = false;

    function updateSlider(x) {

        const rect = slider.getBoundingClientRect();

        let position = x - rect.left;

        position = Math.max(0, Math.min(position, rect.width));

        const percent = (position / rect.width) * 100;

        after.style.width = percent + "%";

        handle.style.left = percent + "%";
    }

    slider.addEventListener("mousedown", e => {

        dragging = true;

        updateSlider(e.clientX);

    });

    window.addEventListener("mousemove", e => {

        if (!dragging) return;

        updateSlider(e.clientX);

    });

    window.addEventListener("mouseup", () => {

        dragging = false;

    });

    slider.addEventListener("touchstart", e => {

        dragging = true;

        updateSlider(e.touches[0].clientX);

    });

    window.addEventListener("touchmove", e => {

        if (!dragging) return;

        updateSlider(e.touches[0].clientX);

    }, { passive:false });

    window.addEventListener("touchend", () => {

        dragging = false;

    });

}
    /* ==========================================
       TINT VISUALIZER
    ========================================== */

    const buttons = document.querySelectorAll(".shade-btn");

    const image = document.querySelector("#tintPreview");

    const title = document.querySelector("#shadeTitle");

    const desc = document.querySelector("#shadeDescription");

    if (buttons.length && image) {

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                buttons.forEach(btn =>
                    btn.classList.remove("active")
                );

                button.classList.add("active");

                image.style.opacity = "0";

                image.style.transform = "scale(.98)";

                setTimeout(() => {

                    image.src =
                        button.dataset.img;

                    image.alt =
                        button.dataset.title;

                    title.textContent =
                        button.dataset.title;

                    desc.textContent =
                        button.dataset.desc;

                    image.onload = () => {

                        image.style.opacity = "1";

                        image.style.transform = "scale(1)";

                    };

                },200);

            });

        });

    }

/* ==========================================
   PREMIUM GALLERY LIGHTBOX
========================================== */

const galleryImages = document.querySelectorAll(".gallery-grid img");

if (galleryImages.length) {

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <button class="lightbox-prev">&#10094;</button>
        <img src="" alt="Gallery Image">
        <button class="lightbox-next">&#10095;</button>
        <div class="lightbox-counter"></div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".close-lightbox");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const counter = lightbox.querySelector(".lightbox-counter");

    let currentIndex = 0;

    function showImage(index) {
        currentIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightboxImg.alt = galleryImages[index].alt;
        counter.textContent = `${index + 1} / ${galleryImages.length}`;
    }

    galleryImages.forEach((image, index) => {
        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {
            showImage(index);
            lightbox.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
    });

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            lightbox.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    /* ==========================================
       LIGHTBOX NAVIGATION
    ========================================== */

    prevBtn.addEventListener("click", e => {

        e.stopPropagation();

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex = galleryImages.length - 1;

        }

        showImage(currentIndex);

    });

    nextBtn.addEventListener("click", e => {

        e.stopPropagation();

        currentIndex++;

        if (currentIndex >= galleryImages.length) {

            currentIndex = 0;

        }

        showImage(currentIndex);

    });

    document.addEventListener("keydown", e => {

        if (lightbox.style.display !== "flex") return;

        if (e.key === "ArrowRight") {

            nextBtn.click();

        }

        if (e.key === "ArrowLeft") {

            prevBtn.click();

        }

    });

}

});