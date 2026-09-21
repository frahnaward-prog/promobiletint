/* Native dialogs provide an accessible modal experience without duplicating package content. */
(() => {
    let opener = null;
    const dialogs = [...document.querySelectorAll('.ppf-coverage-dialog')];
    const getFocusableElements = dialog => [...dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(element => element.getClientRects().length > 0);

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
            dialog.querySelector('.ppf-coverage-close').focus({ preventScroll: true });
        });
    });

    dialogs.forEach(dialog => {
        dialog.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;

            const focusableElements = getFocusableElements(dialog);
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            if (!first || !last) return;

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
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
