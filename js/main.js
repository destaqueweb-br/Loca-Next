document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileBtn.querySelector('i').classList.remove('fa-times');
                    mobileBtn.querySelector('i').classList.add('fa-bars');
                }

                // Scroll with offset for header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // Add logic to handle hash links coming from another page (e.g. from cobertura.html to index.html#planos)
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100);
        }
    }

    // Auto-scroll Carousel Logic
    const carouselInner = document.querySelector('.carousel-inner');
    if (carouselInner) {
        const carouselItems = carouselInner.querySelectorAll('.carousel-item');
        if (carouselItems.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                currentIndex++;
                if (currentIndex >= carouselItems.length) {
                    currentIndex = 0;
                }
                const itemWidth = carouselInner.clientWidth;
                carouselInner.scrollTo({
                    left: currentIndex * itemWidth,
                    behavior: 'smooth'
                });
            }, 3000); // Change slide every 3 seconds
        }
    }

    // Lead Form Modal Logic
    const leadModal = document.getElementById('leadModal');
    const openLeadModalBtn = document.getElementById('openLeadModal');
    const closeLeadModalBtn = document.getElementById('closeLeadModal');
    const leadForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');
    const submitLeadBtn = document.getElementById('submitLeadBtn');

    if (leadModal) {
        // Open modal
        const openModal = () => {
            leadModal.classList.add('active');
        };

        // Close modal
        const closeModal = () => {
            leadModal.classList.remove('active');
        };

        if (openLeadModalBtn) openLeadModalBtn.addEventListener('click', openModal);
        if (closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', closeModal);

        // Close when clicking outside
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                closeModal();
            }
        });

        // Exit intent detection (desktop) - trigger when mouse leaves viewport upwards
        let hasTriggeredExitIntent = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !hasTriggeredExitIntent) {
                hasTriggeredExitIntent = true;
                openModal();
            }
        });

        // Handle form submission
        if (leadForm) {
            leadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(leadForm);
                const data = Object.fromEntries(formData.entries());
                
                submitLeadBtn.disabled = true;
                submitLeadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                formStatus.className = 'form-status';
                formStatus.textContent = '';

                try {
                    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyExZ7pFfe1t53vpHrHsjtURHiowta4ww4t-h-Npz9OVZ-RvOqs_vtqLub2AFrc2u7u/exec';
                    
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Important for Google Apps Script to avoid CORS issues
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    // Com no-cors, assumimos sucesso se não houver erro no fetch
                    formStatus.textContent = 'Contato enviado com sucesso! Retornaremos em breve.';
                    formStatus.classList.add('success');
                    leadForm.reset();
                    submitLeadBtn.disabled = false;
                    submitLeadBtn.innerHTML = 'Enviar Contato';
                    
                    // Close modal after success
                    setTimeout(() => {
                        closeModal();
                        formStatus.textContent = '';
                        formStatus.classList.remove('success');
                    }, 3000);

                } catch (error) {
                    formStatus.textContent = 'Ocorreu um erro ao enviar. Tente novamente.';
                    formStatus.classList.add('error');
                    submitLeadBtn.disabled = false;
                    submitLeadBtn.innerHTML = 'Enviar Contato';
                }
            });
        }
    }
});
