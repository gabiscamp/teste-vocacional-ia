const DATA_FETCH_URL = "/api/respostas"; 
const LOGIN_STORAGE_KEY = "admin_logged_in";
const COURSES = ['Estética', 'Recursos Humanos', 'Administração', 'Tecnologia da Informação', 'Enfermagem', 'Logística'];

const PESOS_GLOSSARIO = {
    'q1': {'Azul': {'TI': 5, 'Logística': 4}, 'Vermelho': {'ADM': 5, 'RH': 4}, 'Verde': {'Enfermagem': 5, 'Estética': 4}, 'Amarelo': {'Estética': 5, 'ADM': 4}},
    'q2': {'Leao': {'ADM': 5, 'RH': 4}, 'Coruja': {'TI': 5, 'Logística': 4}, 'Golfinho': {'Enfermagem': 5, 'RH': 4}, 'Borboleta': {'Estética': 5}},
    'q3': {'Natureza': {'Enfermagem': 5, 'Estética': 4}, 'Urbano': {'ADM': 5, 'Logística': 4}},
    'q4': {'Sol': {'ADM': 4, 'RH': 4}, 'Chuva': {'TI': 4, 'Enfermagem': 3}, 'Frio': {'Logística': 5, 'TI': 3}, 'Vento': {'Estética': 4, 'ADM': 3}},
    'q5': {'Cidades': {'ADM': 5, 'Logística': 4}, 'Tranquilos': {'Enfermagem': 5, 'Estética': 4}},
    'q6': {'Acao': {'ADM': 4, 'Logística': 3}, 'Drama': {'Enfermagem': 5, 'RH': 4}, 'Comedia': {'RH': 5, 'Estética': 3}, 'Ficcao': {'TI': 5}, 'Romance': {'Estética': 4, 'Enfermagem': 3}},
    'q7': {'Circulo': {'RH': 5, 'Enfermagem': 4}, 'Quadrado': {'Logística': 5, 'TI': 4}, 'Triangulo': {'ADM': 5, 'RH': 3}, 'Espiral': {'Estética': 5, 'TI': 3}},
    'q8': {'Montanha': {'Logística': 5, 'TI': 4}, 'Rio': {'Enfermagem': 4, 'Estética': 3}, 'Ponte': {'RH': 5, 'ADM': 3}},
    'q9': {'Iluminados': {'ADM': 4, 'TI': 3}, 'Aconchegantes': {'Enfermagem': 5, 'Estética': 4}},
    'q10': {'Estrategista': {'TI': 5, 'ADM': 4}, 'Explorador': {'Logística': 4, 'Estética': 3}, 'Construtor': {'Logística': 5, 'TI': 3}, 'Cuidador': {'Enfermagem': 5, 'RH': 4}},
    'q11': {'Manha': {'Logística': 5, 'Enfermagem': 3}, 'Tarde': {'ADM': 4, 'RH': 3}, 'Noite': {'TI': 5, 'Estética': 3}},
    'q12': {'Agua': {'Enfermagem': 5, 'RH': 3}, 'Fogo': {'ADM': 5, 'Estética': 3}, 'Terra': {'Logística': 5, 'TI': 3}, 'Ar': {'Estética': 5, 'RH': 3}},
    'q13': {'Silencioso': {'TI': 5, 'Enfermagem': 4}, 'Movimentado': {'ADM': 4, 'RH': 5}},
    'q14': {'Suave': {'Estética': 5, 'Enfermagem': 3}, 'Aspera': {'Logística': 5, 'TI': 3}, 'Firme': {'ADM': 4, 'RH': 3}, 'Maleavel': {'RH': 4, 'Estética': 3}},
    'q15': {'Imagens': {'Estética': 5, 'TI': 3}, 'Palavras': {'RH': 5, 'ADM': 4}, 'Numeros': {'TI': 5, 'Logística': 4}},
    'q16': {'Carro': {'ADM': 4, 'TI': 3}, 'Bicicleta': {'Estética': 4, 'Enfermagem': 3}, 'Aviao': {'TI': 5, 'Logística': 4}, 'Navio': {'Logística': 5, 'RH': 3}},
    'q17': {'Salgadas': {'Logística': 4, 'TI': 3}, 'Doces': {'Enfermagem': 4, 'RH': 3}, 'Acidas': {'ADM': 4, 'Estética': 3}, 'Amargas': {'TI': 4, 'Logística': 3}},
    'q18': {'Montanha': {'Logística': 5, 'TI': 3}, 'Praia': {'Estética': 4, 'RH': 3}, 'Floresta': {'Enfermagem': 5, 'Estética': 3}, 'Deserto': {'TI': 5}},
    'q19': {'Reais': {'Logística': 5, 'ADM': 4}, 'Imaginarias': {'Estética': 5, 'TI': 3}},
    'q20': {'Verao': {'ADM': 4, 'RH': 3}, 'Outono': {'TI': 4, 'Logística': 3}, 'Inverno': {'Logística': 5, 'Enfermagem': 3}, 'Primavera': {'Estética': 5, 'Enfermagem': 3}},
    'q21': {'Montar': {'TI': 5, 'Logística': 4}, 'Historias': {'RH': 5, 'ADM': 4}, 'Desenhar': {'Estética': 5}, 'Grupo': {'Enfermagem': 4, 'RH': 5}},
    'q22': {'Seguranca': {'Logística': 5, 'TI': 3}, 'Novidade': {'TI': 4, 'ADM': 3}, 'Liberdade': {'Estética': 5, 'RH': 3}, 'Reconhecimento': {'ADM': 5, 'RH': 4}},
    'q23': {'Guardar': {'Logística': 5, 'Enfermagem': 3}, 'Renovar': {'TI': 5, 'Estética': 4}},
    'q24': {'Flores': {'Estética': 5, 'Enfermagem': 3}, 'Madeira': {'Logística': 5, 'TI': 3}, 'Maresia': {'Estética': 4, 'RH': 3}, 'Cafe': {'ADM': 5, 'TI': 4}},
    'q25': {'Calma': {'Enfermagem': 5, 'Estética': 3}, 'Energetica': {'ADM': 5, 'RH': 4}, 'Emotiva': {'RH': 5, 'Enfermagem': 4}, 'Experimental': {'TI': 5, 'Estética': 4}}
};

