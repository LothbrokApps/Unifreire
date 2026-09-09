
// =========================================
// QUILL JS INSTANCES
// =========================================
let quillReqSaltillo, quillModSaltillo, quillCostSaltillo;
let quillModMty, quillCostMty;

// =========================================
// AES-256 ENCRYPTION PAYLOAD SECURE
// =========================================
const SECRET_KEY = "UNIFREIRE_SECURE_KEY_2026_!@#";
function encryptPayload(jsonData) {
    try {
        const jsonString = JSON.stringify(jsonData);
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch(e) { return null; }
}
function decryptPayload(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch(e) { return null; }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Loads
    loadLeads();
    if (typeof loadCareers === 'function') loadCareers();
    if (typeof renderPlantelesAdmin === 'function') renderPlantelesAdmin();
    
    // 2. Load Visit Stats
    const visitCounter = document.getElementById('admin-visit-count');
    if (visitCounter) {
        let localVisits = localStorage.getItem('unifreire_visit_count') || '0';
        visitCounter.innerText = parseInt(localVisits).toLocaleString();
    }

    // 3. Initialize Quill JS correctly
    const style = document.createElement('style');
    style.innerHTML = `
        .ql-editor { min-height: 120px; color: white !important; font-family: 'Poppins', sans-serif; font-size: 1rem; }
        .ql-editor p { margin-bottom: 0.5rem; }
        .ql-editor ul { padding-left: 1.2rem; margin-bottom: 0; }
        .ql-toolbar.ql-snow { background: #f1f1f1 !important; border-radius: 4px 4px 0 0; border-color: rgba(255,255,255,0.2) !important; }
        .ql-container.ql-snow { border-radius: 0 0 4px 4px; border-color: rgba(255,255,255,0.2) !important; }
    `;
    document.head.appendChild(style);

    document.getElementById('ce-title')?.addEventListener('input', syncLivePreview);
    document.getElementById('ce-desc')?.addEventListener('input', syncLivePreview);

    const quillOptions = {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    };
    
    try {
        if (typeof Quill !== 'undefined' && document.getElementById('ce-req-saltillo') && !document.querySelector('#ce-req-saltillo .ql-editor')) {
            quillReqSaltillo = new Quill('#ce-req-saltillo', quillOptions);
            quillModSaltillo = new Quill('#ce-mod-saltillo', quillOptions);
            quillCostSaltillo = new Quill('#ce-cost-saltillo', quillOptions);
            quillModMty = new Quill('#ce-mod-mty', quillOptions);
            quillCostMty = new Quill('#ce-cost-mty', quillOptions);
            
            [quillReqSaltillo, quillModSaltillo, quillCostSaltillo].forEach(q => {
                q.on('text-change', syncLivePreview);
            });
        }
    } catch(err) {
        console.error("Error inicializando Quill", err);
    }
});


function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.target.classList.add('active');
}

let currentPage = 1;
const itemsPerPage = 50;
let allLeads = [];

