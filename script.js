// Oficina de Roteiro - JavaScript ULTRA OTIMIZADO v2
// Foco: Reduzir TBT (Total Blocking Time)

// ==========================================
// ESTRATÉGIA: Quebrar tarefas longas em chunks pequenos
// ==========================================

// 1. MENU TOGGLE (Inline, sem eventos pesados)
function toggleMenu(){const n=document.getElementById('navLinks');n&&n.classList.toggle('active')}

// 2. SISTEMA DE REAÇÕES - Lazy Load
const ReactionsManager={
    init(){
        // Carregar apenas quando usuário interagir
        document.addEventListener('click',(e)=>{
            if(e.target.closest('.btn-secondary')){
                this.loadAll();
            }
        },{once:true,passive:true});
    },
    
    loadAll(){
        requestIdleCallback(()=>{
            ['chamada-silenciosa','na-minha-linguagem','homem-porcaria'].forEach(id=>this.load(id));
        });
    },
    
    load(id){
        const reactions=['like','love','laugh','wow','scared','clever','funny'];
        let total=0;
        
        reactions.forEach(r=>{
            const key=`reaction-${id}-${r}`;
            const count=parseInt(localStorage.getItem(key)||'0',10);
            const el=document.getElementById(`count-${id}-${r}`);
            
            if(el){
                el.textContent=count;
                total+=count;
            }
            
            const userKey=`user-reaction-${id}`;
            if(localStorage.getItem(userKey)===r){
                document.querySelectorAll(`[onclick*="${id}"]`).forEach(btn=>{
                    if(btn.getAttribute('data-reaction')===r)btn.classList.add('active');
                });
            }
        });
        
        const totalEl=document.getElementById(`total-${id}`);
        if(totalEl)totalEl.innerHTML=`Total: <strong>${total}</strong>`;
    },
    
    add(id,type){
        const userKey=`user-reaction-${id}`;
        const current=localStorage.getItem(userKey);
        const key=`reaction-${id}-${type}`;
        
        try{
            if(current===type){
                let count=Math.max(0,parseInt(localStorage.getItem(key)||'0',10)-1);
                localStorage.setItem(key,count.toString());
                localStorage.removeItem(userKey);
                document.querySelectorAll(`[onclick*="${id}"]`).forEach(b=>b.classList.remove('active'));
            }else{
                if(current){
                    let oldCount=Math.max(0,parseInt(localStorage.getItem(`reaction-${id}-${current}`)||'0',10)-1);
                    localStorage.setItem(`reaction-${id}-${current}`,oldCount.toString());
                }
                
                let count=parseInt(localStorage.getItem(key)||'0',10)+1;
                localStorage.setItem(key,count.toString());
                localStorage.setItem(userKey,type);
                
                document.querySelectorAll(`[onclick*="${id}"]`).forEach(b=>{
                    b.classList.remove('active');
                    if(b.getAttribute('data-reaction')===type)b.classList.add('active');
                });
            }
            
            this.load(id);
            
            const btn=window.event?.target?.closest('.reaction-btn');
            if(btn){
                btn.style.transform='scale(1.2)';
                setTimeout(()=>btn.style.transform='',200);
            }
        }catch(e){
            console.error('Erro:',e);
        }
    }
};

// Funções globais simplificadas
function addReaction(id,type){ReactionsManager.add(id,type)}
function toggleReactions(id){
    const c=document.getElementById(`reactions-${id}`);
    if(c)c.style.display=c.style.display==='none'?'block':'none';
}

// 3. SMOOTH SCROLL - Simplificado
function initScroll(){
    document.addEventListener('click',e=>{
        const link=e.target.closest('a[href^="#"]');
        if(!link)return;
        
        const href=link.getAttribute('href');
        if(href==='#')return;
        
        e.preventDefault();
        const target=document.querySelector(href);
        if(target){
            target.scrollIntoView({behavior:'smooth',block:'start'});
            
            const nav=document.getElementById('navLinks');
            if(nav?.classList.contains('active'))nav.classList.remove('active');
        }
    },{passive:false});
}

// 4. FECHAR MENU FORA - Passive listener
function initClickOutside(){
    document.addEventListener('click',e=>{
        const nav=document.getElementById('navLinks');
        const toggle=document.querySelector('.menu-toggle');
        if(nav&&toggle&&!nav.contains(e.target)&&!toggle.contains(e.target)){
            nav.classList.remove('active');
        }
    },{passive:true});
}

// 5. LAZY LOAD - Nativo do browser (já implementado no HTML)

// 6. INICIALIZAÇÃO - Defer com requestIdleCallback
if('requestIdleCallback'in window){
    requestIdleCallback(()=>{
        ReactionsManager.init();
        initScroll();
        initClickOutside();
    });
}else{
    setTimeout(()=>{
        ReactionsManager.init();
        initScroll();
        initClickOutside();
    },1);
}
