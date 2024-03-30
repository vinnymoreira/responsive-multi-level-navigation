document.addEventListener("DOMContentLoaded", () => {
    const mobileBreakpoint = 960;
    const body = document.querySelector('body');
    const nav = document.querySelector('.main-navigation');
    nav.classList.remove('hide');

    const menuToggle = document.querySelector('.menu-toggle');
    const topLevelItems = nav.querySelectorAll('.main-navigation__nav > li');
    const ddItems = nav.querySelectorAll('.main-navigation__nav > li.has-submenu');
    const subItems = nav.querySelectorAll('.submenu--first-level > ul > li.has-submenu');

    menuToggle.addEventListener('click', toggleNav);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && nav.classList.contains('active')) {
            toggleNav();
        }
    });

    const query = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    query.addEventListener("change", (e) => navHandleMQ(e.matches));
    navHandleMQ(query.matches);

    function toggleNav() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('nav-active');
        body.classList.toggle('scroll-lock');

        if (!nav.classList.contains('active')) {
            resetAllClasses();
        }
    }

    function appendMobileToggleBtn() {
        ddItems.forEach((item) => {
            let firstLevel = item.querySelector('.submenu--first-level');
            let navItem = item.querySelector('a:first-of-type');
            navItem.innerHTML += '<span class="btn-mobile-toggle"></span>';
            navItem.querySelector('.btn-mobile-toggle').addEventListener('click', (e) => {
                e.preventDefault();
                navItem.classList.toggle('active');
                firstLevel.classList.toggle('show');
            });
        });
    }

    function cloneSubMenu() {
        subItems.forEach((item) => {
            let itemID = item.getAttribute('data-submenu');
            let secondLevel = item.closest('.submenu-container').querySelector(`.submenu--second-level[data-submenu-id="${itemID}"]`);
            let clone = secondLevel.cloneNode(true);
            clone.classList.add('mobile');
            item.append(clone);
        });
    }

    function resetAllClasses() {
        nav.querySelectorAll('.show, .hide, .active').forEach((el) => {
            el.classList.remove('hide', 'show', 'active');
        });
    }

    function navHandleMQ(isMobile) {
        nav.classList.toggle('is-mobile', isMobile);
        nav.classList.toggle('is-desktop', !isMobile);

        if (isMobile) {
            appendMobileToggleBtn();
            cloneSubMenu();
        }
        resetAllClasses();
    }

    // Dropdown & subnavs
    ddItems.forEach((item) => {
        let firstLevel = item.querySelector('.submenu-container > div.submenu--first-level');
        let btnNext = item.querySelectorAll('.submenu--first-level ul li.has-submenu button');
        let btnBack = item.querySelectorAll('.submenu--second-level button.submenu__btn--back');

        btnNext.forEach((btn) => {
            function triggerSubmenu(el) {
                el.addEventListener('click', () => {
                    let clickedItem = el.parentNode;
                    let targetMenuID = clickedItem.getAttribute('data-submenu');

                    if (nav.classList.contains('is-desktop')) {
                        firstLevel.classList.add('hide');
                        let secondLevel = item.querySelector(`.submenu-container > div.submenu--second-level[data-submenu-id="${targetMenuID}"]`);
                        secondLevel.classList.add('show');
                    }

                    if (nav.classList.contains('is-mobile')) {
                        el.classList.toggle('active');
                        let secondLevel = el.nextElementSibling;
                        secondLevel.classList.toggle('show');
                    }
                });
            }

            triggerSubmenu(btn);
        });

        btnBack.forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.closest('.submenu--second-level').classList.remove('show');
                firstLevel.classList.remove('hide');
            });
        });
    });
});