async function loadLeads() {
    const tbody = document.getElementById('leads-body');
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Cargando registros...</td></tr>`;

    // Local leads
    const leadsRaw = localStorage.getItem('unifreire_leads');
    if (leadsRaw) {
        try { allLeads = JSON.parse(leadsRaw); } catch(e) { allLeads = []; }
    } else {
        allLeads = [];
    }

    try {
        const res = await fetch(GLOBAL_BACKEND_URL + "?action=obtenerLeads");
        const cloudText = await res.text();
        
        // Intentar descifrar si el servidor envió el JSON encriptado (AES-256)
        let cloudLeads = decryptPayload(cloudText);
        
        // Si no está encriptado (retrocompatibilidad), parsear normal
        if (!cloudLeads) {
            try { cloudLeads = JSON.parse(cloudText); } catch(e) {}
        }
        
        if (cloudLeads && Array.isArray(cloudLeads) && cloudLeads.length > 0) {
            // Filter ghost/anonymous leads that come from empty sheet rows
            allLeads = cloudLeads.filter(lead => lead.nombre && lead.nombre.trim() !== "");
            localStorage.setItem('unifreire_leads', JSON.stringify(allLeads));
        }
    } catch(err) {
        console.error("Usando leads locales", err);
    }
    
    renderLeadsPage();
}

function renderLeadsPage() {
    const tbody = document.getElementById('leads-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const displayCount = document.getElementById('lead-count');
    if (displayCount) displayCount.innerText = allLeads.length;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allLeads.length);
    const pageLeads = allLeads.slice(startIndex, endIndex);
    
    if (pageLeads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay registros de leads.</td></tr>`;
    }

    pageLeads.forEach(lead => {
        let plant = lead.plantel || 'Saltillo';
        let badge = plant.toLowerCase() === 'monterrey' 
                    ? `<span style="background:var(--unifreire-blue); color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;">MTY</span>` 
                    : `<span style="background:var(--unifreire-green); color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem;">SALT</span>`;
                    
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${lead.nombre}</td>
            <td><a href="https://wa.me/52${lead.telefono}" target="_blank" style="color:var(--unifreire-yellow); text-decoration:none;">${lead.telefono}</a></td>
            <td>${lead.carrera || 'N/A'} ${badge}</td>
            <td>${lead.nivel || 'N/A'}</td>
            <td>${lead.fecha || 'N/A'}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add pagination controls
    const totalPages = Math.ceil(allLeads.length / itemsPerPage);
    if (totalPages > 1) {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align: center; padding: 1rem;">
            <button onclick="if(currentPage > 1) { currentPage--; renderLeadsPage(); }" style="padding: 0.5rem; background: var(--unifreire-yellow); color: black; border: none; cursor: pointer; margin-right: 10px; border-radius: 4px;">Anterior</button>
            <span style="color: white;">Página ${currentPage} de ${totalPages}</span>
            <button onclick="if(currentPage < ${totalPages}) { currentPage++; renderLeadsPage(); }" style="padding: 0.5rem; background: var(--unifreire-yellow); color: black; border: none; cursor: pointer; margin-left: 10px; border-radius: 4px;">Siguiente</button>
        </td>`;
        tbody.appendChild(tr);
    }
}


async function guardarConfigEnNube(llave, valor, msgElement) {
    if(msgElement) msgElement.innerText = "Guardando en la nube... espera.";
    const params = new URLSearchParams({
        action: "guardarConfig",
        llave: llave,
        valor: valor
    });
    try {
        await fetch(GLOBAL_BACKEND_URL, { 
            method: "POST", 
            body: params,
            mode: "no-cors"
        });
        if(msgElement) msgElement.innerText = "¡Sincronizado con éxito en la nube!";
    } catch(err) {
        if(msgElement) msgElement.innerText = "Error de conexión, guardado solo localmente.";
    }
    setTimeout(() => { if(msgElement) msgElement.innerText=""; }, 3000);
}



function updateCareerBanner(id) {
    const msg = document.getElementById(`msg-${id}`);
    const url = document.getElementById(`url-${id}`).value.trim();
    if(!url) { msg.innerText = "Ingresa un enlace."; return; }
    localStorage.setItem(`unifreire_banner_${id}`, url);
    guardarConfigEnNube(`unifreire_banner_${id}`, url, msg);
}

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    let dz = e.target.closest('.drop-zone');
    if(dz) dz.classList.add('dragover');
});
document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    let dz = e.target.closest('.drop-zone');
    if(dz) dz.classList.remove('dragover');
});
document.addEventListener('drop', (e) => {
    e.preventDefault();
    let dz = e.target.closest('.drop-zone');
    if(dz) {
        dz.classList.remove('dragover');
        if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const input = dz.querySelector('input[type="file"]');
            if(input) {
                if(input.id === 'hero-banner-input') {
                    updateHeroBanner(file);
                } else {
                    const id = input.id.replace('file-', '');
                    updateCareerBanner(id, file);
                }
            }
        }
    }
});


async function limpiarYExportar() {
    exportExcel();
    if(confirm('¿Estás seguro de que deseas limpiar la base de datos de leads local y en la nube? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('unifreire_leads');
        try {
            await fetch(GLOBAL_BACKEND_URL + "?action=limpiarLeads", { method: "POST", mode: "no-cors" });
        } catch(e) {}
        alert('Leads limpiados localmente y en la nube.');
        loadLeads();
    }
}

function exportExcel() {
    // Basic CSV mock functionality
    const leadsRaw = localStorage.getItem('unifreire_leads');
    if(!leadsRaw) {
        alert("No hay leads para exportar.");
        return;
    }

    const leads = JSON.parse(leadsRaw);
    let csvContent = "data:text/csv;charset=utf-8,Nombre,Carrera,Telefono,Email,Nivel,Horario,Fecha\n";

    leads.forEach(l => {
        const row = [l.nombre, l.carrera, l.telefono, l.email, l.nivel, l.horario, l.fecha].join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "unifreire_leads.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Carousel Logic
function renderCarouselAdmin() {
    const grid = document.getElementById('carousel-preview-grid');
    if(!grid) return;
    
    function getDirectUrl(url) {
        if (!url) return url;
        if (url.includes('drive.usercontent.google.com/download')) return url;
        if (!url.includes('drive.google.com')) return url;
        const regexD = /\/d\/([a-zA-Z0-9_-]+)/;
        const regexId = /id=([a-zA-Z0-9_-]+)/;
        let id = null;
        if (regexD.test(url)) id = url.match(regexD)[1];
        else if (regexId.test(url)) id = url.match(regexId)[1];
        if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1920-h1080`;
        return url;
    }

    const pics = JSON.parse(localStorage.getItem('unifreire_carousel_images') || '[]');
    if(pics.length === 0) {
        grid.innerHTML = '<p style="color:gray;">No hay fotografías subidas. Se mostrará el carrusel por defecto.</p>';
        return;
    }
    
    let h = '';
    pics.forEach((p, idx) => {
        h += `
            <div class="card glass" style="padding: 0; overflow: hidden; position: relative;">
                <div style="height: 150px; background: url('${getDirectUrl(p)}') center/cover no-repeat;"></div>
                <button onclick="deleteCarouselPic(${idx})" style="position:absolute; top:5px; right:5px; background:red; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">X</button>
            </div>
        `;
    });
    grid.innerHTML = h;
}

function deleteCarouselPic(idx) {
    if(!confirm("¿Eliminar fotografía?")) return;
    const pics = JSON.parse(localStorage.getItem('unifreire_carousel_images') || '[]');
    pics.splice(idx, 1);
    localStorage.setItem('unifreire_carousel_images', JSON.stringify(pics));
    renderCarouselAdmin();
    guardarConfigEnNube('unifreire_carousel_images', JSON.stringify(pics), null);
}

function addCarouselUrl() {
    const input = document.getElementById('carousel-url-input');
    const url = input.value.trim();
    const msg = document.getElementById('carousel-upload-msg');
    
    if(!url) {
        msg.innerText = "Por favor ingresa un enlace directo.";
        setTimeout(() => msg.innerText="", 3000);
        return;
    }
    
    let pics = JSON.parse(localStorage.getItem('unifreire_carousel_images') || '[]');
    pics.push(url);
    
    localStorage.setItem('unifreire_carousel_images', JSON.stringify(pics));
    input.value = '';
    renderCarouselAdmin();
    guardarConfigEnNube('unifreire_carousel_images', JSON.stringify(pics), msg);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Loads
    loadLeads();
    if (typeof loadCareers === 'function') loadCareers();
    if (typeof renderPlantelesAdmin === 'function') renderPlantelesAdmin();
    
    // 2. Load Visit Stats
    const visitCounter = document.getElementById('admin-visit-count');
    if (visitCounter) {
        let localVisits = localStorage.getItem('unifreire_visit_count') || '0';
        visitCounter.innerText = parseInt(localVisits).toLocaleString();
    }

    // 3. Initialize Quill JS correctly
    const style = document.createElement('style');
    style.innerHTML = `
        .ql-editor { min-height: 120px; color: white !important; font-family: 'Poppins', sans-serif; font-size: 1rem; }
        .ql-editor p { margin-bottom: 0.5rem; }
        .ql-editor ul { padding-left: 1.2rem; margin-bottom: 0; }
        .ql-toolbar.ql-snow { background: #f1f1f1 !important; border-radius: 4px 4px 0 0; border-color: rgba(255,255,255,0.2) !important; }
        .ql-container.ql-snow { border-radius: 0 0 4px 4px; border-color: rgba(255,255,255,0.2) !important; }
    `;
    document.head.appendChild(style);

    document.getElementById('ce-title')?.addEventListener('input', syncLivePreview);
    document.getElementById('ce-desc')?.addEventListener('input', syncLivePreview);

    const quillOptions = {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    };
    
    try {
        if (typeof Quill !== 'undefined' && document.getElementById('ce-req-saltillo') && !document.querySelector('#ce-req-saltillo .ql-editor')) {
            quillReqSaltillo = new Quill('#ce-req-saltillo', quillOptions);
            quillModSaltillo = new Quill('#ce-mod-saltillo', quillOptions);
            quillCostSaltillo = new Quill('#ce-cost-saltillo', quillOptions);
            quillModMty = new Quill('#ce-mod-mty', quillOptions);
            quillCostMty = new Quill('#ce-cost-mty', quillOptions);
            
            [quillReqSaltillo, quillModSaltillo, quillCostSaltillo].forEach(q => {
                q.on('text-change', syncLivePreview);
            });
        }
    } catch(err) {
        console.error("Error inicializando Quill", err);
    }
});


