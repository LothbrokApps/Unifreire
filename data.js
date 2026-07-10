// Carpeta compartida de imágenes en Drive:
const FOLDER_IMAGENES_DRIVE = "https://drive.google.com/drive/folders/1Kr4_7cmDCLOSxYW5gdgCla9j3jDe2mj5?usp=sharing";
// IMPORTANTE: Para usar una imagen en 'defaultBanner', usa el formato directo con el ID:
// defaultBanner: "https://drive.google.com/uc?export=view&id=EL_ID_DE_LA_FOTO"

// URL del Backend en Google Apps Script
const GLOBAL_BACKEND_URL = "https://script.google.com/macros/s/AKfycbwcqbWE9a8gSXGOEKVGssh3zCWrv-2VGNIAbE4RGvbpfEWbUyKedxAesWgNOIVgUj-K8w/exec";

const CAREERS_DATA = {
    "lic-arquitectura": {
        id: "lic-arquitectura",
        defaultBanner: "https://drive.google.com/thumbnail?id=12chFEcVdJVHqvlv3XWXl3T1CwqUQOEOB&sz=w1920-h1080",
        name: "Licenciatura en Arquitectura",
        type: "Licenciatura",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20194324 / 20-Nov-19",
        description: "Transforma espacios y crea soluciones arquitectónicas innovadoras, estéticas y funcionales, aplicando tecnología, arte y matemáticas en cada proyecto.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Proyectos arquitectónicos I", "Geometría descriptiva", "Métodos y técnicas de dibujo I", "Arte y arquitectura", "Matemáticas I", "Superficies geométricas arquitectónicas"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Proyectos arquitectónicos II", "Representación arquitectónica I", "Modelos volumétricos", "Métodos y técnicas de dibujo II", "Teoría de la arquitectura", "Matemáticas II"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Proyectos arquitectónicos III", "Análisis de edificios", "Representación arquitectónica II", "Teorías actuales de la arquitectura", "Estática", "Materiales y construcción I"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Elementos de topografía", "Proyectos arquitectónicos IV", "Geometría del espacio edificado", "Presentación de proyectos arquitectónicos I", "Historia de la arquitectura I", "Instalaciones hidrosanitarias y gas", "Materiales y construcción II"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Resistencia de materiales", "Proyectos arquitectónicos V", "Presentación de proyectos arquitectónicos II", "Historia de la arquitectura II", "Instalaciones eléctricas e iluminación", "Estructuras I", "Procedimientos de construcción I"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Proyectos arquitectónicos VI", "Arquitectura bioclimática", "Historia de la arquitectura III", "Instalaciones avanzadas", "Estructuras II", "Procedimientos de construcción II"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Proyectos arquitectónicos VII", "Urbanismo", "Historia de la arquitectura IV", "Instalaciones especiales", "Estructuras III"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Procedimientos de construcción III", "Organización de proyectos y obras I", "Proyectos integrales I", "Diseño urbano y ambiental I", "Historia de la arquitectura V"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Procedimientos de construcción IV", "Proyectos integrales II", "Diseño urbano y ambiental II", "Organización de proyectos y obras II"] }
        ]
    },
    "lic-contaduria": {
        id: "lic-contaduria",
        defaultBanner: "https://drive.google.com/thumbnail?id=1ClM0HPvXsr3FrUPAxVL7bVtp_Pwd9ZVz&sz=w1920-h1080",
        name: "Licenciatura en Contaduría Pública",
        type: "Licenciatura",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20194326 / 20-Nov-19",
        description: "Domina las finanzas, presupuesto y auditoría para el manejo óptimo de los recursos en empresas y organizaciones.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Contabilidad I", "Matemáticas para la contaduría I", "Dinámica social", "Administración I", "Métodos de investigación"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Contabilidad II", "Matemáticas para contaduría II", "Comunicación escrita", "Administración II", "Informática y computación I"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Contabilidad III", "Estadística I", "Administración de recursos humanos", "Fundamentos de derecho", "Informática y computación II"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Contabilidad de costos I", "Estadística II", "Mercadotecnia", "Planeación estratégica", "Derecho laboral", "Economía"] },
            { cuatrimestre: "Quinto cuatrimestre", materias: ["Contabilidad de costos II", "Presupuestos", "Finanzas", "Dirección y liderazgo", "Derecho comercial", "Microeconomía"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Contabilidad avanzada", "Bases de auditoría", "Contraloría", "Desarrollo organizacional", "Derecho fiscal", "Macroeconomía"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Contabilidad impositiva", "Análisis financiero", "Auditoria de operaciones", "Empresas de calidad", "Idioma extranjero I"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Contabilidad de sociedades", "Proyectos de inversión", "Auditoría financiera", "Auditoría de calidad", "Idioma extranjero II"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Auditoría fiscal", "Auditoría administrativa", "Taller de nuevas empresas", "Economía regional", "Negocios internacionales"] }
        ]
    },
    "lic-derecho": {
        id: "lic-derecho",
        defaultBanner: "https://drive.google.com/thumbnail?id=1nK0Q6eFhlB7x2RcMO1NtXsplfa7LWXpg&sz=w1920-h1080",
        name: "Licenciatura en Derecho",
        type: "Licenciatura",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20211148 / 02-Jul-22",
        description: "Forma profesionales éticos y rigurosos capaces de interpretar, aplicar y crear marcos legales para promover la justicia.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Derecho romano I", "Fundamentos de derecho", "Teoría general del proceso", "Teoría general del estado"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Derecho romano II", "Derecho Civil I", "Sociología", "Metodología de la investigación", "Teoría económica"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Redacción de documentos jurídicos", "Derecho civil II", "Derecho penal I", "Informática y computación I", "Derecho procesal civil", "Medicina legal"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Derecho administrativo", "Derecho civil III", "Derecho penal II", "Informática y computación II", "Derecho constitucional"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Técnicas de litigación oral", "Derecho civil IV", "Derecho procesal penal en el sistema acusatorio", "Sociedades mercantiles y operaciones crediticias", "Garantías constitucionales"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Juicio de amparo", "Derecho civil V", "Derecho economico", "Derecho individual del trabajo", "Historia política de México"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Derecho municipal", "Derecho civil VI", "Derecho agrario", "Procesos concursales", "Derecho internacional"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Derecho procesal mercantil", "ética y filosofía del derecho", "Derecho colectivo del trabajo", "Derecho fiscal", "Legislación administrativa", "Idioma extranjero I"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Derecho bancario", "Derecho comparado", "Derecho procesal del trabajo", "Derecho procesal fiscal", "Metodología para la administración de proyectos", "Idioma extranjero II"] }
        ]
    },
    "lic-criminologia": {
        id: "lic-criminologia",
        defaultBanner: "https://drive.google.com/thumbnail?id=1k1SCVRTbBzVjhBtOCHsa8T7h6RdAsSn2&sz=w1920-h1080",
        name: "Licenciatura en Criminología",
        type: "Licenciatura",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20211143 / 02-Jul-22",
        description: "Comprende y analiza las conductas delictivas, su contexto y la víctima. Especialízate en el sector clave de la seguridad y el análisis legal forense.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Teoría del derecho", "Sociología criminal", "Antropología social", "Metodología de la investigación"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Criminología", "Derecho administrativo", "Estadística", "Derecho constitucional", "Bases biológicas de la conducta"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Informática I", "Redacción de documentos jurídicos", "Criminalística", "Técnicas de investigación criminalística", "Garantías constitucionales", "Medicina forense"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Teoría del delito y derecho penal", "Derechos humanos", "Justicia para adolescentes I", "Grafoscopía y documentoscopía", "Informatica II"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Justicia para adolescentes II", "Derecho procesal penal en el sistema acusatorio", "Psicología criminal", "Antropología y biotipología", "Prevención del delito y seguridad pública"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Criminologla Clinica", "Victimología", "Organización y Administración Policial", "Ejecución de Penas y Medidas de seg.", "Técnicas de Litigación Oral"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Fotogralia forense", "Derecho penitenciario y seguridad pública", "Deontología jurídica", "Política criminal I", "Psicología jurídica"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Dactiloscopia", "Psicopatología criminal", "Balística", "Sistemas de identificación criminal", "Política criminal II"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Psiquiatría forense", "Taller de modelos de atención victimológica", "Tratamiento postpenitenciario", "Sistemas penitenciarios y criminalogía", "Metodología para la administración de proyectos"] }
        ]
    },
    "lic-administracion": {
        id: "lic-administracion",
        defaultBanner: "https://drive.google.com/thumbnail?id=1LCl2ZtjFVq6QkZ3SeeG6oJcwAPsGvKCt&sz=w1920-h1080",
        name: "Licenciatura en Administración de Empresas",
        type: "Licenciatura",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20211145 / 02-Jul-22",
        description: "Lidera corporaciones hacia el éxito organizando el capital humano, desarrollando estrategias competitivas y optimizando recursos financieros.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Contabilidad I", "Matemáticas I", "Dinámica social", "Administración I", "Métodos de investigación"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Contabilidad II", "Matemáticas II", "Comunicación escrita", "Administración II", "Informática y computación I"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Contabilidad III", "Estadística I", "Administración de recursos humanos", "Fundamentos de derecho", "Informática y computación II"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Contabilidad de costos", "Estadistica II", "Mercadotecnia", "Planeación estratégica", "Derecho laboral", "Economía"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Contabilidad administrativa", "Habilidades para la dirección", "Mercadotecnia avanzada", "Prestaciones laborales", "Microeconomía"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Estados financieros", "Desarrollo del capital humano I", "Mercadometría", "Producción y manufactura", "Macroeconomía", "Ergonomía"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Administración superior", "Desarrollo del capital humano II", "Administración estratégica", "Seguridad social", "Idioma extranjero I", "Publicidad"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Administración pública", "Gerencia de ventas", "Desarrollo del capital humano III", "Finanzas Empresariales I", "Idioma extranjero II"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Administración de la calidad", "Desarrollo de proyectos de inversión", "Finanzas empresariales II", "Administración de la producción", "Taller de nuevas empresas"] }
        ]
    },
    "ing-manufactura": {
        id: "ing-manufactura",
        defaultBanner: "https://drive.google.com/thumbnail?id=1u_aAj7YqGRyRJnZdUUU945TmzZHXt_aN&sz=w1920-h1080",
        name: "Ingeniería Industrial en Manufactura",
        type: "Ingeniería",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20194327 / 20-Nov-19",
        description: "Optimiza de forma integral sistemas complejos integrados por procesos de materiales y equipamiento, mejorando la competitividad.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Introducción a la ingeniería industrial", "Matemáticas I", "Informática", "Metodología de la investigación", "Química", "Dibujo técnico I", "Comunicación oral y escrita"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Física", "Matemáticas II", "Herramientas de computación I", "Probabilidad y estadística", "Contabilidad I", "Dibujo técnico II", "Propiedades de los materiales"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Matemáticas III", "Electricidad y magnetismo", "Herramientas de computación II", "Estadística aplicada", "Contabilidad II", "Procesos de fabricación"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Investigación de operaciones", "Estática", "Matemáticas IV", "Sistemas de planeación", "Métodos numéricos", "Contabilidad de costos", "Estudios de Trabajo I"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Planeación y control de la producción I", "Resistencia de mariales", "Economía", "Administración de proyectos", "Control de calidad", "Psicología de la organización", "Optativa I"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Planeación y control de la producción II", "Ingeniería económica", "Ingeniería de planta", "Mercadotecnia", "Dinámica social", "Ingeniería de sistemas", "Optativa II"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Tópicos de manufactura", "Derecho laboral", "Administración financiera", "Planeación y diseño de Instalaciones", "Administración de la calidad", "Administración de recursos humanos", "Optativa III"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Metrología y normalización", "Ergonomía", "Diseño asistido por computadora", "Evaluación de proyectos", "Planeación de la calidad", "Sistema de manufactura", "Optativa IV"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Factibilidad de proyectos", "inglés", "Manufactura integrada por computadora", "Ingeniería de calidad", "Manufactura esbelta", "Optativa V"] }
        ]
    },
    "ing-mecatronica": {
        id: "ing-mecatronica",
        defaultBanner: "https://drive.google.com/thumbnail?id=1agIpRVGiACYAlQcbSN_4G9crDEtV256c&sz=w1920-h1080",
        name: "Ingeniería Mecatrónica",
        type: "Ingeniería",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Federal 20194325 / 20-Nov-19",
        description: "Diseña e implanta dispositivos y sistemas inteligentes integrando la mecánica y la electrónica al mundo computacional y robótico.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Introducción a la ingeniería", "Matemáticas I", "Informática", "Metodología de la investigación", "Química", "Dibujo técnica I", "Comunicación oral y escrita"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Física", "Matemáticas ll", "Herramientas de computación I", "Probabilidad y estadística", "Contabilidad I", "Dibujo técnico II", "Propiedades de los materiales"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Matemáticas III", "Electricidad y magnetismo", "Herramientas de computación II", "Estadística aplicada", "Contabilidad II", "Procesos de fabricación I", "Estatica"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Dibujo asistido por computadora", "Dinámica", "Fundamentos de termodinámica", "Procesos de fabricación II", "Análisis de circuitos eléctricos", "Mecánica de materiales"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Métodos numéricos", "Metrología y normalización", "Mecanismos", "Máquinas eléctricas", "Análisis de fluidos", "Electrónica analógica"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Vibraciones mecánicas", "Instrumentación", "Ciencia e ingeniería de materiales", "Diseño de elementos mecánicos", "Electrónica digital", "Electrónica de potencia aplicada"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Manufactura avanzada", "Dinámica de sistemas", "Mantenimiento", "Microcontroladores", "Circuitos hidráulicos y neumáticos", "Programación avanzada"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Ergonomía", "Planeación de la calidad", "Controladores lógicos programables", "Control", "Formulación y evaluación de proyectos"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Factibilidad de proyectos", "Manufactura integrada por computadora", "Ingeniería de calidad", "Manufactura esbelta", "Robótica"] }
        ]
    },
    "ing-industrial-sistemas": {
        id: "ing-industrial-sistemas",
        defaultBanner: "https://drive.google.com/thumbnail?id=1305tO5x2oP-iZOoL7YuhpUA9CbkPOg9f&sz=w1920-h1080",
        name: "Ingeniería Industrial de Sistemas",
        type: "Ingeniería",
        duration: "9 Cuatrimestres",
        rvoe: "RVOE Estatal 0528198033",
        description: "Planea, optimiza y gestiona sistemas de producción eficientes con el manejo de las últimas herramientas de información e ingeniería.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Introducción a la ingeniería", "Matemáticas I", "Informática", "Metodología de la investigación", "Química", "Dibujo técnico I", "Comunicación oral y escrita"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Electricidad y magnetismo", "Matemáticas II", "Herramientas de computación I", "Probabllidad y estadística", "Contabilidad I", "Dibujo técnico II", "Propiedades de los materiales"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Matemáticas III", "Estática", "Herramientas de computación II", "Estadística aplicada", "Contabilidad II", "Procesos de fabricación"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Investigación de operaciones", "Física", "Matemáticas IV", "Planeación y estrategias competitivas", "Métodos numéricos", "Contabilidad de costos", "Ingeniería de métodos I"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Control de la producción", "Resistencia de materiales", "Economía", "Ingeniería de sistemas I", "Ingeniería de métodos II", "Administración de proyectos", "Análisis de las normas ISO"] },
            { cuatrimestre: "Sexto Cuatrimestre", materias: ["Planeacion del sistema de gestión", "Ingeniería económica", "Ingeniería de planta", "Ingeniería de sistemas II", "Análisis de la sociedad contemporánea", "Sistemas de información I", "Administracion I"] },
            { cuatrimestre: "Séptimo Cuatrimestre", materias: ["Ingeniería de la producción", "Relaciones laborales industriales", "Manejo de materiales", "Ingeniería de sistemas III", "Sistemas de información II", "Capital humano y productividad", "Administración II"] },
            { cuatrimestre: "Octavo Cuatrimestre", materias: ["Metrología y normalización", "Dinámica de sistemas", "Ergonomia y seguridad industrial", "Evaluación de proyectos", "Control estadístico de la calidad", "Documentación del sistema de gestión de calidad", "Inglés I"] },
            { cuatrimestre: "Noveno Cuatrimestre", materias: ["Medición y mejora de la producción", "Inglés II", "Manufactura integrada por computadora", "Auditoria del sistema de gestión de calidad", "Proyectos de ingeniería", "Psicología organizacional", "Desarrollo organizacional"] }
        ]
    },
    "mae-criminologia": {
        id: "mae-criminologia",
        defaultBanner: "https://drive.google.com/thumbnail?id=1JjKSAst88zxwVl-AbPGgLZmzTXbKwvZS&sz=w1920-h1080",
        name: "Maestría en Criminología",
        type: "Maestría",
        duration: "5 Cuatrimestres",
        rvoe: "RVOE Federal 20210855 / 13-May-21",
        description: "Adquiere el grado máximo de experto en el campo criminológico con investigación, diagnóstico y proposición de medidas de readaptación.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Metodología de la Investigación en Criminología", "Bases Bio-Psicológicas del Crimen", "Introducción a la Criminología"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Sociologia Criminológica", "Técnicas de Entrevista e Interrogatorio", "Psicología Criminal"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Política Criminal", "Criminalistica", "Psicologia Criminal II"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Medicina Forense", "Política de Readaptación Social y Justicia de Menores", "Penología y Sistemas Penitenciarios"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Prevención del Delito", "Modalidades Delictivas", "Deontología Criminológica"] }
        ]
    },
    "mae-administracion": {
        id: "mae-administracion",
        defaultBanner: "https://drive.google.com/thumbnail?id=1sYH216GWdNZqE7j0VHDsbT7wrLsIAJrT&sz=w1920-h1080",
        name: "Maestría en Administración",
        type: "Maestría",
        duration: "5 Cuatrimestres",
        rvoe: "RVOE Federal 20210866 / 13-May-21",
        description: "Transforma tu liderazgo para la toma de decisiones basada en innovación tecnológica y el desarrollo organizacional corporativo clave.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Entorno Económico de los Negocios", "Innovación y Desarrollo de los Negocios", "Análisis para la toma de decisiones"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Informática aplicada a los Negocios", "Análisis de los Sistemas de Información de los Negocios", "Coaching"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["Calidad y Mejora de Procesos", "Entorno Organizacional", "Liderazgo y manejo del cambio"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Control presupuestal y Optimización Financiera", "Administración estratégica en los Negocios", "Metodología de la Investigación I"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Proyectos de Inversiones", "Dirección de Operaciones y Tecnología", "Metodología de la Investigación II"] }
        ]
    },
    "mae-juicios-orales": {
        id: "mae-juicios-orales",
        defaultBanner: "https://drive.google.com/thumbnail?id=1xWZqnCCltrrUyL6W7hZm7meok4AJOgNR&sz=w1920-h1080",
        name: "Maestría en Juicios Orales",
        type: "Maestría",
        duration: "5 Cuatrimestres",
        rvoe: "RVOE Federal 20210859 / 13-May-21",
        description: "Cimienta tu prestigio como abogado con las técnicas punteras del litigio oral, argumentación y el nuevo procedimiento penal acusatorio.",
        plan: [
            { cuatrimestre: "Primer Cuatrimestre", materias: ["Didáctica aplicada al Derecho", "Análisis de la Reforma Constitucional en Juicios Orales", "La Implementación de los Juicios Orales en México"] },
            { cuatrimestre: "Segundo Cuatrimestre", materias: ["Jurisprudencia", "Garantías Individuales en materia de Juicios Orales Penales", "Teoría general del proceso Penal Oral"] },
            { cuatrimestre: "Tercer Cuatrimestre", materias: ["El Sistema Penal Inquisitorio, Acusatorio y Mixto", "Medios Alternativos de solución al conflicto", "Etapas del nuevo Procedimiento Penal Acusatorio Mexicano"] },
            { cuatrimestre: "Cuarto Cuatrimestre", materias: ["Derechos Humanos y Tratados Internacionales", "Recursos dentro del Sistema Oral Penal Mexicano", "El Juicio de Amparo en los Juicios Orales"] },
            { cuatrimestre: "Quinto Cuatrimestre", materias: ["Interpretación, Retórica y Argumentación Jurídica", "El Ministerio Público y los Juicios Orales", "Seminario de Tésis"] }
        ]
    }
};


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
        <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; flex: 1 1 0; min-width: 150px; box-sizing: border-box; word-wrap: break-word;">
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
