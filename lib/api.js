const GATEWAY_URL = "http://localhost:8080";
const USERS_API_URL = GATEWAY_URL;
const PATIENTS_API_URL = GATEWAY_URL;

function buildJsonConfig(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    headers
  };
}

async function readErrorMessage(response, defaultMessage) {
  try {
    const errorData = await response.json();
    return errorData.mensagem || errorData.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

export async function registerUser(userData) {
  const response = await fetch(`${USERS_API_URL}/usuario/cadastro`, {
    method: "POST",
    ...buildJsonConfig(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Nao foi possivel cadastrar o usuario."));
  }

  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${USERS_API_URL}/auth/login`, {
    method: "POST",
    ...buildJsonConfig(),
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Email ou senha invalidos."));
  }

  return response.json();
}

export async function createPatient(patientData, token) {
  const response = await fetch(`${PATIENTS_API_URL}/paciente`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(patientData)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Nao foi possivel cadastrar o paciente."));
  }

  return response.json();
}