// --- Career Editor Logic ---
let currentEditingCareerId = null;


function loadCareers() {
    const grid = document.getElementById('admin-careers-grid');
    const bannerGrid = document.getElementById('admin-campanas-banners-grid');
    if(!grid && !bannerGrid) return;
    
    let html = '';
    let bannerHtml = '';
    Object.values(CAREERS_DATA).forEach(c => {
        // Admin tab
        if(grid) {
            html += `
                <div class="card glass" style="min-height: 150px; padding: 1rem;">
                    <div style="font-size: 0.8rem; color: var(--unifreire-yellow);">${c.type}</div>
                    <h4 style="margin: 0.5rem 0;">${c.name}</h4>
                    <div style="display:flex; gap:0.5rem; margin-top: 1rem;">
                        <button class="btn-primary" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" onclick="openCareerEditor('${c.id}')">Editar Plan</button>
                    </div>
                </div>
            `;
        }

        // Banners tab
        if(bannerGrid) {
            bannerHtml += `
                <div class="card glass" style="min-height: 150px; padding: 1rem;">
                    <div style="font-size: 0.8rem; color: var(--unifreire-yellow);">${c.type}</div>
                    <h4 style="margin: 0.5rem 0; font-size: 1.1rem;">${c.name}</h4>
                    
                    <div style="margin-top: 1rem;">
                       <input type="text" id="url-${c.id}" placeholder="Enlace directo Google Drive" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--glass-border); background: var(--bg-dark); color: white; font-size: 0.8rem; margin-bottom: 0.5rem;">
                       <button class="btn-primary" style="width: 100%; font-size: 0.8rem; padding: 0.4rem;" onclick="updateCareerBanner('${c.id}')">Guardar Enlace</button>
                    </div>
                    <p id="msg-${c.id}" style="color: var(--unifreire-yellow); font-size: 0.8rem; margin-top: 0.5rem;"></p>
                </div>
            `;
        }
    });

    if(grid) grid.innerHTML = html;
    if(bannerGrid) bannerGrid.innerHTML = bannerHtml;
}


