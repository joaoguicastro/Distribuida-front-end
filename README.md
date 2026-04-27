# HealthSys Frontend

Frontend simples em `Next.js + React` para estudar a interface do projeto de gestao hospitalar.

## O que existe no projeto

- `pages/index.js`: dashboard principal
- `pages/patients.js`: cadastro e listagem de pacientes
- `pages/records.js`: prontuario eletronico
- `pages/triage.js`: triagem e classificacao de risco
- `components/Layout.js`: menu lateral e estrutura visual
- `hooks/useHealthSysData.js`: leitura e salvamento dos dados no navegador
- `data/initialData.js`: dados de exemplo para iniciar o sistema
- `styles/globals.css`: estilos globais

## Como rodar

```bash
npm run dev
```

Depois abra:

```bash
http://localhost:3000
```

## Como os dados funcionam

Os dados sao salvos no `localStorage` do navegador.

Isso significa:

- se voce cadastrar um paciente, ele continua salvo ao recarregar a pagina;
- os dados ficam apenas no navegador local;
- ainda nao existe conexao com backend.

## Objetivo desta versao

Esta versao foi feita para ser facil de entender.

Por isso, eu mantive:

- poucos arquivos;
- nomes simples;
- formularios diretos;
- logica sem excesso de abstractions.

Quando voce quiser, o proximo passo pode ser:

1. conectar esse front a uma API real;
2. adicionar login com JWT;
3. separar melhor os componentes;
4. criar mais telas do projeto original.
