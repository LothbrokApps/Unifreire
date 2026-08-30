// =========================================
// QUILL JS instances
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
        // Cifrado AES-256 real
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch(e) {
        console.error("Error encriptando payload:", e);
        return null;
    }
}
function decryptPayload(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch(e) {
        return null;
    }
}





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

function limpiarYExportar() {
    exportExcel();
    
    // Borrado definitivo
    allLeads = [];
    localStorage.removeItem('unifreire_leads');
    
    // Attempt to clear from Apps Script backend (optional, but requested for permanent wipe)
    try {
        fetch(GLOBAL_BACKEND_URL + "?action=limpiarLeads", { method: "POST", mode: "no-cors" });
    } catch(e) {}

    const tb = document.getElementById('leads-body');
    if (tb) {
        tb.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--unifreire-yellow);">La lista ha sido limpiada y exportada definitivamente.</td></tr>`;
    }
    
    const displayCount = document.getElementById('lead-count');
    if(displayCount) displayCount.innerText = "0";
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
    // Inject custom CSS to fix Quill's default styles for dark mode
    const style = document.createElement('style');
    style.innerHTML = `
        .ql-editor { min-height: 100px; color: white !important; font-family: inherit; font-size: inherit; }
        .ql-editor p { margin-bottom: 0.5rem; }
        .ql-editor ul { padding-left: 1.2rem; margin-bottom: 0; }
        .ql-toolbar button { background: var(--unifreire-yellow) !important; color: black !important; border-radius: 3px !important; margin: 0 2px; }
        .ql-toolbar svg { stroke: black; } 
    `;
    document.head.appendChild(style);

    const getOptions = (id) => ({
        theme: 'snow',
        modules: {
            toolbar: '#toolbar-' + id
        }
    });
    
    if (document.getElementById('ce-req-saltillo')) {
        quillReqSaltillo = new Quill('#ce-req-saltillo', getOptions('ce-req-saltillo'));
        quillModSaltillo = new Quill('#ce-mod-saltillo', getOptions('ce-mod-saltillo'));
        quillCostSaltillo = new Quill('#ce-cost-saltillo', getOptions('ce-cost-saltillo'));
        quillModMty = new Quill('#ce-mod-mty', getOptions('ce-mod-mty'));
        quillCostMty = new Quill('#ce-cost-mty', getOptions('ce-cost-mty'));
    }
});