function openCareerEditor(careerId) {
    currentEditingCareerId = careerId;
    const c = CAREERS_DATA[careerId];
    if(!c) return;

    // Load overrides if any
    let overrides = {};
    try {
        const stored = localStorage.getItem('unifreire_careers_custom');
        if(stored) overrides = JSON.parse(stored);
    } catch(e) {}

    const custom = overrides[careerId] || {};

    document.getElementById('ce-career-id').innerText = custom.name || c.name;
    document.getElementById('ce-title').value = custom.name || c.name;
    document.getElementById('ce-desc').value = custom.description || c.description;
    
    // Default flags (true if not set)
    document.getElementById('ce-flag-saltillo').checked = custom.availableSaltillo !== false;
    document.getElementById('ce-flag-mty').checked = custom.availableMonterrey !== false;


    // Default HTML blocks if custom is not set
    const reqS = (custom.saltillo ? custom.saltillo.requisitos : null) || `<p style="margin-bottom: 0.5rem; margin-top: 1rem;">Para realizar tu inscripción necesitas:</p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Acta de Nacimiento</li><li>Certificado de Bachillerato</li><li>Carta de Autenticidad</li><li>CURP</li><li>Pago del Seguro Facultativo</li><li>Comprobante de Domicilio</li><li>Identificación Oficial (INE)</li></ul>`;
    const modS = (custom.saltillo ? custom.saltillo.modalidades : null) || `<ul style="margin-bottom: 0; padding-left: 1.2rem;"><li><b>Matutino:</b> 7:00 am a 10:00 am</li><li><b>Vespertino:</b> 6:00 pm a 9:00 pm</li><li><b>Intermedio:</b> 10:30 am a 1:30 pm</li><li><b>Turno Mixto:</b> Sábado o Domingo 8:00 am a 3:00 pm</li></ul>`;
    const costS = (custom.saltillo ? custom.saltillo.costos : null) || `<p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Licenciaturas:</b></p><ul style="margin-bottom: 1rem; padding-left: 1.2rem;"><li>Escolarizados (Lunes a Viernes) $1,820</li><li>Mixto (Sábado y Domingo) $1,920</li></ul><p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Ingenierías:</b></p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Escolarizados (Lunes a Viernes) $2,100</li><li>Mixto (Sábado y Domingo) $2,200</li></ul>`;
    const modM = (custom.monterrey ? custom.monterrey.modalidades : null) || `<ul style="margin-bottom: 0; padding-left: 1.2rem;"><li><b>MATUTINO:</b> LUNES A VIERNES 8:00AM A 11:00AM</li><li><b>SABATINO:</b> 8:00AM A 3:00PM</li><li><b>DOMINICAL:</b> 8:00AM A 3:00PM</li></ul>`;
    const costM = (custom.monterrey ? custom.monterrey.costos : null) || `<ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Inscripción $2,000</li><li>Mensualidad $2,000</li><li>Cuota interna $500</li><li>Seguro facultativo $1,250</li></ul>`;

    if(quillReqSaltillo) quillReqSaltillo.root.innerHTML = reqS; else document.getElementById('ce-req-saltillo').innerHTML = reqS;
    if(quillModSaltillo) quillModSaltillo.root.innerHTML = modS; else document.getElementById('ce-mod-saltillo').innerHTML = modS;
    if(quillCostSaltillo) quillCostSaltillo.root.innerHTML = costS; else document.getElementById('ce-cost-saltillo').innerHTML = costS;
    if(quillModMty) quillModMty.root.innerHTML = modM; else document.getElementById('ce-mod-mty').innerHTML = modM;
    if(quillCostMty) quillCostMty.root.innerHTML = costM; else document.getElementById('ce-cost-mty').innerHTML = costM;

    document.getElementById('careerEditorModal').style.display = 'flex';
    syncLivePreview();

}

