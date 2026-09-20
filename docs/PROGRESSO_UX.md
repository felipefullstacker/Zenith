# Progresso UX

## Refinamento compartilhado — 2026-09-20

- [x] Botões com foco visível, feedback de pressão, loading acessível e alvo mínimo de 44px.
- [x] Inputs com superfície discreta, foco delimitado, ícones vetoriais de senha, callbacks preservados e ação direita funcional.
- [x] Cards com elevação diferenciada, raio consistente e sombras web respeitando opacidade nativa.
- [x] Modais fluidos com limite de altura, conteúdo rolável, título flexível e fechamento acessível.
- [x] Estados vazios com medalhão vetorial padrão e melhor contraste/escala de texto.
- [x] Implementação limitada aos componentes compartilhados e utilitário de sombras: alcança formulários de autenticação/perfil, tarefas de Home/Vida e detalhes de Treino sem alterar dados ou fluxos.
- [x] Nenhuma biblioteca adicionada: inspiração visual moderna, não integração de Skiper UI, CULT UI ou OriginKIT.
- [x] docs:check, typecheck e export web passaram; lint bloqueado pela configuração ESLint ausente.
- [ ] Validar em navegador/dispositivo nas larguras 320, 375 e 430px, fontes ampliadas, teclado aberto, Tab/Enter, leitores de tela e fluxos autenticados. Revisão estrutural e bundle não equivalem a teste visual.
- [ ] Acompanhar pointerEvents upstream: nenhum uso em src; React Navigation passa a prop que RN Web depreca. Aviso permanece, sem supressão/patch. ReactDevTools e Running application são logs normais.

## Histórico: autenticação e continuidade do refinamento

- Login e cadastro passaram a validar os campos.
- Login e cadastro usam as funções reais da API Supabase.
- O login atualiza o estado global e navega para a área principal.
- Falhas de autenticação aparecem no formulário sem travar a tela.
- A validação TypeScript deve ser executada com `npx tsc --noEmit`.

Nesta etapa também foram adicionados validação de login/cadastro, integração com Supabase e mensagens de erro nos formulários.

Validação: `npx tsc --noEmit` passou. `npm run lint` executou o TypeScript, mas o ESLint não iniciou porque não existe arquivo de configuração ESLint no projeto.

Próxima etapa: persistência/restauração da sessão, logout real e estados de dados nas telas principais.
