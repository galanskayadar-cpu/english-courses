// ===== TIMER =====
function initTimer() {
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    const hoursBottomEl = document.getElementById('timer-hours-bottom');
    const minutesBottomEl = document.getElementById('timer-minutes-bottom');
    const secondsBottomEl = document.getElementById('timer-seconds-bottom');

    // Устанавливаем время окончания акции (24 часа от текущего момента)
    const now = new Date();
    const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    function updateTimer() {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
            // Сброс таймера на 24 часа
            endDate.setTime(now.getTime() + 24 * 60 * 60 * 1000);
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        // Верхний таймер
        if (hoursEl) hoursEl.textContent = hoursStr;
        if (minutesEl) minutesEl.textContent = minutesStr;
        if (secondsEl) secondsEl.textContent = secondsStr;

        // Нижний таймер
        if (hoursBottomEl) hoursBottomEl.textContent = hoursStr;
        if (minutesBottomEl) minutesBottomEl.textContent = minutesStr;
        if (secondsBottomEl) secondsBottomEl.textContent = secondsStr;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// ===== ANIMATIONS (Intersection Observer) =====
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Не убираем observer, чтобы анимация сработала один раз
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate').forEach(el => {
        observer.observe(el);
    });
}

// ===== STAT COUNTERS =====
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat__number').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toLocaleString() + (target < 100 && el.closest('.stat').querySelector('.stat__label').textContent.includes('%') ? '' : '+');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('.faq-item__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Закрываем все
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });

            // Открываем текущий (если был закрыт)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== TESTIMONIALS CAROUSEL =====
function initCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let itemsPerView = 3;

    function updateItemsPerView() {
        if (window.innerWidth <= 768) {
            itemsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            itemsPerView = 2;
        } else {
            itemsPerView = 3;
        }
    }

    function getMaxIndex() {
        const totalItems = track.children.length;
        return Math.max(0, totalItems - itemsPerView);
    }

    function updateCarousel() {
        const itemWidth = track.children[0].offsetWidth + 24; // gap
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // Обновляем состояние кнопок
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= getMaxIndex() ? '0.5' : '1';
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Обновляем при изменении размера окна
    window.addEventListener('resize', () => {
        updateItemsPerView();
        currentIndex = Math.min(currentIndex, getMaxIndex());
        updateCarousel();
    });

    updateItemsPerView();
    updateCarousel();
}

// ===== MOBILE NAV =====
function initMobileNav() {
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('navMenu');

    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        menu.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Закрываем меню при клике на ссылку
    menu.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// ===== STICKY CTA =====
function initStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    const hero = document.getElementById('hero');

    if (!stickyCta || !hero) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0 });

    observer.observe(hero);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FORM HANDLING =====
function initForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const telegram = formData.get('telegram');

        // Простая валидация
        if (!name || !phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return;
        }

        // Имитация отправки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Имитация задержки сервера
        setTimeout(() => {
            // Показываем успешное сообщение
            form.innerHTML = `
                <div style="text-align: center; padding: 40px 0;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2" style="margin-bottom: 16px;">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3 style="color: #FFFFFF; margin-bottom: 8px;">Заявка отправлена!</h3>
                    <p style="color: rgba(255,255,255,0.7);">Мы перезвоним вам в течение 30 минут</p>
                </div>
            `;

            // В реальном проекте здесь был бы AJAX-запрос:
            // fetch('/api/leads', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, phone, telegram })
            // });

            console.log('Lead submitted:', { name, phone, telegram });
        }, 1500);
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== PHONE MASK =====
function initPhoneMask() {
    const phoneInput = document.querySelector('input[type="tel"]');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }

            let formatted = '+7';

            if (value.length > 0) {
                formatted += ' (' + value.substring(0, 3);
            }
            if (value.length >= 3) {
                formatted += ') ' + value.substring(3, 6);
            }
            if (value.length >= 6) {
                formatted += '-' + value.substring(6, 8);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(8, 10);
            }

            e.target.value = formatted;
        }
    });

    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '+7 (') {
            e.target.value = '';
        }
    });
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0071E3, #0077ED);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ===== POPUP =====
function initPopups() {
    // Кнопки тарифов
    const pricingCards = document.querySelectorAll('.pricing-card');
    const popupGroup = document.getElementById('popup-group');
    const popupIndividual = document.getElementById('popup-individual');

    // Открытие попапов
    pricingCards.forEach((card, index) => {
        const btn = card.querySelector('.btn');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (index === 0) {
                // Первый тариф — скролл к форме
                document.getElementById('final-cta').scrollIntoView({ behavior: 'smooth' });
            } else if (index === 1 && popupGroup) {
                popupGroup.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else if (index === 2 && popupIndividual) {
                popupIndividual.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие попапов
    document.querySelectorAll('.popup').forEach(popup => {
        // Клик по overlay
        popup.querySelector('.popup__overlay').addEventListener('click', () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Кнопка закрытия
        popup.querySelector('.popup__close').addEventListener('click', () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup.active').forEach(popup => {
                popup.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // Отправка форм в попапах
    document.querySelectorAll('.popup__form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const telegram = formData.get('telegram');
            const tariff = form.dataset.tariff;

            if (!name || !phone) {
                alert('Пожалуйста, заполните имя и телефон');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const popup = form.closest('.popup');
                popup.querySelector('.popup__content').innerHTML = `
                    <div style="text-align: center; padding: 40px 0;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2" style="margin-bottom: 16px;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3 style="margin-bottom: 8px;">Заявка отправлена!</h3>
                        <p style="color: #86868B;">Мы перезвоним вам в течение 30 минут</p>
                    </div>
                `;

                console.log('Lead submitted:', { name, phone, telegram, tariff });

                setTimeout(() => {
                    popup.classList.remove('active');
                    document.body.style.overflow = '';
                }, 3000);
            }, 1500);
        });
    });
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
    initTimer();
    initAnimations();
    initCounters();
    initFAQ();
    initCarousel();
    initMobileNav();
    initStickyCTA();
    initSmoothScroll();
    initForm();
    initNavbarScroll();
    initPhoneMask();
    initScrollProgress();
    initPopups();
});