function saveCareerChanges() {
    if(!currentEditingCareerId) return;

    let overrides = {};
    try {
        const stored = localStorage.getItem('unifreire_careers_custom');
        if(stored) overrides = JSON.parse(stored);
    } catch(e) {}

    overrides[currentEditingCareerId] = {
        name: document.getElementById('ce-title').value,
        description: document.getElementById('ce-desc').value,
        availableSaltillo: document.getElementById('ce-flag-saltillo').checked,
        availableMonterrey: document.getElementById('ce-flag-mty').checked,
        saltillo: {
            requisitos: quillReqSaltillo ? quillReqSaltillo.root.innerHTML : document.getElementById('ce-req-saltillo').innerHTML,
            modalidades: quillModSaltillo ? quillModSaltillo.root.innerHTML : document.getElementById('ce-mod-saltillo').innerHTML,
            costos: quillCostSaltillo ? quillCostSaltillo.root.innerHTML : document.getElementById('ce-cost-saltillo').innerHTML
        },
        monterrey: {
            modalidades: quillModMty ? quillModMty.root.innerHTML : document.getElementById('ce-mod-mty').innerHTML,
            costos: quillCostMty ? quillCostMty.root.innerHTML : document.getElementById('ce-cost-mty').innerHTML
        }
    };

    localStorage.setItem('unifreire_careers_custom', JSON.stringify(overrides));
    // Disparar limpiador de caché global (Cache Buster)
    localStorage.setItem('unifreire_cache_version', Date.now().toString());

    alert('Cambios guardados localmente. Al cargar la carrera se reflejará esta información.');
    document.getElementById('careerEditorModal').style.display = 'none';
    renderCareersTab(); // Refresh list to show updated name
}