let fullData = []; 
let filteredData = []; 
let currentChart = null; 
let selectedTag = null; 

function checkAdminSession() {
    if (localStorage.getItem(LOGIN_STORAGE_KEY) !== "true") {
    }
}

function calculatePredictedCourse(rowObject) {
    const scores = {};
    COURSES.forEach(c => scores[c] = 0);

    for (let i = 1; i <= 25; i++) {
        const qKey = `q${i}`;
        const answer = rowObject[qKey];
        const mappedCourses = {
            'Tecnologia da Informação': 'TI',
            'Administração': 'ADM',
            'Recursos Humanos': 'RH',
            'Logística': 'Logística',
            'Enfermagem': 'Enfermagem',
            'Estética': 'Estética'
        };

        if (PESOS_GLOSSARIO[qKey] && PESOS_GLOSSARIO[qKey][answer]) {
            const weights = PESOS_GLOSSARIO[qKey][answer];
            for (const shortCourse in weights) {
                const longCourse = Object.keys(mappedCourses).find(key => mappedCourses[key] === shortCourse);
                if (longCourse) {
                    scores[longCourse] += weights[shortCourse];
                }
            }
        }
    }
    
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, 'N/A');
}

function processData(rawData) {
    if (!rawData || rawData.length < 2) return { counts: {}, enrichedData: [] };
    
    const headers = rawData[0];
    const dataRows = rawData.slice(1);
    
    const courseCounts = {};
    COURSES.forEach(c => courseCounts[c] = 0);
    
    const enrichedData = [];

    dataRows.forEach(row => {
        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = row[index];
        });

        const predictedCourse = calculatePredictedCourse(rowObject);
    
        rowObject['Curso Previsto'] = predictedCourse;
        enrichedData.push(rowObject);
        
        if (COURSES.includes(predictedCourse)) {
            courseCounts[predictedCourse] += 1;
        }
    });

    return { counts: courseCounts, enrichedData: enrichedData };
}


function renderChart(counts) {
    const ctx = document.getElementById('courseChart').getContext('2d');
    const courses = Object.keys(counts);
    const data = Object.values(counts);
    const totalCount = data.reduce((sum, current) => sum + current, 0);

    if (currentChart) {
        currentChart.destroy();
    }
    
    const backgroundColors = [
        '#002147', 
        '#37474F',
        '#FF8C00',
        '#B71C1C', 
        '#2E7D32',
        '#FFC107'  
    ];

    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: courses,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: `Distribuição de Perfis (${totalCount} Registros)`,
                    font: { size: 16 }
                }
            }
        }
    });

    document.getElementById('chart-area-placeholder').innerHTML = `<p>Total de Registros Exibidos: <b>${totalCount}</b></p>`;
}

