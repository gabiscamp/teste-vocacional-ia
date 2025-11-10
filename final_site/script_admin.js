const NETLIFY_PROXY_GET_URL = "/api/respostas";
const LOGIN_STORAGE_KEY = "admin_logged_in";

function checkAdminSession() {
    if (localStorage.getItem(LOGIN_STORAGE_KEY) !== "true") {
        window.location.href = 'login.html';
    }
}

function processData(rawData) {
    if (!rawData || rawData.length < 2) return null;
    
    const headers = rawData[0];
    const dataRows = rawData.slice(1);
    
    const courses = ['ADM', 'TI', 'RH', 'Logística', 'Enfermagem', 'Estética'];
    const courseCounts = {};
    courses.forEach(c => courseCounts[c] = 0);

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
    
    dataRows.forEach(row => {
        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = row[index];
        });

        const scores = {};
        courses.forEach(c => scores[c] = 0);

        for (let i = 1; i <= 25; i++) {
            const qKey = `q${i}`;
            const answer = rowObject[qKey];

            if (PESOS_GLOSSARIO[qKey] && PESOS_GLOSSARIO[qKey][answer]) {
                const weights = PESOS_GLOSSARIO[qKey][answer];
                for (const course in weights) {
                    scores[course] += weights[course];
                }
            }
        }
        
        const bestCourse = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, 'N/A');
        if (bestCourse !== 'N/A') {
            courseCounts[bestCourse] += 1;
        }
    });

    return courseCounts;
}

function renderChart(data) {
    const ctx = document.getElementById('courseChart').getContext('2d');
    const courses = Object.keys(data);
    const counts = Object.values(data);
    
    const backgroundColors = [
        'rgba(0, 33, 71, 0.8)', // Azul Secundário (TI, ADM)
        'rgba(245, 130, 32, 0.8)', // Laranja Primário (Estética)
        'rgba(140, 140, 140, 0.8)', // Cinza (Logística)
        'rgba(50, 200, 50, 0.8)', // Verde (Enfermagem)
        'rgba(200, 50, 50, 0.8)', // Vermelho/Rosa (RH)
        'rgba(255, 206, 86, 0.8)' // Amarelo (Outros)
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: courses,
            datasets: [{
                data: counts,
                backgroundColor: backgroundColors,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Arial',
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Distribuição de Perfis (${dataRows.length} Registros)`,
                    font: {
                        family: 'Georgia',
                        size: 16
                    }
                }
            }
        }
    });
}

async function fetchAndRenderDashboard() {
    try {
        const response = await fetch(NETLIFY_PROXY_GET_URL);
        const rawData = await response.json();
        
        if (rawData && rawData.length > 1) {
            const courseCounts = processData(rawData);
            renderChart(courseCounts);
        } else {
            document.getElementById('chart-area-placeholder').innerHTML = '<p>Ainda não há dados suficientes para gerar o relatório.</p>';
        }

    } catch (error) {
        document.getElementById('chart-area-placeholder').innerHTML = '<p>Erro ao carregar dados do servidor. Verifique o console.</p>';
    }
}

function handleExport() {
    window.open(NETLIFY_PROXY_GET_URL, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    
    if (document.getElementById('exportReportBtn')) {
        document.getElementById('exportReportBtn').addEventListener('click', handleExport);
    }
    
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js";
    script.onload = fetchAndRenderDashboard;
    document.head.appendChild(script);
});