// ==================== PLANTELES LOGIC ====================
const DEFAULT_PLANTELES_ADMIN = [
    { nombre: "Plantel Centro", ubicacion: "📍 José María Arteaga 240<br>Zona Centro, Saltillo, Coah.", telefono: "📲 (844) 410-5762", liga: "https://maps.app.goo.gl/tbLyqT6qCdnmW3in6" },
    { nombre: "Plantel Matamoros", ubicacion: "📍 Mariano Matamoros 766<br>Zona Centro, Saltillo, Coah.", telefono: "📲 (844) 726-0527", liga: "https://maps.app.goo.gl/L3NqmizFhWFZWsFw9" },
    { nombre: "Plantel Sur", ubicacion: "📍 Calle 2 #2648, esq. Blvd. Hidalgo<br>Fracc. Miguel Hidalgo, Saltillo, Coah.", telefono: "📲 (844) 112-4654", liga: "https://maps.app.goo.gl/v49aGjP2VZUDNmpSA" },
    { nombre: "Plantel Monterrey", ubicacion: "📍 Albino Espinosa Ote 324<br>entre Galeana y E. Carranza, N.L.", telefono: "📲 (81) 163-70651", liga: "https://maps.app.goo.gl/fEiJBCyAh1eWbuLt7" }
];

function getPlanteles() {
    let planteles = DEFAULT_PLANTELES_ADMIN;
    try {
        const custom = localStorage.getItem('unifreire_planteles_custom');
        if (custom) planteles = JSON.parse(custom);
    } catch(e) {}
    return planteles;
}

