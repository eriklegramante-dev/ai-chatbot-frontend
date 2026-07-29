
# 🌆 SYNTH_MATH // 1984 — Client Terminal

> Interface **React + Next.js** para um ecossistema de IA Multi-Agentes inspirado na estética **Synthwave / Retrowave / 1984**.

![React](https://img.shields.io/badge/React-20232A?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss)

---

## 👁️ Visão Geral

O **SYNTH_MATH // 1984 Client Terminal** é a camada de apresentação do sistema de IA Multi-Agentes. A interface foi projetada para oferecer uma experiência imersiva inspirada em terminais CRT dos anos 80, combinando UX moderna com um visual hacker retro-futurista.

## 🖼️ Screenshots

```md

<div align="center">
<img width="1600" height="825" alt="Image" src="https://github.com/user-attachments/assets/802e0134-9c37-4768-bff5-34e4c0ac7605" />

<img width="1600" height="825" alt="Image" src="https://github.com/user-attachments/assets/3b09c24b-0dad-4aa2-ba23-f7bf0f62ed72" />
</div>
```
---

## ✨ Features

- 💬 Chat em tempo real
- 🧠 Contexto persistido via `localStorage`
- 📚 Histórico de sessões
- ➕ Novo chat
- 🗑️ Exclusão de conversas
- ⚡ Loading "Processing Calculation..."
- 🌈 Tema Synthwave (Pink/Cyan)
- 📱 Layout responsivo
- 🔌 Integração transparente com FastAPI
- 🐳 Pronto para Docker

## 🧱 Stack

- React
- Next.js (`use client`)
- TypeScript
- Tailwind CSS
- Fetch API
- localStorage

## 🏗️ Arquitetura

```text
UI
 │
 ▼
Session Manager
 │
 ▼
History Formatter
 │
 ▼
Fetch API
 │
 ▼
FastAPI Backend
 │
 ▼
CrewAI + LLMs
```

## 🚀 Instalação

```bash
git clone <repo>

cd frontend

npm install

npm run dev
```

ou

```bash
yarn

yarn dev
```

## 🔐 Variáveis de Ambiente

`.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎨 Design System

- Neon Pink + Cyan
- Tipografia monoespaçada
- Glassmorphism
- Backdrop Blur
- Scanlines CRT
- Grid futurista
- Glow Effects
- Micro animações

## 📂 Organização

```text
src/
 ├── components/
 ├── hooks/
 ├── types/
 ├── utils/
 ├── app/
 └── styles/
```

## 🔄 Fluxo

1. Usuário envia prompt.
2. Histórico é formatado (`USER`/`ASSISTANT`).
3. Requisição assíncrona via Fetch.
4. FastAPI processa.
5. CrewAI consulta agentes.
6. Resposta renderizada.
7. Sessão salva no navegador.

## 🧪 Testes

- Testes manuais
- Integração com Swagger
- Validação de erros CORS
- Testes de UX e responsividade

## 🔮 Roadmap

- Streaming de respostas
- Markdown
- Temas
- Exportação de conversas
- Autenticação
- WebSockets

## 🤝 Integração

Projetado para integração desacoplada com o Back-end via Docker Compose, permitindo evolução independente dos repositórios mantendo comunicação consistente.

## 📄 Licença

MIT
