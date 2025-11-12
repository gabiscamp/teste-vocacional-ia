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
    questionSteps[totalSteps - 1].classList.add('hidden');
    resultMessage.classList.remove('hidden');
    document.getElementById('resultText').textContent = 'Analisando suas respostas com a IA...';

    const formData = new FormData(e.target);
    const respostas = {};
    
    for (let i = 1; i <= totalSteps; i++) {
        const key = `q${i}`;
        const value = formData.get(key);
        if (value) {
            respostas[key] = value;
        } else {
            resultMessage.classList.add('mensagem-erro');
            document.getElementById('resultText').textContent = 'Erro: Respostas incompletas. Volte e preencha todas.';
            return;
        }
    }

    try {
        const response = await fetch(RENDER_PREDICT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(respostas)
        });

        const data = await response.json();
        
        resultMessage.classList.add('hidden'); 
        finalResultScreen.classList.remove('hidden');
        
        if (response.ok && data.predicted_course) {
            document.getElementById('predicted-course').textContent = data.predicted_course;
        } else {
            document.getElementById('predicted-course').textContent = 'Erro na previsão. Tente novamente.';
            document.querySelector('#final-result-screen .result-title').textContent = 'Falha na Análise';
        }

    } catch (error) {
        resultMessage.classList.add('mensagem-erro');
        document.getElementById('resultText').textContent = 'Erro de rede. Verifique a URL do Render.';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    showStep(0); 
});