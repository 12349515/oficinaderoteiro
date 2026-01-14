// Menu Toggle para Mobile
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Toggle de Reações
function toggleReactions(scriptId) {
    const reactionsContainer = document.getElementById(`reactions-${scriptId}`);
    if (reactionsContainer.style.display === 'none' || !reactionsContainer.style.display) {
        reactionsContainer.style.display = 'block';
    } else {
        reactionsContainer.style.display = 'none';
    }
}

// Sistema de Reações com LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    loadAllReactions();
});

function loadAllReactions() {
    const scripts = ['chamada-silenciosa', 'na-minha-linguagem', 'homem-porcaria'];
    scripts.forEach(scriptId => {
        loadReactions(scriptId);
    });
}

function loadReactions(scriptId) {
    const reactions = ['like', 'love', 'laugh', 'wow', 'scared', 'clever', 'funny'];
    let total = 0;
    
    reactions.forEach(reaction => {
        const key = `reaction-${scriptId}-${reaction}`;
        const count = localStorage.getItem(key) || 0;
        const countElement = document.getElementById(`count-${scriptId}-${reaction}`);
        
        if (countElement) {
            countElement.textContent = count;
            total += parseInt(count);
        }
        
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
    
    const totalElement = document.getElementById(`total-${scriptId}`);
    if (totalElement) {
        totalElement.innerHTML = `Total de reações: <strong>${total}</strong>`;
    }
}

function addReaction(scriptId, reactionType) {
    const userKey = `user-reaction-${scriptId}`;
    const currentReaction = localStorage.getItem(userKey);
    const reactionKey = `reaction-${scriptId}-${reactionType}`;
    
    if (currentReaction === reactionType) {
        let count = parseInt(localStorage.getItem(reactionKey)) || 0;
        count = Math.max(0, count - 1);
        localStorage.setItem(reactionKey, count);
        localStorage.removeItem(userKey);
        
        const buttons = document.querySelectorAll(`[onclick*="${scriptId}"]`);
        buttons.forEach(btn => btn.classList.remove('active'));
        
    } else {
        if (currentReaction) {
            const oldKey = `reaction-${scriptId}-${currentReaction}`;
            let oldCount = parseInt(localStorage.getItem(oldKey)) || 0;
            oldCount = Math.max(0, oldCount - 1);
            localStorage.setItem(oldKey, oldCount);
        }
        
        let count = parseInt(localStorage.getItem(reactionKey)) || 0;
        count++;
        localStorage.setItem(reactionKey, count);
        localStorage.setItem(userKey, reactionType);
        
        const buttons = document.querySelectorAll(`[onclick*="${scriptId}"]`);
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-reaction') === reactionType) {
                btn.classList.add('active');
            }
        });
    }
    
    loadReactions(scriptId);
    
    const clickedButton = event.target.closest('.reaction-btn');
    if (clickedButton) {
        clickedButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            clickedButton.style.transform = '';
        }, 200);
    }
}

// Smooth Scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Fechar menu mobile após clicar
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navLinks && menuToggle) {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    }
});
