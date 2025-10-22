import express from "express";
import cors from "cors";
import { google } from "googleapis";

const app = express();
app.use(cors());
app.use(express.json());

// Conecta com o Google Sheets
async function getSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "SEU_PROJECT_ID",
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "SEU_ID_DA_PLANILHA";
  return { sheets, spreadsheetId };
}

// Recebe respostas e salva no Sheets
app.post("/api/respostas", async (req, res) => {
  try {
    const { sheets, spreadsheetId } = await getSheet();
    const data = Object.values(req.body);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Respostas!A1",
      valueInputOption: "RAW",
      requestBody: { values: [data] },
    });

    res.status(200).json({ message: "Respostas salvas com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar dados", error });
  }
});

// Retorna respostas (para IA)
app.get("/api/respostas", async (req, res) => {
  try {
    const { sheets, spreadsheetId } = await getSheet();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Respostas!A1:Z1000",
    });

    res.status(200).json(result.data.values || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler dados", error });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
