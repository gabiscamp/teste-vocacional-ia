import requests
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
import joblib
import os
from collections import defaultdict

PESOS_GLOSSARIO = {
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
}
CURSOS = ['TI', 'Logística', 'ADM', 'RH', 'Enfermagem', 'Estética']


API_URL = os.environ.get("VITE_NETLIFY_PROXY_URL") 
MODEL_DIR = "."
MODEL_PATH = os.path.join(MODEL_DIR, "latest_model.pkl")

def fetch_data(url):
    """Puxa os dados da planilha via Netlify Proxy."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status() 
        data = response.json()

        columns = data[0]
        df = pd.DataFrame(data[1:], columns=columns)
        return df
    except Exception as e:
        print(f"Erro ao buscar dados: {e}")
        return None

def calculate_score_and_label(row):
    """Soma os pesos para cada curso em uma linha e define a label."""
    scores = defaultdict(int)
    
    for q_num in range(1, 26):
        q_key = f'q{q_num}'
        try:
            answer = row[q_key] 
            weights = PESOS_GLOSSARIO.get(q_key, {}).get(answer, {})

            for curso, peso in weights.items():
                scores[curso] += peso
        except KeyError:
             continue 

    if scores:
        best_course = max(scores, key=scores.get)
        return best_course
    return 'INCONCLUSIVO' 

def train_and_save_model(df):
    """Rotula, treina o modelo de classificação, salva o artefato e mede a acurácia."""
    
    print("Iniciando rotulagem automática...")

    df['Curso_Recomendado'] = df.apply(calculate_score_and_label, axis=1)
    df = df[df['Curso_Recomendado'] != 'INCONCLUSIVO']

    X = df.drop(columns=['Timestamp', 'Curso_Recomendado'], errors='ignore')
    y = df['Curso_Recomendado']

    if len(y.unique()) < 2:
        print("Erro: Apenas um curso rotulado. Dados insuficientes para Classificação Multi-classe.")
        return

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    categorical_features = X.columns.tolist() 

    preprocessor = ColumnTransformer(
        transformers=[
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ],
        remainder='passthrough'
    )
    
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', GaussianNB()) 
    ])

    print(f"Treinando modelo com {len(X_train)} linhas...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"✅ ACURÁCIA DO MODELO (TESTE): {accuracy:.4f}") 
    print(f"Base de teste: {len(X_test)} amostras.")


    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Modelo salvo com sucesso em: {MODEL_PATH}")

if __name__ == "__main__":

    if not API_URL:
        print("Usando URL de teste local. NO GITHUB ACTIONS, use os.environ.get('VITE_NETLIFY_PROXY_URL')")
        
    df_data = fetch_data(API_URL)
    
    if df_data is not None and len(df_data) > 1:
        train_and_save_model(df_data)
    else:
        print("Dados insuficientes ou falha na API. Treinamento cancelado.")