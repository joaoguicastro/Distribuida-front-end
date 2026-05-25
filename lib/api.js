const GATEWAY_URL = "http://localhost:8080";

function buildJsonConfig(token) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return { headers };
}

async function readErrorMessage(response, defaultMessage) {
  try {
    const errorData = await response.json();
    return errorData.mensagem || errorData.message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

// ─── USUÁRIOS ────────────────────────────────────────────────

export async function registerUser(userData) {
  const response = await fetch(`${GATEWAY_URL}/usuario/cadastro`, {
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
  const response = await fetch(`${GATEWAY_URL}/auth/login`, {
    method: "POST",
    ...buildJsonConfig(),
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Email ou senha invalidos."));
  }
  return response.json();
}

// ─── PACIENTES ───────────────────────────────────────────────

export async function createPatient(patientData, token) {
  const response = await fetch(`${GATEWAY_URL}/paciente`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(patientData)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Nao foi possivel cadastrar o paciente."));
  }
  return response.json();
}

export async function fetchPacientes(token) {
  const response = await fetch(`${GATEWAY_URL}/paciente`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar pacientes.");
  return response.json();
}

export async function fetchPacienteById(id, token) {
  const response = await fetch(`${GATEWAY_URL}/paciente/${id}`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Paciente nao encontrado.");
  return response.json();
}

// ─── TRIAGENS ────────────────────────────────────────────────

export async function fetchTriagens(token) {
  const response = await fetch(`${GATEWAY_URL}/triagem`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar triagens.");
  return response.json();
}

export async function fetchTriagemByPaciente(pacienteId, token) {
  const response = await fetch(`${GATEWAY_URL}/triagem/paciente/${pacienteId}`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar triagens do paciente.");
  return response.json();
}

// ─── PRONTUÁRIOS ─────────────────────────────────────────────

export async function fetchProntuarios(token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar prontuarios.");
  return response.json();
}

export async function fetchProntuarioByPaciente(pacienteId, token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario/paciente/${pacienteId}`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Prontuario nao encontrado.");
  return response.json();
}

export async function createProntuario(data, token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Erro ao criar prontuario."));
  }
  return response.json();
}

export async function addConsulta(pacienteId, data, token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario/paciente/${pacienteId}/consulta`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Erro ao registrar consulta."));
  }
  return response.json();
}

export async function addExame(pacienteId, data, token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario/paciente/${pacienteId}/exame`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Erro ao registrar exame."));
  }
  return response.json();
}

export async function addMedicamento(pacienteId, data, token) {
  const response = await fetch(`${GATEWAY_URL}/prontuario/paciente/${pacienteId}/medicamento`, {
    method: "POST",
    ...buildJsonConfig(token),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Erro ao registrar medicamento."));
  }
  return response.json();
}

// ─── NOTIFICAÇÕES ────────────────────────────────────────────

export async function fetchNotificacoes(token) {
  const response = await fetch(`${GATEWAY_URL}/notificacao`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar notificacoes.");
  return response.json();
}

export async function fetchNotificacoesByPaciente(pacienteId, token) {
  const response = await fetch(`${GATEWAY_URL}/notificacao/paciente/${pacienteId}`, buildJsonConfig(token));
  if (!response.ok) throw new Error("Erro ao buscar notificacoes do paciente.");
  return response.json();
}