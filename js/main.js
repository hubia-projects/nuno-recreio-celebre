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
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }
    
    // ===== SISTEMA COMPLETO DE MULTI-IDIOMA =====
    function initializeLanguageSelector() {
        const languageBtn = document.querySelector('.language-btn');
        const languageDropdown = document.querySelector('.language-dropdown');
        
        // Carregar idioma salvo ou definir padrão
        const savedLanguage = localStorage.getItem('language') || 'pt';
        const currentLanguage = savedLanguage;
        
        // Aplicar idioma inicial
        changeLanguage(currentLanguage);
        
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
                    
                    // Trocar idioma
                    changeLanguage(selectedLang);
                    
                    // Salvar preferência
                    localStorage.setItem('language', selectedLang);
                    
                    // Fechar dropdown
                    languageDropdown.classList.remove('show');
                    
                    // Mostrar mensagem de sucesso
                    const messages = translations[selectedLang]?.messages || translations.pt.messages;
                    showNotification(messages.languageChanged, 'success');
                });
            });
        }
    }
    
    // ===== FUNÇÃO PRINCIPAL DE TROCA DE IDIOMA =====
    function changeLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Idioma ${lang} não encontrado. Usando português como padrão.`);
            lang = 'pt';
        }
        
        const t = translations[lang];
        
        // Atualizar atributo lang do HTML
        document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 
                                      lang === 'en' ? 'en-US' : 
                                      lang === 'fr' ? 'fr-FR' : 
                                      lang === 'es' ? 'es-ES' : 'pt-PT';
        
        // Atualizar botão de idioma
        updateLanguageButton(lang);
        
        // Atualizar título da página
        updatePageTitle(lang);
        
        // Atualizar meta description
        updateMetaDescription(lang);
        
        // Atualizar conteúdo da página baseado na página atual
        updatePageContent(lang, t);
        
        // Trigger evento personalizado para componentes externos
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang, translations: t } 
        }));
    }
    
    // ===== ATUALIZAR BOTÃO DE IDIOMA =====
    function updateLanguageButton(lang) {
        const languageBtn = document.querySelector('.language-btn');
        if (languageBtn) {
            const languageNames = {
                pt: 'PT',
                en: 'EN', 
                fr: 'FR',
                es: 'ES'
            };
            
            // Manter ícone e atualizar texto
            const icon = languageBtn.querySelector('i');
            if (icon) {
                languageBtn.innerHTML = `<i class="bi bi-globe"></i> ${languageNames[lang]}`;
            } else {
                languageBtn.textContent = languageNames[lang];
            }
        }
    }
    
    // ===== ATUALIZAR TÍTULO DA PÁGINA =====
    function updatePageTitle(lang) {
        const t = translations[lang];
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        let newTitle = '';
        
        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPage === 'index.html') {
            newTitle = t.home.title;
        } else if (currentPath.includes('about.html') || currentPage === 'about.html') {
            newTitle = t.about.title;
        } else if (currentPath.includes('contact.html') || currentPage === 'contact.html') {
            newTitle = t.contact.title;
        } else if (currentPath.includes('/tours') || currentPath.includes('tours/')) {
            newTitle = t.tours.title;
        } else if (currentPath.includes('/transfers') || currentPath.includes('transfers/')) {
            newTitle = t.transfers.title;
        } else if (currentPath.includes('portfolio.html') || currentPage === 'portfolio.html') {
            newTitle = t.portfolio.title;
        }
        
        if (newTitle) {
            document.title = newTitle;
        }
    }
    
    // ===== ATUALIZAR META DESCRIPTION =====
    function updateMetaDescription(lang) {
        const t = translations[lang];
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        let newDescription = '';
        
        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPage === 'index.html') {
            newDescription = t.home.metaDescription;
        } else if (currentPath.includes('about.html') || currentPage === 'about.html') {
            newDescription = t.about.metaDescription;
        } else if (currentPath.includes('contact.html') || currentPage === 'contact.html') {
            newDescription = t.contact.metaDescription;
        } else if (currentPath.includes('/tours') || currentPath.includes('tours/')) {
            newDescription = t.tours.metaDescription;
        } else if (currentPath.includes('/transfers') || currentPath.includes('transfers/')) {
            newDescription = t.transfers.metaDescription;
        } else if (currentPath.includes('portfolio.html') || currentPage === 'portfolio.html') {
            newDescription = t.portfolio.metaDescription;
        }
        
        if (newDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', newDescription);
            }
        }
    }
    
    // ===== ATUALIZAR CONTEÚDO DA PÁGINA =====
    function updatePageContent(lang, t) {
        // Atualizar navegação
        updateNavigation(t);
        
        // Atualizar todos os elementos com atributo data-i18n
        updateElementsWithDataI18n(lang, t);
        
        // Detectar página atual e atualizar conteúdo específico
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPage === 'index.html') {
            updateHomePage(t);
        } else if (currentPath.includes('about.html') || currentPage === 'about.html') {
            updateAboutPage(t);
        } else if (currentPath.includes('contact.html') || currentPage === 'contact.html') {
            updateContactPage(t);
        } else if (currentPath.includes('/tours') || currentPath.includes('tours/')) {
            updateToursPage(t);
        } else if (currentPath.includes('/transfers') || currentPath.includes('transfers/')) {
            updateTransfersPage(t);
        } else if (currentPath.includes('portfolio.html') || currentPage === 'portfolio.html') {
            updatePortfolioPage(t);
        }
    }
    
    // ===== ATUALIZAR ELEMENTOS COM DATA-I18N =====
    function updateElementsWithDataI18n(lang, t) {
        const elementsWithI18n = document.querySelectorAll('[data-i18n]');
        
        elementsWithI18n.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(t, key);
            
            if (translation) {
                // Se o elemento tem filhos com HTML, preservar estrutura
                if (element.children.length > 0 && !key.includes('nav.')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Atualizar atributos alt de imagens
        const imagesWithI18nAlt = document.querySelectorAll('[data-i18n-alt]');
        imagesWithI18nAlt.forEach(img => {
            const altKey = img.getAttribute('data-i18n-alt');
            const altTranslation = getNestedTranslation(t, altKey);
            
            if (altTranslation) {
                img.setAttribute('alt', altTranslation);
            }
        });
        
        // Atualizar atributos aria-label
        const elementsWithI18nAria = document.querySelectorAll('[data-i18n-aria]');
        elementsWithI18nAria.forEach(element => {
            const ariaKey = element.getAttribute('data-i18n-aria');
            const ariaTranslation = getNestedTranslation(t, ariaKey);
            
            if (ariaTranslation) {
                element.setAttribute('aria-label', ariaTranslation);
            }
        });
    }
    
    // ===== OBTER TRADUÇÃO ANINHADA =====
    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
    
    // ===== ATUALIZAR NAVEGAÇÃO =====
    function updateNavigation(t) {
        // Atualizar menu de navegação
        const navLinks = document.querySelectorAll('.nav-menu a');
        const navTexts = [t.nav.home, t.nav.tours, t.nav.transfers, t.nav.gallery, t.nav.about, t.nav.contact];
        
        navLinks.forEach((link, index) => {
            if (navTexts[index]) {
                link.textContent = navTexts[index];
            }
        });
        
        // Atualizar dropdown de idiomas
        const languageDropdown = document.querySelector('.language-dropdown');
        if (languageDropdown) {
            const languageLinks = languageDropdown.querySelectorAll('a');
            const languageNames = ['Português', 'English', 'Français', 'Español'];
            languageLinks.forEach((link, index) => {
                if (languageNames[index]) {
                    link.textContent = languageNames[index];
                }
            });
        }
    }
    
    // ===== ATUALIZAR PÁGINA INICIAL =====
    function updateHomePage(t) {
        // Hero section
        updateElementText('.hero-title', t.home.heroTitle);
        updateElementText('.hero-accent-text', t.home.heroAccent);
        updateElementText('.hero-subtitle', t.home.heroSubtitle);
        
        // Botões do hero
        updateElementText('.btn-primary', t.home.bookTransfer);
        updateElementText('.btn-hero-secondary', t.home.viewTours);
        
        // Seção de serviços
        updateElementText('.section-title', t.home.servicesTitle, 0);
        updateElementText('.section-subtitle', t.home.servicesSubtitle, 0);
        
        // Cards de serviços
        const cardTitles = document.querySelectorAll('.card-title');
        const cardTexts = document.querySelectorAll('.card-text');
        const serviceTitles = [t.home.airportTransfer, t.home.executiveTransfer, t.home.douroTours];
        const serviceDescs = [t.home.airportTransferDesc, t.home.executiveTransferDesc, t.home.douroToursDesc];
        
        cardTitles.forEach((title, index) => {
            if (serviceTitles[index]) {
                title.textContent = serviceTitles[index];
            }
        });
        
        cardTexts.forEach((text, index) => {
            if (serviceDescs[index]) {
                text.textContent = serviceDescs[index];
            }
        });
        
        // Seção "Porquê escolher-nos"
        const whyChooseTitle = document.querySelectorAll('.section-title')[1];
        const whyChooseSubtitle = document.querySelectorAll('.section-subtitle')[1];
        if (whyChooseTitle) whyChooseTitle.textContent = t.home.whyChooseTitle;
        if (whyChooseSubtitle) whyChooseSubtitle.textContent = t.home.whyChooseSubtitle;
        
        // Cards de vantagens
        const advantageTitles = [t.home.punctuality, t.home.comfort, t.home.guides, t.home.experience];
        const advantageDescs = [t.home.punctualityDesc, t.home.comfortDesc, t.home.guidesDesc, t.home.experienceDesc];
        
        const advantageCards = document.querySelectorAll('.text-center .card-title');
        const advantageTexts = document.querySelectorAll('.text-center .card-text');
        
        advantageCards.forEach((card, index) => {
            if (advantageTitles[index]) {
                card.textContent = advantageTitles[index];
            }
        });
        
        advantageTexts.forEach((text, index) => {
            if (advantageDescs[index]) {
                text.textContent = advantageDescs[index];
            }
        });
        
        // Botões
        updateButtonsText(t);
    }
    
    // ===== ATUALIZAR PÁGINA SOBRE =====
    function updateAboutPage(t) {
        updateElementText('.hero-title', t.about.heroTitle);
        updateElementText('.hero-subtitle', t.about.heroSubtitle);
        updateElementText('.section-title', t.about.companyName, 0);
        
        // Atualizar textos da história (com HTML)
        const historyTexts = document.querySelectorAll('p[style*="line-height"]');
        if (historyTexts.length >= 3) {
            historyTexts[0].innerHTML = t.about.historyText1;
            historyTexts[1].innerHTML = t.about.historyText2;
            historyTexts[2].innerHTML = t.about.historyText3;
        }
        
        updateButtonsText(t);
    }
    
    // ===== ATUALIZAR PÁGINA CONTACTOS =====
    function updateContactPage(t) {
        updateElementText('.hero-title', t.contact.heroTitle);
        updateElementText('.hero-subtitle', t.contact.heroSubtitle);
        
        // Formulário
        updateElementText('label[for="name"]', t.contact.fullName);
        updateElementText('label[for="email"]', t.contact.emailAddress);
        updateElementText('label[for="phone"]', t.contact.phoneNumber);
        updateElementText('label[for="subject"]', t.contact.subject);
        updateElementText('label[for="message"]', t.contact.message);
        
        // Placeholders
        updatePlaceholder('input[name="name"]', t.contact.fullName);
        updatePlaceholder('input[name="email"]', t.contact.emailAddress);
        updatePlaceholder('input[name="phone"]', t.contact.phoneNumber);
        updatePlaceholder('input[name="subject"]', t.contact.subject);
        updatePlaceholder('textarea[name="message"]', t.contact.message);
        
        updateButtonsText(t);
    }
    
    // ===== ATUALIZAR PÁGINA TOURS =====
    function updateToursPage(t) {
        updateElementText('.hero-title', t.tours.heroTitle);
        updateElementText('.hero-subtitle', t.tours.heroSubtitle);
        updateElementText('.section-title', t.tours.ourTours, 0);
        updateElementText('.section-subtitle', t.tours.toursDescription, 0);
        
        updateButtonsText(t);
    }
    
    // ===== ATUALIZAR PÁGINA TRANSFERS =====
    function updateTransfersPage(t) {
        updateElementText('.hero-title', t.transfers.heroTitle);
        updateElementText('.hero-subtitle', t.transfers.heroSubtitle);
        updateElementText('.section-title', t.transfers.ourServices, 0);
        updateElementText('.section-subtitle', t.transfers.servicesDescription, 0);
        
        updateButtonsText(t);
    }
    
    // ===== ATUALIZAR PÁGINA GALERIA =====
    function updatePortfolioPage(t) {
        updateElementText('.hero-title', t.portfolio.heroTitle);
        updateElementText('.hero-subtitle', t.portfolio.heroSubtitle);
        updateElementText('.section-title', t.portfolio.gallery, 0);
        updateElementText('.section-subtitle', t.portfolio.galleryDescription, 0);
        
        updateButtonsText(t);
    }
    
    // ===== FUNÇÕES UTILITÁRIAS =====
    function updateElementText(selector, text, index = null) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            if (index !== null && elements[index]) {
                elements[index].textContent = text;
            } else if (index === null) {
                elements[0].textContent = text;
            }
        }
    }
    
    function updatePlaceholder(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute('placeholder', text);
        }
    }
    
    function updateButtonsText(t) {
        // Atualizar botões comuns
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            const text = btn.textContent.trim();
            
            // Mapear textos comuns de botões
            if (text.includes('Reservar') || text.includes('Book') || text.includes('Réserver') || text.includes('Reservar')) {
                if (btn.classList.contains('btn-primary')) {
                    btn.textContent = t.buttons.book;
                }
            }
            if (text.includes('Ver') || text.includes('View') || text.includes('Voir') || text.includes('Ver')) {
                btn.textContent = t.buttons.viewMore;
            }
            if (text.includes('Contactar') || text.includes('Contact') || text.includes('Contacter') || text.includes('Contactar')) {
                btn.textContent = t.buttons.contact;
            }
            if (text.includes('Enviar') || text.includes('Send') || text.includes('Envoyer') || text.includes('Enviar')) {
                btn.textContent = t.buttons.submit;
            }
        });
    }
    
    // ===== EXPOSER FUNÇÃO GLOBAL =====
    window.changeLanguage = changeLanguage;
    
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
    
    // ===== NAVEGAÇÃO ATIVA AUTOMÁTICA =====
    function initializeActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Remove todas as classes active existentes
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Lógica para determinar qual link deve estar ativo
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPath = href.replace('../', '').replace('./', '');
            
            // Verifica diferentes cenários
            let shouldBeActive = false;
            
            if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPage === 'index.html') {
                // Página inicial
                if (href === '../' || href === './' || href === 'index.html' || link.textContent.trim() === 'Home') {
                    shouldBeActive = true;
                }
            } else if (currentPath.includes('/tours') || currentPath.includes('tours/')) {
                // Página de tours
                if (href.includes('tours') || link.textContent.trim() === 'Tours') {
                    shouldBeActive = true;
                }
            } else if (currentPath.includes('/transfers') || currentPath.includes('transfers/')) {
                // Página de transfers
                if (href.includes('transfers') || link.textContent.trim() === 'Transfers') {
                    shouldBeActive = true;
                }
            } else if (currentPath.includes('portfolio.html') || currentPage === 'portfolio.html') {
                // Página de galeria
                if (href.includes('portfolio.html') || link.textContent.trim() === 'Galeria') {
                    shouldBeActive = true;
                }
            } else if (currentPath.includes('about.html') || currentPage === 'about.html') {
                // Página sobre
                if (href.includes('about.html') || link.textContent.trim() === 'Sobre') {
                    shouldBeActive = true;
                }
            } else if (currentPath.includes('contact.html') || currentPage === 'contact.html') {
                // Página de contactos
                if (href.includes('contact.html') || link.textContent.trim() === 'Contactos') {
                    shouldBeActive = true;
                }
            }
            
            if (shouldBeActive) {
                link.classList.add('active');
            }
        });
    }
    
    // Inicializar navegação ativa
    initializeActiveNavigation();
    
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