// Oficina de Roteiro - JavaScript Otimizado

// ==========================================
// 1. MENU TOGGLE (MOBILE)
// ==========================================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// ==========================================
// 2. SISTEMA DE REAÇÕES (LOCALSTORAGE)
// ==========================================
const ReactionsManager = {
    // Carregar todas as reações quando DOM estiver pronto
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAll());
        } else {
            this.loadAll();
        }
    },

    // Carregar reações de todos os scripts
    loadAll() {
        const scripts = ['chamada-silenciosa', 'na-minha-linguagem', 'homem-porcaria'];
        scripts.forEach(id => this.load(id));
    },

    // Carregar reações de um script específico
    load(scriptId) {
        const reactions = ['like', 'love', 'laugh', 'wow', 'scared', 'clever', 'funny'];
        let total = 0;
        
        reactions.forEach(reaction => {
            const key = `reaction-${scriptId}-${reaction}`;
            const count = parseInt(localStorage.getItem(key) || '0', 10);
            const countElement = document.getElementById(`count-${scriptId}-${reaction}`);
            
            if (countElement) {
                countElement.textContent = count;
                total += count;
            }
            
            // Destacar reação do usuário
            const userKey = `user-reaction-${scriptId}`;
            const userReaction = localStorage.getItem(userKey);
            
            if (userReaction === reaction) {
                const buttons = document.querySelectorAll(`[onclick*="${scriptId}"]`);
                buttons.forEach(btn => {
                    if (btn.getAttribute('data-reaction') === reaction) {
                        btn.classList.add('active');
                    }
                });
            }
        });
        
        // Atualizar total
        const totalElement = document.getElementById(`total-${scriptId}`);
        if (totalElement) {
            totalElement.innerHTML = `Total de reações: <strong>${total}</strong>`;
        }
    },

    // Adicionar ou remover reação
    add(scriptId, reactionType) {
        const userKey = `user-reaction-${scriptId}`;
        const currentReaction = localStorage.getItem(userKey);
        const reactionKey = `reaction-${scriptId}-${reactionType}`;
        
        try {
            if (currentReaction === reactionType) {
                // Remover reação
                let count = parseInt(localStorage.getItem(reactionKey) || '0', 10);
                count = Math.max(0, count - 1);
                localStorage.setItem(reactionKey, count.toString());
                localStorage.removeItem(userKey);
                
                // Remover classe active
                const buttons = document.querySelectorAll(`[onclick*="${scriptId}"]`);
                buttons.forEach(btn => btn.classList.remove('active'));
            } else {
                // Remover reação anterior se existir
                if (currentReaction) {
                    const oldKey = `reaction-${scriptId}-${currentReaction}`;
                    let oldCount = parseInt(localStorage.getItem(oldKey) || '0', 10);
                    oldCount = Math.max(0, oldCount - 1);
                    localStorage.setItem(oldKey, oldCount.toString());
                }
                
                // Adicionar nova reação
                let count = parseInt(localStorage.getItem(reactionKey) || '0', 10);
                count++;
                localStorage.setItem(reactionKey, count.toString());
                localStorage.setItem(userKey, reactionType);
                
                // Atualizar classes
                const buttons = document.querySelectorAll(`[onclick*="${scriptId}"]`);
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-reaction') === reactionType) {
                        btn.classList.add('active');
                    }
                });
            }
            
            // Recarregar reações
            this.load(scriptId);
            
            // Feedback visual
            const clickedButton = window.event?.target?.closest('.reaction-btn');
            if (clickedButton) {
                clickedButton.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    clickedButton.style.transform = '';
                }, 200);
            }
        } catch (error) {
            console.error('Erro ao processar reação:', error);
        }
    }
};

// Funções globais (compatibilidade)
function loadReactions(scriptId) {
    ReactionsManager.load(scriptId);
}

function addReaction(scriptId, reactionType) {
    ReactionsManager.add(scriptId, reactionType);
}

function toggleReactions(scriptId) {
    const container = document.getElementById(`reactions-${scriptId}`);
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
}

// Inicializar
ReactionsManager.init();

// ==========================================
// 3. SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar # vazio
            if (href === '#') {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fechar menu mobile
                const navLinks = document.getElementById('navLinks');
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// ==========================================
// 4. FECHAR MENU AO CLICAR FORA
// ==========================================
function initClickOutside() {
    document.addEventListener('click', function(event) {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navLinks && menuToggle) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        }
    });
}

// ==========================================
// 5. LAZY LOADING DE IMAGENS
// ==========================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==========================================
// 6. INICIALIZAÇÃO
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initSmoothScroll();
        initClickOutside();
        initLazyLoading();
    });
} else {
    initSmoothScroll();
    initClickOutside();
    initLazyLoading();
}

// ==========================================
// 7. REMOVER ERROS DE CONSOLE
// ==========================================
// Prevenir erro de click handler em ads
document.addEventListener('DOMContentLoaded', () => {
    const customAdContainer = document.getElementById('custom-ad-container');
    if (customAdContainer) {
        customAdContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
