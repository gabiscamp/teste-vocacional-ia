const fetch = require('node-fetch');

const APPS_SCRIPT_WEBAPP_URL = process.env.VITE_APPS_SCRIPT_URL; 

exports.handler = async (event, context) => {

    if (!APPS_SCRIPT_WEBAPP_URL) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Variável VITE_APPS_SCRIPT_URL não configurada." })
        };
    }

    const method = event.httpMethod;

    try {
        const response = await fetch(APPS_SCRIPT_WEBAPP_URL, {
            method: method,
            headers: { 'Content-Type': 'application/json' },

            body: method === 'POST' ? event.body : null 
        });

        const data = await response.json();

        return {
            statusCode: response.status || 200, 
            body: JSON.stringify(data),
            headers: {

                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
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