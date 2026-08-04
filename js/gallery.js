/* =====================================================
   PRO MOBILE TINT
   Premium Gallery JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       BEFORE & AFTER PREMIUM SLIDER
    ========================================== */

    const slider = document.querySelector("#premiumSlider");

    if (slider) {

        const after = slider.querySelector(".slider-after");
        const divider = slider.querySelector(".slider-divider");

        let dragging = false;
        let animationFrame;

        function setPosition(clientX) {

            const rect = slider.getBoundingClientRect();

            let x = clientX - rect.left;

            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percent = (x / rect.width) * 100;

            cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(() => {

                after.style.width = percent + "%";
                divider.style.left = percent + "%";

            });

        }

        function startDrag(e) {

            dragging = true;

            slider.classList.add("dragging");

            if (e.type.includes("touch")) {

                setPosition(e.touches[0].clientX);

            } else {

                setPosition(e.clientX);

            }

        }

        function drag(e) {

            if (!dragging) return;

            e.preventDefault();

            if (e.type.includes("touch")) {

                setPosition(e.touches[0].clientX);

            } else {

                setPosition(e.clientX);

            }

        }

        function stopDrag() {

            dragging = false;

            slider.classList.remove("dragging");

        }

        slider.addEventListener("mousedown", startDrag);
        slider.addEventListener("click", e => setPosition(e.clientX));

        window.addEventListener("mousemove", drag);
        window.addEventListener("mouseup", stopDrag);

        slider.addEventListener("touchstart", startDrag, { passive: true });

        window.addEventListener("touchmove", drag, { passive: false });

        window.addEventListener("touchend", stopDrag);

        /* ===== Keyboard ===== */

        slider.setAttribute("tabindex", "0");

        slider.addEventListener("keydown", e => {

            const rect = slider.getBoundingClientRect();

            const current =
                parseFloat(after.style.width) || 50;

            let next = current;

            if (e.key === "ArrowLeft") next -= 2;

            if (e.key === "ArrowRight") next += 2;

            next = Math.max(0, Math.min(100, next));

            after.style.width = next + "%";
            divider.style.left = next + "%";

        });

        /* ===== Resize ===== */

        window.addEventListener("resize", () => {

            const current =
                parseFloat(after.style.width) || 50;

            after.style.width = current + "%";
            divider.style.left = current + "%";

        });

        /* ===== Intro Animation ===== */

        let intro = [
            50,55,60,64,60,55,50
        ];

        intro.forEach((v,i)=>{

            setTimeout(()=>{

                after.style.width=v+"%";
                divider.style.left=v+"%";

            },i*160);

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

});