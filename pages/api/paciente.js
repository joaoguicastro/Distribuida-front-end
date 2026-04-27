const PATIENTS_BACKEND_URL = "http://localhost:8080/paciente";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Metodo nao permitido." });
  }

  try {
    const backendResponse = await fetch(PATIENTS_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {})
      },
      body: JSON.stringify(req.body)
    });

    const responseText = await backendResponse.text();

    if (!backendResponse.ok) {
      return res.status(backendResponse.status).send(responseText);
    }

    return res.status(backendResponse.status).send(responseText);
  } catch (error) {
    return res.status(500).json({
      message: "Nao foi possivel conectar o frontend ao servico de pacientes.",
      details: error.message
    });
  }
}