function renderPlantelesAdmin() {
    const tbody = document.getElementById('planteles-admin-body');
    if (!tbody) return;
    
    const planteles = getPlanteles();
    if (planteles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay planteles.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = planteles.map((p, index) => `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.ubicacion}</td>
            <td>${p.telefono}</td>
            <td>
                <button onclick="openPlantelEditor(${index})" class="btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Editar</button>
            </td>
        </tr>
    `).join('');
}

function openPlantelEditor(index) {
    const planteles = getPlanteles();
    document.getElementById('pe-id').value = index;
    
    if (index === -1) {
        document.getElementById('pe-modal-title').innerText = "Agregar Plantel";
        document.getElementById('pe-nombre').value = "";
        document.getElementById('pe-ubicacion').value = "";
        document.getElementById('pe-telefono').value = "";
        document.getElementById('pe-liga').value = "";
        document.getElementById('pe-btn-delete').style.display = "none";
    } else {
        const p = planteles[index];
        document.getElementById('pe-modal-title').innerText = "Editar Plantel";
        document.getElementById('pe-nombre').value = p.nombre;
        document.getElementById('pe-ubicacion').value = p.ubicacion;
        document.getElementById('pe-telefono').value = p.telefono;
        document.getElementById('pe-liga').value = p.liga;
        document.getElementById('pe-btn-delete').style.display = "block";
    }
    
    document.getElementById('plantelEditorModal').style.display = 'flex';
}

function savePlantel() {
    const planteles = getPlanteles();
    const index = parseInt(document.getElementById('pe-id').value);
    
    const nuevo = {
        nombre: document.getElementById('pe-nombre').value,
        ubicacion: document.getElementById('pe-ubicacion').value,
        telefono: document.getElementById('pe-telefono').value,
        liga: document.getElementById('pe-liga').value
    };
    
    if (index === -1) {
        planteles.push(nuevo);
    } else {
        planteles[index] = nuevo;
    }
    
    localStorage.setItem('unifreire_planteles_custom', JSON.stringify(planteles));
    // Disparar limpiador de caché global (Cache Buster)
    localStorage.setItem('unifreire_cache_version', Date.now().toString());

    renderPlantelesAdmin();
    document.getElementById('plantelEditorModal').style.display = 'none';
    alert("Plantel guardado exitosamente. Se reflejará en la web automáticamente.");
}

function deletePlantel() {
    if(!confirm("¿Estás seguro de eliminar este plantel?")) return;
    
    const index = parseInt(document.getElementById('pe-id').value);
    if(index === -1) return;
    
    const planteles = getPlanteles();
    planteles.splice(index, 1);
    
    localStorage.setItem('unifreire_planteles_custom', JSON.stringify(planteles));
    // Disparar limpiador de caché global (Cache Buster)
    localStorage.setItem('unifreire_cache_version', Date.now().toString());

    renderPlantelesAdmin();
    document.getElementById('plantelEditorModal').style.display = 'none';
}


// =========================================
// HERO BANNER ADJUSTER
// =========================================
let heroAdjustUrl = "";

function openHeroAdjuster() {
    const url = document.getElementById('hero-url-input').value.trim();
    if(!url) {
        document.getElementById('hero-banner-msg').innerText = "Ingresa un enlace."; 
        return; 
    }
    heroAdjustUrl = url;
    
    document.getElementById('scale-z').value = 100;
    document.getElementById('pos-x').value = 50;
    document.getElementById('pos-y').value = 50;
    
    const preview = document.getElementById('img-preview');
    preview.style.backgroundImage = `url(${url})`;
    preview.style.backgroundSize = "100%";
    preview.style.backgroundPosition = "50% 50%";
    
    document.getElementById('image-modal').style.display = 'flex';
}

function updatePreviewStyle() {
    const z = document.getElementById('scale-z').value;
    const x = document.getElementById('pos-x').value;
    const y = document.getElementById('pos-y').value;
    
    const preview = document.getElementById('img-preview');
    preview.style.backgroundSize = `${z}%`;
    preview.style.backgroundPosition = `${x}% ${y}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scale-z')?.addEventListener('input', updatePreviewStyle);
    document.getElementById('pos-x')?.addEventListener('input', updatePreviewStyle);
    document.getElementById('pos-y')?.addEventListener('input', updatePreviewStyle);
});

function saveImageSetup() {
    const scale = document.getElementById('scale-z').value / 100;
    const x = document.getElementById('pos-x').value;
    const y = document.getElementById('pos-y').value;
    
    const config = {
        url: heroAdjustUrl,
        scale: scale,
        position: `${x}% ${y}%`
    };
    
    localStorage.setItem('unifreire_hero_banner', JSON.stringify(config));
    // Disparar limpiador de caché global (Cache Buster)
    localStorage.setItem('unifreire_cache_version', Date.now().toString());

    document.getElementById('image-modal').style.display = 'none';
    const msg = document.getElementById('hero-banner-msg');
    msg.innerText = "Hero Banner ajustado y guardado exitosamente.";
    
    // Attempt saving to cloud if that function exists
    if(typeof guardarConfigEnNube === 'function') {
        guardarConfigEnNube('unifreire_hero_banner', JSON.stringify(config), msg);
    }
}


function syncLivePreview() {
    const title = document.getElementById('ce-title').value;
    const desc = document.getElementById('ce-desc').value;
    document.getElementById('sim-title').innerText = title || 'Título Carrera';
    document.getElementById('sim-desc').innerText = desc || 'Descripción';
    
    document.getElementById('sim-req').innerHTML = quillReqSaltillo ? quillReqSaltillo.root.innerHTML : document.getElementById('ce-req-saltillo').innerHTML;
    document.getElementById('sim-mod').innerHTML = quillModSaltillo ? quillModSaltillo.root.innerHTML : document.getElementById('ce-mod-saltillo').innerHTML;
    document.getElementById('sim-cost').innerHTML = quillCostSaltillo ? quillCostSaltillo.root.innerHTML : document.getElementById('ce-cost-saltillo').innerHTML;
}
