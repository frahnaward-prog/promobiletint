/* Native dialogs provide focus containment, Escape handling and inert background. */
(() => {
    let opener = null;
    const dialogs = [...document.querySelectorAll('.ppf-coverage-dialog')];
    if (!dialogs.length || typeof dialogs[0].showModal !== 'function') {
        document.querySelectorAll('.ppf-view-coverage').forEach(button => { button.hidden = true; });
        return;
    }
    document.querySelectorAll('.ppf-view-coverage').forEach(button => {
        button.addEventListener('click', () => {
            const dialog = document.getElementById(button.getAttribute('aria-controls'));
            if (!dialog || dialogs.some(item => item.open)) return;
            opener = button;
            document.documentElement.classList.add('ppf-coverage-open');
            dialog.showModal();
            dialog.scrollTop = 0;
        });
    });
    dialogs.forEach(dialog => {
        dialog.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;
            const first = dialog.querySelector('.ppf-coverage-close');
            const last = dialog.querySelector('.ppf-coverage-details a');
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
        dialog.querySelector('.ppf-coverage-close').addEventListener('click', () => dialog.close());
        dialog.addEventListener('close', () => {
            document.documentElement.classList.remove('ppf-coverage-open');
            if (opener) opener.focus({ preventScroll: true });
            opener = null;
        });
    });
})();
