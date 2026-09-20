# Projeto Zenith - Contexto

## Objetivo
Aplicativo de desenvolvimento pessoal/treino baseado em React Native/Expo.

## Stack
- Framework: Expo (React Native)
- Linguagem: TypeScript
- Navegação: React Navigation (Stack/Bottom Tabs)
- Estado: Zustand
- Backend/Auth: Supabase
- Estilização/UI: Componentes customizados (`src/ui/`)

## Estrutura de Diretórios
- `src/`: Código fonte.
  - `features/`: Funcionalidades do app (Auth, Home, Treino, etc.)
  - `navigation/`: Configuração de rotas.
  - `ui/`: Componentes base (Button, Text, Card, etc.)
  - `store/`: Gerenciamento de estado global (Zustand).
  - `types/`: Definições globais de tipos.

## Pontos de Entrada
- `src/index.tsx` (Root)

## Decisões Arquiteturais
- Aliases com `@/` (configurados em `tsconfig.json`, `babel.config.js`).
- Preferência por imports diretos em componentes UI para evitar dependências circulares.
- Componentes de UI não devem possuir lógica de negócio (apenas visual).

## Restrições
- Seguir estritamente o `AI_WORKFLOW.md`.
- Manter economia de tokens.
