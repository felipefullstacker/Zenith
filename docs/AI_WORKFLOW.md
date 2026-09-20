# AI Workflow - Projeto Zenith

## Protocolo Operacional
Todo agente deve seguir este fluxo ao iniciar:

1. **Consulta (Nível 0)**: Ler `copilot-instructions.md`, `PROJECT_CONTEXT.md` e `CURRENT_STATE.md`.
2. **Localização (Nível 1)**: Buscar arquivos relevantes sem abrir todo o repo.
3. **Exploração (Nível 2-4)**: Investigar arquivos necessários progressivamente.
4. **Execução**: Mudança incremental.
5. **Handoff**: Atualizar `CURRENT_STATE.md` (apenas se necessário) e finalizar.

## Regras de Handoff / Reset de Chat
Quando terminar uma tarefa ou resetar chat:
1. Verificar `git status` e `git diff`.
2. Atualizar `docs/CURRENT_STATE.md` com status real (bugs, próximos passos).
3. Parar de trabalhar.

## Gerenciamento de Logs/Output
- Não exibir logs gigantes no chat (filtrar/buscar erros).
- Não repetir código já aplicado nos arquivos.
- Preferir Git para rastrear mudanças históricas.
