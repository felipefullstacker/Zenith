# Instruções Permanentes para Agentes (Zenith)

# Continuidade entre agentes
- Todo agente/modelo novo deve primeiro consultar a documentação de contexto do projeto (`docs/PROJECT_CONTEXT.md`) e o checkpoint atual (`docs/CURRENT_STATE.md`).
- O agente NÃO deve presumir que possui conhecimento da conversa anterior.
- Se houver `CURRENT_STATE.md`, ele representa o checkpoint atual.
- Antes de repetir uma tentativa, verificar se ela já foi registrada como malsucedida.

# Segurança
- Preservar funcionalidades existentes.
- Fazer mudanças incrementais e seguras.
- Preferir a menor alteração capaz de resolver a tarefa.
- Não refatorar áreas não relacionadas.
- Não remover código aparentemente inutilizado sem verificar referências.

# Antes de modificar código
O agente deve:
1. identificar o comportamento a ser alterado;
2. localizar os arquivos diretamente envolvidos;
3. verificar dependências diretas;
4. entender o fluxo existente;
5. somente então modificar.

# Depois de modificar
- Validar TypeScript e lint.
- Verificar testes/build relacionados.
- Informar arquivos modificados e riscos conhecidos.

# Regra de Economia de Contexto
- NÃO analisar o repositório inteiro por padrão.
- NÃO abrir dezenas de arquivos preventivamente.
- NÃO reler arquivos já compreendidos na mesma sessão sem motivo.
- NÃO incluir arquivos inteiros na resposta (apenas o necessário).
- NÃO despejar logs gigantes ou terminal inteiro.
- Investigar progressivamente: Nível 0 (Docs) -> Nível 1 (Locais) -> Nível 2 (Arquivos) -> Nível 3 (Deps) -> Nível 4 (Expansão).

# Regras Gerais de Resposta
- Seja curto.
- Não repita código já aplicado aos arquivos.
- Respostas devem focar em: alterações, arquivos alterados, resultados, riscos, próximos passos.
- Nunca escreva "Eu analisei", "Eu tentei", "Eu percebi". Registre fatos técnicos.
