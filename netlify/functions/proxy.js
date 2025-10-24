// netlify/functions/proxy.js

const fetch = require('node-fetch');

// Esta URL DEVE ser a URL do Apps Script que você registrou na Planilha
const APPS_SCRIPT_WEBAPP_URL = process.env.VITE_APPS_SCRIPT_URL; 

exports.handler = async (event, context) => {
    // A Netlify Function deve estar configurada para ler VITE_APPS_SCRIPT_URL
    if (!APPS_SCRIPT_WEBAPP_URL) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Variável VITE_APPS_SCRIPT_URL não configurada." })
        };
    }

    // Determina o método (POST ou GET)
    const method = event.httpMethod;

    // Monta a requisição para o Apps Script
    try {
        const response = await fetch(APPS_SCRIPT_WEBAPP_URL, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            // Envia o body diretamente (para requisições POST)
            body: method === 'POST' ? event.body : null 
        });

        // O Apps Script retorna JSON puro.
        const data = await response.json();

        // Retorna a resposta para o frontend Netlify
        return {
            statusCode: response.status || 200, 
            body: JSON.stringify(data),
            headers: {
                // Evita problemas de caching, permite que o frontend acesse
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Opcional, mas útil para testes
            }
        };
    } catch (error) {
        console.error("Proxy error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro de comunicação com o Google Sheets API (Apps Script).' })
        };
    }
};