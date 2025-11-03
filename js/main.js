// ================================================================
// RECREIO CÉLEBRE TRANSFERS - JAVASCRIPT INTERATIVO
// Funcionalidades: Dark/Light Mode, Menu Mobile, Carrossel, 
// Animações, Formulários e Navegação
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CONFIGURAÇÃO INICIAL =====
    initializeTheme();
    initializeNavigation();
    initializeCarousel();
    initializeAnimations();
    initializeForms();
    initializeLanguageSelector();
    
    // ===== SISTEMA DE TEMA DARK/LIGHT =====
    function initializeTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;
        
        // Verificar se o usuário já tem preferência salva
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Aplicar tema inicial
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            body.setAttribute('data-theme', 'dark');
        }
        
        // Atualizar ícone do botão
        updateThemeIcon();
        
        // Event listener para toggle do tema
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Escutar mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                updateThemeIcon();
            }
        });
    }
    
    function toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
        
        // Animação suave de transição
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon() {
        const themeToggle = document.querySelector('.theme-toggle');
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        
        if (themeToggle) {
            themeToggle.innerHTML = currentTheme === 'light' 
                ? '<span class="material-icons">dark_mode</span>' 
                : '<span class="material-icons">light_mode</span>';
            themeToggle.setAttribute('aria-label', 
                currentTheme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro');
        }
    }
    
    // ===== NAVEGAÇÃO MOBILE =====
    function initializeNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevenir scroll do body quando menu está aberto
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Header transparente/sólido no scroll
        const header = document.querySelector('.header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.background = '';
                    header.style.backdropFilter = '';
                }
            });
        }
    }
    
    // ===== SELETOR DE IDIOMA =====
    function initializeLanguageSelector() {
        const languageBtn = document.querySelector('.language-btn');
        const languageDropdown = document.querySelector('.language-dropdown');
        
        if (languageBtn && languageDropdown) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('show');
            });
            
            // Fechar dropdown ao clicar fora
            document.addEventListener('click', () => {
                languageDropdown.classList.remove('show');
            });
            
            // Event listeners para os links de idioma
            const languageLinks = languageDropdown.querySelectorAll('a');
            languageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedLang = link.getAttribute('data-lang');
                    const selectedText = link.textContent;
                    
                    // Atualizar texto do botão
                    languageBtn.textContent = selectedText;
                    
                    // Aqui seria implementada a troca de idioma real
                    console.log(`Idioma selecionado: ${selectedLang}`);
                    
                    // Fechar dropdown
                    languageDropdown.classList.remove('show');
                    
                    // Simular troca de idioma (apenas log por enquanto)
                    showNotification(`Idioma alterado para ${selectedText}`, 'success');
                });
            });
        }
    }
    
    // ===== CARROSSEL DE IMAGENS =====
    function initializeCarousel() {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach(carousel => {
            const container = carousel.querySelector('.carousel-container');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = carousel.querySelector('.carousel-nav.prev');
            const nextBtn = carousel.querySelector('.carousel-nav.next');
            const indicators = carousel.querySelector('.carousel-indicators');
            
            if (!container || slides.length === 0) return;
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            let autoPlayInterval;
            
            // Criar indicadores
            if (indicators) {
                for (let i = 0; i < totalSlides; i++) {
                    const indicator = document.createElement('button');
                    indicator.classList.add('carousel-indicator');
                    indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                    if (i === 0) indicator.classList.add('active');
                    
                    indicator.addEventListener('click', () => goToSlide(i));
                    indicators.appendChild(indicator);
                }
            }
            
            // Função para ir para um slide específico
            function goToSlide(slideIndex) {
                currentSlide = slideIndex;
                const translateX = -currentSlide * 100;
                container.style.transform = `translateX(${translateX}%)`;
                
                // Atualizar indicadores
                const indicatorElements = indicators?.querySelectorAll('.carousel-indicator');
                if (indicatorElements) {
                    indicatorElements.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentSlide);
                    });
                }
            }
            
            // Próximo slide
            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                goToSlide(currentSlide);
            }
            
            // Slide anterior
            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                goToSlide(currentSlide);
            }
            
            // Event listeners para botões
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            
            // AutoPlay
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            // Pausar autoplay ao hover/focus
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
            carousel.addEventListener('focusin', stopAutoPlay);
            carousel.addEventListener('focusout', startAutoPlay);
            
            // Suporte a touch/swipe em mobile
            let startX = 0;
            let isDragging = false;
            
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                stopAutoPlay();
            });
            
            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });
            
            carousel.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                
                isDragging = false;
                startAutoPlay();
            });
            
            // Navegação por teclado
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            });
            
            // Iniciar autoplay
            startAutoPlay();
        });
    }
    
    // ===== ANIMAÇÕES ON SCROLL =====
    function initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    // Remover classe para reativar animação se sair da viewport
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);
        
        // Observar todos os elementos com classe fade-in
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            observer.observe(element);
        });
        
        // Scroll suave para links âncora
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Botão "Voltar ao topo"
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });
            
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // ===== FORMULÁRIOS =====
    function initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            
            // Validação em tempo real
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        });
        
        // Máscara para telefone
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', formatPhoneNumber);
        });
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formType = form.getAttribute('data-form-type') || 'contact';
        
        // Validar formulário
        if (!validateForm(form)) {
            showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        // Mostrar loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'A enviar...';
        submitBtn.disabled = true;
        
        // Simular envio (em produção seria enviado para o servidor)
        setTimeout(() => {
            console.log(`Formulário ${formType} enviado:`, Object.fromEntries(formData));
            
            // Mostrar mensagem de sucesso
            let message = 'Mensagem enviada com sucesso!';
            if (formType === 'booking') {
                message = 'Pedido de reserva enviado! Entraremos em contacto em breve.';
            }
            
            showNotification(message, 'success');
            
            // Reset do formulário
            form.reset();
            
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        }, 1500);
    }
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remover erros anteriores
        clearFieldError(e);
        
        // Verificar se campo obrigatório está preenchido
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        }
        
        // Validações específicas por tipo
        if (value && isValid) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Email inválido';
                        isValid = false;
                    }
                    break;
                    
                case 'tel':
                    const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
                    if (!phoneRegex.test(value)) {
                        errorMessage = 'Número de telefone inválido';
                        isValid = false;
                    }
                    break;
                    
                case 'date':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        errorMessage = 'A data deve ser futura';
                        isValid = false;
                    }
                    break;
            }
        }
        
        // Mostrar erro se inválido
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 9) {
            // Formato português: +351 XXX XXX XXX
            if (value.startsWith('351')) {
                value = '+351 ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 12);
            } else {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9);
            }
        }
        
        e.target.value = value;
    }
    
    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para a notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px',
            wordWrap: 'break-word'
        });
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // ===== WHATSAPP INTEGRATION =====
    function initializeWhatsApp() {
        const whatsappBtns = document.querySelectorAll('.whatsapp-btn');
        
        whatsappBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const phone = btn.getAttribute('data-phone') || '351123456789';
                const message = btn.getAttribute('data-message') || 'Olá! Gostaria de mais informações.';
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                
                window.open(whatsappUrl, '_blank');
            });
        });
    }
    
    // ===== TABS NAVIGATION =====
    function initializeTabs() {
        const tabContainers = document.querySelectorAll('.tabs-container');
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.tab-btn');
            const contents = container.querySelectorAll('.tab-content');
            
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Remover active de todos
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    // Ativar clicado
                    tab.classList.add('active');
                    if (contents[index]) {
                        contents[index].classList.add('active');
                    }
                });
            });
        });
    }
    
    // ===== FILTROS DE BUSCA =====
    function initializeFilters() {
        const filterContainers = document.querySelectorAll('.filter-container');
        
        filterContainers.forEach(container => {
            const filters = container.querySelectorAll('.filter-btn');
            const items = document.querySelectorAll('.filterable-item');
            
            filters.forEach(filter => {
                filter.addEventListener('click', () => {
                    const filterValue = filter.getAttribute('data-filter');
                    
                    // Atualizar estado dos botões
                    filters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    
                    // Filtrar itens
                    items.forEach(item => {
                        const itemCategories = item.getAttribute('data-categories').split(',');
                        
                        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                            item.style.display = 'block';
                            item.classList.add('fade-in');
                        } else {
                            item.style.display = 'none';
                            item.classList.remove('fade-in');
                        }
                    });
                });
            });
        });
    }
    
    // ===== LIGHTBOX PARA GALERIA =====
    function initializeLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
        });
    }
    
    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // Estilos do lightbox
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            cursor: 'pointer'
        });
        
        const img = lightbox.querySelector('img');
        Object.assign(img.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain'
        });
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '30px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '40px',
            cursor: 'pointer'
        });
        
        document.body.appendChild(lightbox);
        
        // Event listeners para fechar
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
    
    // ===== INICIALIZAR FUNCIONALIDADES EXTRAS =====
    initializeWhatsApp();
    initializeTabs();
    initializeFilters();
    initializeLightbox();
    
    // ===== UTILITÁRIOS =====
    
    // Debounce function para performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Lazy loading para imagens
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Performance monitoring
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    }
    
    // Inicializar funcionalidades de performance
    initializeLazyLoading();
    logPerformance();
    
    console.log('🚀 Recreio Célebre Transfers - Site carregado com sucesso!');
});

// ===== ADICIONAR ESTILOS DINÂMICOS PARA ERROS DE FORMULÁRIO =====
const style = document.createElement('style');
style.textContent = `
    .form-control.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--secondary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .back-to-top:hover {
        background-color: #2980b9;
        transform: translateY(-3px);
    }
    
    @media (max-width: 768px) {
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`;
document.head.appendChild(style);