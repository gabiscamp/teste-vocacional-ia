// A URL que você chama é o endpoint do PROXY no Netlify!
// O Netlify, graças ao netlify.toml, irá redirecionar para a Function proxy.js
const API_ENDPOINT = "/api/respostas"; 

const form = document.getElementById("testeForm");
const mensagemDiv = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  mensagemDiv.innerText = "Enviando respostas...";
  mensagemDiv.classList.remove('hidden');

  const formData = new FormData(e.target);
  const respostas = {};

  // Coleta todas as respostas no objeto
  formData.forEach((valor, chave) => {
    respostas[chave] = valor;
  });

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(respostas),
    });

    const data = await response.json();

    if (response.ok && data.message && data.message.includes("sucesso")) {
        mensagemDiv.innerText = `Sucesso! ${data.message}`;
        mensagemDiv.style.backgroundColor = '#d4edda'; 
        form.reset(); 
    } else {
        // Se o status HTTP não for 2xx ou se o Apps Script retornar um JSON de erro
        const msgErro = data.error || data.message || 'Erro desconhecido.';
        mensagemDiv.innerText = `Erro: ${msgErro}.`;
        mensagemDiv.style.backgroundColor = '#f8d7da'; 
    }

  } catch (err) {
    mensagemDiv.innerText = `Erro de conexão. Verifique o console ou logs do Netlify.`;
    mensagemDiv.style.backgroundColor = '#f8d7da';
    console.error("Fetch Error:", err);
  } finally {
    submitBtn.disabled = false;
  }
});

// Função de exemplo para a IA buscar dados (pode ser chamada de um script Python externo)
async function fetchDataForIA() {
    try {
        const response = await fetch(API_ENDPOINT, { method: "GET" });
        const data = await response.json();
        console.log("Dados para IA:", data);
        return data;
    } catch(err) {
        console.error("Erro ao buscar dados GET:", err);
        return null;
    }
}