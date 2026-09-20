# Zenith — Instruções para agentes

Antes de editar qualquer arquivo, leia nesta ordem:

1. `AGENTS.md`
2. `docs/AI_WORKFLOW.md`
3. `docs/PROJECT_CONTEXT.md`
4. `docs/CURRENT_STATE.md`
5. `docs/PROGRESSO_UX.md` quando a tarefa envolver interface ou responsividade

## Regras obrigatórias

- Preserve Expo SDK 57, React Native 0.86.3 e React 19.
- Não crie dados falsos novos quando existir estado/API correspondente.
- Use `src/store/useStore.ts` como fonte compartilhada para estado entre módulos.
- Mantenha a interface responsiva para aproximadamente 320–430px de largura.
- Todo botão interativo deve ter `onPress`, estado de carregamento quando aplicável e acessibilidade básica.
- Não exponha secrets; chaves devem vir de `.env`.
- Não adicione comentários no código, salvo solicitação explícita.
- Não faça commit sem solicitação do usuário.

## Arquitetura atual

- Entrada: `src/index.tsx`
- Navegação: `src/navigation/RootNavigation.tsx` e `src/navigation/MainNavigation.tsx`
- Estado: `src/store/useStore.ts`
- API Supabase: `src/api/index.ts`
- Tipos: `src/types/index.ts`
- UI/tokens: `src/ui/` e `src/config/designSystem.ts`
- Módulos: `src/features/home`, `training`, `warrior`, `life`, `profile`

## Estado funcional atual

- Home e Vida compartilham tarefas e hidratação via Zustand.
- Home e Warrior compartilham streak/check-in via Zustand.
- Treino permite pesquisar exercícios, iniciar e finalizar sessão local e exibir histórico.
- Vida possui Pomodoro local, tarefas, hábitos e registro de água.
- Perfil edita nome/e-mail no estado global e possui logout Supabase.
- Estados vazios usam `src/ui/EmptyState.tsx`.
- Bundle web validado com `npx expo export --platform web`.

## Limitações conhecidas

- A integração de domínio ainda é majoritariamente local; várias APIs Supabase existentes ainda não estão conectadas às telas.
- `npm run lint` falha porque o TypeScript 6/Node 24 apresenta `Maximum call stack size exceeded`; ESLint também não possui configuração própria.
- Antes de ampliar persistência, conferir nomes reais das tabelas em `supabase/schema.sql` e migrations; há divergência histórica entre nomes em inglês e português.

## Validação mínima

Após mudanças:

```bash
npm run docs:check
npx expo export --platform web
npm run lint
```

Se uma validação falhar por limitação conhecida, registre o erro em `docs/CURRENT_STATE.md` com data e não declare a tarefa totalmente validada.

## Handoff

Ao concluir uma tarefa, atualize `docs/CURRENT_STATE.md` com:

- data;
- mudanças realizadas;
- validações executadas;
- falhas conhecidas;
- próximos passos.
