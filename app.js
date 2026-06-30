document.addEventListener('DOMContentLoaded', () => {
    cargarConfigDesdeNube();
    
    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Dynamic Hero Loading (carga rápida inicial con lo local)
    const heroImg = document.getElementById('main-hero-img');
    if (heroImg) {
        const savedHero = localStorage.getItem('unifreire_hero_banner');
        if (savedHero) heroImg.src = savedHero;
    }

    const grid = document.getElementById('careers-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (grid) {
        renderCareers('all');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filter
                const filter = e.target.getAttribute('data-filter');
                renderCareers(filter);
            });
        });
    }
});

function renderCareers(filter) {
    const grid = document.getElementById('careers-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Sort array from object
    const careersArray = Object.values(CAREERS_DATA);

    const filtered = filter === 'all' 
        ? careersArray 
        : careersArray.filter(c => c.type === filter);

    filtered.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card glass';
        card.innerHTML = `
            <div>
                <div class="card-type">${c.type}</div>
                <h3 class="card-title">${c.name}</h3>
                <div class="card-duration">${c.duration}</div>
            </div>
            <button class="btn-primary" onclick="viewCareer('${c.id}')">Ver más</button>
        `;
        grid.appendChild(card);
    });
}

function viewCareer(id) {
    localStorage.setItem("carreraSeleccionada", id);
    window.location.href = "career.html";
}

async function cargarConfigDesdeNube() {
    try {
        const res = await fetch(GLOBAL_BACKEND_URL + "?action=obtenerConfig");
        const config = await res.json();
        
        function getDirectUrl(url) {
            if (!url) return url;
            if (url.includes('drive.usercontent.google.com/download')) return url; // Already direct
            if (!url.includes('drive.google.com')) return url;
            
            const regexD = /\/d\/([a-zA-Z0-9_-]+)/;
            const regexId = /id=([a-zA-Z0-9_-]+)/;
            let id = null;
            if (regexD.test(url)) id = url.match(regexD)[1];
            else if (regexId.test(url)) id = url.match(regexId)[1];
            
            if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1920-h1080`;
            return url;
        }
        
        if (config.hero_banner) {
            const finalUrl = getDirectUrl(config.hero_banner);
            localStorage.setItem('unifreire_hero_banner', finalUrl);
            const heroImg = document.getElementById('main-hero-img');
            if (heroImg && heroImg.src !== finalUrl) {
                heroImg.src = finalUrl;
            }
        }
        
        if (config.carrusel && config.carrusel.length > 0) {
            const finalCarrusel = config.carrusel.map(getDirectUrl);
            localStorage.setItem('unifreire_carousel_images', JSON.stringify(finalCarrusel));
            if (typeof renderCarousel === 'function') renderCarousel();
        }
        
        if (config.banners) {
            Object.keys(config.banners).forEach(id => {
                const finalBannerUrl = getDirectUrl(config.banners[id]);
                localStorage.setItem(`unifreire_banner_${id}`, finalBannerUrl);
                
                const header = document.querySelector('.career-header');
                const cId = localStorage.getItem('carreraSeleccionada');
                if (header && cId === id) {
                    header.style.backgroundImage = `url('${finalBannerUrl}')`;
                }
            });
        }
    } catch(err) {
        console.error("Error sincronizando config desde la nube:", err);
    }
}


const DEFAULT_PLANTELES = [
    { nombre: "Plantel Centro", ubicacion: "📍 José María Arteaga 240<br>Zona Centro, Saltillo, Coah.", telefono: "📲 (844) 410-5762", liga: "https://maps.app.goo.gl/tbLyqT6qCdnmW3in6" },
    { nombre: "Plantel Matamoros", ubicacion: "📍 Mariano Matamoros 766<br>Zona Centro, Saltillo, Coah.", telefono: "📲 (844) 726-0527", liga: "https://maps.app.goo.gl/L3NqmizFhWFZWsFw9" },
    { nombre: "Plantel Sur", ubicacion: "📍 Calle 2 #2648, esq. Blvd. Hidalgo<br>Fracc. Miguel Hidalgo, Saltillo, Coah.", telefono: "📲 (844) 112-4654", liga: "https://maps.app.goo.gl/v49aGjP2VZUDNmpSA" },
    { nombre: "Plantel Monterrey", ubicacion: "📍 Albino Espinosa Ote 324<br>entre Galeana y E. Carranza, N.L.", telefono: "📲 (81) 163-70651", liga: "https://maps.app.goo.gl/fEiJBCyAh1eWbuLt7" }
];

function renderPlantelesFooter() {
    const container = document.getElementById('planteles-container');
    if (!container) return;
    let planteles = DEFAULT_PLANTELES;
    try {
        const custom = localStorage.getItem('unifreire_planteles_custom');
        if (custom) planteles = JSON.parse(custom);
    } catch(e) {}

    container.innerHTML = planteles.map(p => `
        <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px;">
            <h4 style="color: white; margin-bottom: 1rem;">${p.nombre}</h4>
            <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: #bbb;">${p.ubicacion}</p>
            <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #bbb;">${p.telefono}</p>
            <a href="${p.liga}" target="_blank" class="btn-accent" style="font-size: 0.8rem; padding: 0.5rem 1rem; display: inline-block;">Ver en Google Maps</a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderPlantelesFooter();
});
