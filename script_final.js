const RENDER_PREDICT_URL = "https://teste-vocacional-ia-stage.onrender.com/predict"; 
const form = document.getElementById('finalTestForm');
const questionSteps = document.querySelectorAll('.question-step');
const progressBar = document.getElementById('progressBar');
const resultMessage = document.getElementById('result-message');
const questionTitle = document.getElementById('question-title');
const finalResultScreen = document.getElementById('final-result-screen');
let currentStep = 0;
const totalSteps = questionSteps.length;

function updateProgress() {
    const progress = currentStep < totalSteps ? ((currentStep + 1) / totalSteps) * 100 : 100;
    progressBar.style.width = `${progress}%`;
    questionTitle.textContent = `Questão ${Math.min(currentStep + 1, totalSteps)}`;
    document.querySelectorAll('.btn-prev').forEach(btn => {
        if (currentStep === 0) {
            btn.classList.add('hidden');
        } else {
            btn.classList.remove('hidden');
        }
    });
}

function showStep(stepIndex) {
    stepIndex = Math.max(0, Math.min(stepIndex, totalSteps - 1));
    questionSteps.forEach((step, index) => {
        step.classList.add('hidden');
        if (index === stepIndex) {
            step.classList.remove('hidden');
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    currentStep = stepIndex;
    updateProgress();
}

function getSelectedValue(questionStep) {
    const radio = questionStep.querySelector('input[type="radio"]:checked');
    return radio ? radio.value : null;
}

document.querySelectorAll('.btn-next:not(.submit-btn)').forEach(button => {
    button.addEventListener('click', () => {
        const currentQuestionStep = questionSteps[currentStep];
        const selectedValue = getSelectedValue(currentQuestionStep);
        if (!selectedValue) {
            alert('Por favor, selecione uma opção para continuar.');
            return;
        }
        showStep(currentStep + 1);
    });
});

document.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', () => {
        showStep(currentStep - 1);
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Coleta e Validação (A parte crítica)
    const formData = new FormData(e.target);
    const respostas = {};
    let allAnswered = true;
    let missingQuestionIndex = -1;
    
    for (let i = 1; i <= totalSteps; i++) {
        const key = `q${i}`;
        const value = formData.get(key);
        
        if (value) {
            respostas[key] = value;
        } else {
            allAnswered = false;
            missingQuestionIndex = i - 1; // Índice do passo que falhou
            break;
        }
    }

    if (!allAnswered) {
        // Exibe mensagem de erro e interrompe
        resultMessage.classList.remove('hidden');
        resultMessage.classList.add('mensagem-erro');
        document.getElementById('resultText').textContent = `Erro: A questão ${missingQuestionIndex + 1} não foi respondida. Por favor, volte e preencha.`;
        finalResultScreen.classList.add('hidden'); 
        showStep(missingQuestionIndex); // Volta para a questão faltante
        return; 
    }
    
    // 2. Transição de Tela e Status de Análise
    questionSteps[totalSteps - 1].classList.add('hidden');
    resultMessage.classList.remove('hidden');
    resultMessage.classList.remove('mensagem-erro');
    document.getElementById('resultText').textContent = 'Analisando suas respostas com a IA...';

    // 3. Chamada à API (Render)
    try {
        const response = await fetch(RENDER_PREDICT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(respostas)
        });

        // Verifica se a resposta HTTP é 2xx
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // 4. Exibir Resultado
        resultMessage.classList.add('hidden'); 
        finalResultScreen.classList.remove('hidden');
        
        if (data.predicted_course) {
            document.getElementById('predicted-course').textContent = data.predicted_course;
        } else {
            // Caso o Render retorne OK, mas o JSON esteja incompleto ou falho
            document.getElementById('predicted-course').textContent = 'Análise inconclusiva. (Erro nos dados da IA)';
            document.querySelector('#final-result-screen .result-title').textContent = 'Falha na Análise';
        }

    } catch (error) {
        // 5. Tratamento de Erro de Rede ou Servidor
        resultMessage.classList.remove('hidden');
        resultMessage.classList.add('mensagem-erro');
        document.getElementById('resultText').textContent = `Erro de conexão ou servidor. Detalhe: ${error.message}`;
        // Loga para debug
        console.error("ERRO CRÍTICO NA PREVISÃO:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    showStep(0); 
});