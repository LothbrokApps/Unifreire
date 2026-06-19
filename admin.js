document.addEventListener('DOMContentLoaded', () => {
    loadLeads();
    loadCareers();
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.target.classList.add('active');
}

async function loadLeads() {
    const tbGen = document.getElementById('leads-gen-body');
    const tbMas = document.getElementById('leads-mas-body');
    const displayCount = document.getElementById('lead-count');
    
    if (!tbGen || !tbMas) return;

    tbGen.innerHTML = `<tr><td colspan="5" style="text-align: center;">Cargando registros desde la nube...</td></tr>`;
    tbMas.innerHTML = `<tr><td colspan="5" style="text-align: center;">Cargando registros desde la nube...</td></tr>`;

    let leads = [];
    try {
        const res = await fetch(GLOBAL_BACKEND_URL + "?action=obtenerLeads");
        leads = await res.json();
        // Guardar copia local para exportación
        localStorage.setItem('unifreire_leads', JSON.stringify(leads));
    } catch(err) {
        console.error("Error cargando leads de la nube, usando locales", err);
        const leadsRaw = localStorage.getItem('unifreire_leads');
        if (leadsRaw) leads = JSON.parse(leadsRaw);
    }

    if (leads.length === 0) {
        tbGen.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay leads registrados aún.</td></tr>`;
        tbMas.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay leads registrados aún.</td></tr>`;
        return;
    }

    if(displayCount) displayCount.innerText = leads.length;
    
    let htmlGen = '';
    let htmlMas = '';
    
    leads.reverse().forEach(lead => {
        const dateStr = lead.fecha ? new Date(lead.fecha).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        const row = `
            <tr>
                <td>${lead.nombre}</td>
                <td>${lead.carrera}</td>
                <td>${lead.telefono}</td>
                <td>${lead.nivel || 'N/A'}</td>
                <td>${dateStr}</td>
            </tr>
        `;
        
        if((lead.nivel && lead.nivel.toLowerCase().includes('maestría')) || (lead.carrera && lead.carrera.toLowerCase().includes('maestría'))) {
            htmlMas += row;
        } else {
            htmlGen += row;
        }
    });
    
    tbGen.innerHTML = htmlGen || `<tr><td colspan="5" style="text-align: center;">Sin registros en esta categoría.</td></tr>`;
    tbMas.innerHTML = htmlMas || `<tr><td colspan="5" style="text-align: center;">Sin registros en esta categoría.</td></tr>`;
    
    const visitCountData = localStorage.getItem('unifreire_visit_count') || "0";
    const displayVisit = document.getElementById('visit-count');
    if(displayVisit) displayVisit.innerText = visitCountData;
}

function loadCareers() {
    const grid = document.getElementById('admin-careers-grid');
    const bannerGrid = document.getElementById('admin-career-banners-grid');
    if(!grid && !bannerGrid) return;
    
    let html = '';
    let bannerHtml = '';
    Object.values(CAREERS_DATA).forEach(c => {
        // Admin tab
        html += `
            <div class="card glass" style="min-height: 150px; padding: 1rem;">
                <div style="font-size: 0.8rem; color: var(--unifreire-yellow);">${c.type}</div>
                <h4 style="margin: 0.5rem 0;">${c.name}</h4>
                <div style="display:flex; gap:0.5rem; margin-top: 1rem;">
                    <button class="btn-primary" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" onclick="openCareerEditor('${c.id}')">Editar Plan</button>
                </div>
            </div>
        `;

        // Banners tab
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
    });
    if(grid) grid.innerHTML = html;
    const compGrid = document.getElementById('admin-campanas-banners-grid');
    if(compGrid) compGrid.innerHTML = bannerHtml;
    
    if(bannerGrid) {
       bannerGrid.innerHTML = '<div style="text-align:center; padding: 2rem; color:var(--text-secondary);">Tarjetas transferidas al panel superior.</div>';
    }
}


let activeImgKey = '';
let activePosKey = '';
let activeZoomKey = '';
let activeDataUrl = '';
let activeMsgEl = null;

function resizeAndSaveImage(file, key, posKey, zoomKey, msgEl) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const max = 1000; 
            
            if (width > height) {
                if (width > max) { height *= max / width; width = max; }
            } else {
                if (height > max) { width *= max / height; height = max; }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            try {
                activeDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                activeImgKey = key;
                activePosKey = posKey;
                activeZoomKey = zoomKey;
                activeMsgEl = msgEl;
                
                document.getElementById('img-preview').style.background = `url(${activeDataUrl}) 50% 50% / 100% no-repeat`;
                document.getElementById('pos-x').value = 50;
                document.getElementById('pos-y').value = 50;
                document.getElementById('scale-z').value = 100;
                document.getElementById('image-modal').style.display = 'flex';
                
            } catch(err) {
                msgEl.innerText = "Error: Imagen descartada (memoria).";
                console.error(err);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Attach sliders
document.addEventListener('DOMContentLoaded', () => {
    const px = document.getElementById('pos-x');
    const py = document.getElementById('pos-y');
    const pz = document.getElementById('scale-z');
    if(px && py && pz) {
        px.addEventListener('input', updatePreviewPos);
        py.addEventListener('input', updatePreviewPos);
        pz.addEventListener('input', updatePreviewPos);
    }
});

function updatePreviewPos() {
    const x = document.getElementById('pos-x').value;
    const y = document.getElementById('pos-y').value;
    const z = document.getElementById('scale-z').value;
    document.getElementById('img-preview').style.backgroundPosition = `${x}% ${y}%`;
    document.getElementById('img-preview').style.backgroundSize = `${z}%`;
}

function saveImageSetup() {
    const x = document.getElementById('pos-x').value;
    const y = document.getElementById('pos-y').value;
    const z = document.getElementById('scale-z').value;
    
    try {
        localStorage.setItem(activeImgKey, activeDataUrl);
        localStorage.setItem(activePosKey, `${x}% ${y}%`);
        localStorage.setItem(activeZoomKey, `${z}%`);
        
        if(activeMsgEl) {
            activeMsgEl.style.color = "var(--unifreire-yellow)";
            activeMsgEl.innerText = "¡Configurado y Guardado con éxito!";
        }
        document.getElementById('image-modal').style.display = 'none';
        setTimeout(() => { if(activeMsgEl) activeMsgEl.innerText = ""; }, 3000);
    } catch(err) {
        if(err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            alert("❗ MEMORIA LLENA: El navegador no permite guardar más imágenes. Debes implementar una base de datos real o Servidor Cloud para subir tantas imágenes de alta calidad (Consulta tu Informe de Producción).");
        } else {
            alert("Ocurrió un error al guardar: " + err.message);
        }
        document.getElementById('image-modal').style.display = 'none';
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

function updateHeroBanner() {
    const msg = document.getElementById('hero-banner-msg');
    const url = document.getElementById('hero-url-input').value.trim();
    if(!url) { msg.innerText = "Ingresa un enlace."; return; }
    localStorage.setItem('unifreire_hero_banner', url);
    guardarConfigEnNube('unifreire_hero_banner', url, msg);
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

document.addEventListener('DOMContentLoaded', () => { setTimeout(renderCarouselAdmin, 200); });

// --- Career Editor Logic ---
let currentEditingCareerId = null;

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
    document.getElementById('ce-req-saltillo').value = (custom.saltillo ? custom.saltillo.requisitos : null) || `<p style="margin-bottom: 0.5rem; margin-top: 1rem;">Para realizar tu inscripción necesitas:</p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Acta de Nacimiento</li><li>Certificado de Bachillerato</li><li>Carta de Autenticidad</li><li>CURP</li><li>Pago del Seguro Facultativo</li><li>Comprobante de Domicilio</li><li>Identificación Oficial (INE)</li></ul>`;
    document.getElementById('ce-mod-saltillo').value = (custom.saltillo ? custom.saltillo.modalidades : null) || `<p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Modalidades disponibles:</b></p><p style="margin-bottom: 1rem;">Matutino, Intermedio, Vespertino, Turno Mixto</p><p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Horarios:</b></p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li><b>Matutino:</b> 7:00 am a 10:00 am</li><li><b>Vespertino:</b> 6:00 pm a 9:00 pm</li><li><b>Intermedio:</b> 10:30 am a 1:30 pm</li><li><b>Turno Mixto:</b> Sábado o Domingo 8:00 am a 3:00 pm</li></ul>`;
    document.getElementById('ce-cost-saltillo').value = (custom.saltillo ? custom.saltillo.costos : null) || `<p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Licenciaturas Costo:</b></p><ul style="margin-bottom: 1rem; padding-left: 1.2rem;"><li>Escolarizados (Lunes a Viernes) $1,820</li><li>Mixto (Sábado y Domingo) $1,920</li></ul><p style="margin-bottom: 0.5rem; color: var(--unifreire-yellow);"><b>Ingenierías Costo:</b></p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Escolarizados (Lunes a Viernes) $2,100</li><li>Mixto (Sábado y Domingo) $2,200</li></ul>`;

    document.getElementById('ce-req-mty').value = (custom.monterrey ? custom.monterrey.requisitos : null) || `<p style="margin-bottom: 0.5rem; margin-top: 1rem;">Para realizar tu inscripción necesitas:</p><ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Acta de Nacimiento</li><li>Certificado de Bachillerato</li><li>Carta de Autenticidad</li><li>CURP</li><li>Pago del Seguro Facultativo</li><li>Comprobante de Domicilio</li><li>Identificación Oficial (INE)</li></ul>`;
    document.getElementById('ce-mod-mty').value = (custom.monterrey ? custom.monterrey.modalidades : null) || `<ul style="margin-bottom: 0; padding-left: 1.2rem;"><li><b>MATUTINO:</b> LUNES A VIERNES 8:00AM A 11:00AM</li><li><b>SABATINO:</b> 8:00AM A 3:00PM</li><li><b>DOMINICAL:</b> 8:00AM A 3:00PM</li></ul>`;
    document.getElementById('ce-cost-mty').value = (custom.monterrey ? custom.monterrey.costos : null) || `<ul style="margin-bottom: 0; padding-left: 1.2rem;"><li>Inscripción $2,000</li><li>Mensualidad $2,000</li><li>Cuota interna $500</li><li>Seguro facultativo $1,250</li></ul>`;

    document.getElementById('careerEditorModal').style.display = 'flex';
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
            requisitos: document.getElementById('ce-req-saltillo').value,
            modalidades: document.getElementById('ce-mod-saltillo').value,
            costos: document.getElementById('ce-cost-saltillo').value
        },
        monterrey: {
            requisitos: document.getElementById('ce-req-mty').value,
            modalidades: document.getElementById('ce-mod-mty').value,
            costos: document.getElementById('ce-cost-mty').value
        }
    };

    localStorage.setItem('unifreire_careers_custom', JSON.stringify(overrides));
    alert('Cambios guardados localmente. Al cargar la carrera se reflejará esta información.');
    document.getElementById('careerEditorModal').style.display = 'none';
    renderCareersTab(); // Refresh list to show updated name
}
