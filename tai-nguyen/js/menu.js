(function () {
    "use strict";

    function getElements() {
        return {
            button: document.getElementById("nutMenu"),
            closeButton: document.getElementById("nutDong"),
            drawer: document.getElementById("menuDrawer"),
            overlay: document.getElementById("menuOverlay")
        };
    }


    function setMenuState(isOpen) {
        const elements = getElements();

        if (!elements.drawer || !elements.overlay) {
            console.error(
                "Không tìm thấy menuDrawer hoặc menuOverlay."
            );
            return;
        }

        elements.drawer.classList.toggle("active", isOpen);
        elements.overlay.classList.toggle("active", isOpen);

        elements.drawer.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        elements.overlay.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        if (elements.button) {
            elements.button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    }


    window.toggleMenu = function () {
        const elements = getElements();

        if (!elements.drawer) {
            return;
        }

        const isOpen =
            elements.drawer.classList.contains("active");

        setMenuState(!isOpen);
    };


    window.closeMenu = function () {
        setMenuState(false);
    };


    /*
     * Dùng bắt sự kiện trên document để hoạt động
     * kể cả khi menu.html được chèn bằng fetch().
     */
    document.addEventListener("click", function (event) {

        const target = event.target;

        if (target.closest("#nutMenu")) {
            window.toggleMenu();
            return;
        }

        if (target.closest("#nutDong")) {
            window.closeMenu();
            return;
        }

        if (target.closest("#menuOverlay")) {
            window.closeMenu();
            return;
        }

        if (
            target.closest(".drawer-body a") &&
            window.innerWidth <= 1000
        ) {
            window.closeMenu();
        }
    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            window.closeMenu();
        }
    });

})();