async function fetchAndStoreData() {
    const placeholder = document.getElementById('chart-area-placeholder');
    placeholder.innerHTML = '<p>Carregando dados do Google Sheets...</p>';
    
    try {

        const response = await fetch(DATA_FETCH_URL, { method: 'GET' }); 
        
        if (!response.ok) {
             throw new Error(`Erro HTTP: ${response.status}. Verifique o Netlify Function/Apps Script.`);
        }

        const rawData = await response.json();
        
        if (!rawData || rawData.length < 2) {
             placeholder.innerHTML = '<p>Ainda não há dados suficientes para gerar o relatório.</p>';
             return;
        }

        fullData = rawData; 
        
        applyFilters(null, ''); 

    } catch (error) {
        console.error("ERRO DE CARREGAMENTO DO DASHBOARD:", error);
        placeholder.innerHTML = `<p>Erro ao carregar dados do servidor. Detalhe: ${error.message}.</p>`;
    }
}

function applyFilters(courseFilter, searchFilter) {
    const dataToFilter = fullData.slice(1); 

    let filteredByCourse = dataToFilter;
    if (courseFilter) {

        const { enrichedData } = processData(fullData);
        filteredByCourse = enrichedData.filter(row => row['Curso Previsto'] === courseFilter);
        selectedTag = courseFilter;
    } else {
        selectedTag = null;
    }

    const finalDataRows = filteredByCourse.filter(row => {
        if (!searchFilter) return true;
        const normalizedSearch = searchFilter.toLowerCase();

        return Object.values(row).some(value => 
            String(value).toLowerCase().includes(normalizedSearch)
        );
    });
    const dataWithHeaders = [fullData[0], ...finalDataRows.map(row => Object.values(row))];

    const { counts, enrichedData } = processData(dataWithHeaders);
    filteredData = enrichedData; 

    renderChart(counts);

    const exportBtn = document.getElementById('exportReportBtn');
    if (selectedTag) {
        exportBtn.textContent = `Exportar Relatório Filtrado: ${selectedTag}`;
    } else if (searchFilter) {
        exportBtn.textContent = `Exportar Relatório Filtrado: "${searchFilter}"`;
    } else {
        exportBtn.textContent = `Exportar Relatório Completo (${filteredData.length} Registros)`;
    }
}


function exportPDFReport() {
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert("Erro: A biblioteca jsPDF não foi carregada. Verifique as tags <script> no HTML.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); 
    const title = selectedTag ? `Relatório de Testes - Curso: ${selectedTag}` : "Relatório Completo do Teste Vocacional";
    
    doc.setFontSize(18);
    doc.text(title, 15, 15);
    doc.setFontSize(10);
    doc.text(`Total de Registros: ${filteredData.length}`, 15, 22);

    if (filteredData.length === 0) {
        doc.text("Nenhum registro encontrado para exportação.", 15, 30);
        doc.save(title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
        return;
    }

    const headers = ['Curso Previsto', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q23', 'q24', 'q25'];

    const data = filteredData.map(row => {
        return headers.map(header => row[header] || '');
    });

    const head = [headers];

    doc.autoTable({
        head: head,
        body: data,
        startY: 30,
        theme: 'striped',
        styles: { fontSize: 7 },
        headStyles: { fillColor: [0, 33, 71] }, 
        margin: { top: 30, left: 5, right: 5 }
    });

    doc.save(title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    
    fetchAndStoreData();
    document.getElementById('exportReportBtn').addEventListener('click', exportPDFReport);
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        applyFilters(selectedTag, searchInput.value.trim());
    });


    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters(selectedTag, searchInput.value.trim());
        }
    });


    document.querySelectorAll('.area-tags .tag').forEach(tagElement => {
        tagElement.addEventListener('click', () => {
            const courseName = tagElement.textContent;
            
         
            document.querySelectorAll('.area-tags .tag').forEach(t => t.classList.remove('active'));

            if (selectedTag === courseName) {
                
                applyFilters(null, searchInput.value.trim());
            } else {
        
                tagElement.classList.add('active');
                applyFilters(courseName, searchInput.value.trim());
            }
        });
    });
});