from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from typing import Dict, Any

app = FastAPI(title="Teste Vocacional IA - Previsão")
MODEL_PATH = "latest_model.pkl" 
model = None


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_model():
    """Carrega o modelo treinado do disco ao iniciar o servidor."""
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print("Modelo de IA carregado com sucesso!")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"Erro: Modelo {MODEL_PATH} não encontrado. Treine o modelo primeiro.")
    
@app.get("/health")

def health_check():
    """Verifica se a API está viva e se o modelo está carregado."""
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict")
async def predict(data: Dict[str, Any]):
    """
    Recebe as 25 respostas via POST e retorna a previsão do curso.
    
    Espera um JSON como: {"q1": "Azul", "q2": "Leao", ...}
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado ou serviço em inicialização.")
        
    try:
      
        input_data = pd.DataFrame([data])

        prediction = model.predict(input_data)
        predicted_course = prediction[0]
        
        return {
            "status": "success",
            "predicted_course": predicted_course,
            "message": f"Seu perfil tem forte afinidade com o curso de {predicted_course}."
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro de processamento: {str(e)}. Verifique se as 25 chaves (q1-q25) foram enviadas.")