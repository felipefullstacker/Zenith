# Current State

Última atualização: 2026-09-20

## Handoff — publicação inicial GitHub — 2026-09-20

- Autenticação GitHub e identidade de autoria confirmadas; repositório privado `felipefullstacker/Zenith` confirmado vazio antes da publicação.
- Preparado commit inicial dos 54 arquivos revisados, incluindo alterações locais dos componentes compartilhados. Publicação solicitada em `main` e `testes`, com trabalho diário em `testes`.
- Auditoria estática dos candidatos não identificou segredos; `.env`, dependências e builds permanecem ignorados. Auditoria por padrões não garante ausência absoluta de segredos.
- `npm run docs:check` passou; exportação `npx expo export --platform web` passou com dotenv desativado e variáveis Supabase removidas somente do processo filho.
- Primeira execução de typecheck coincidiu com a regeneração de `dist` e falhou com TS6053; repetição após o build passou. Executar essas validações sequencialmente.
- `npm run lint`: typecheck passou na repetição; ESLint 8.57.1 continua bloqueado por ausência de configuração. Validação não é completa; sem testes nativos ou autenticados nesta tarefa.
- Próximos passos: confirmar envio e tracking das duas branches, manter `testes` selecionada, corrigir configuração ESLint e testar o aplicativo antes de integrar mudanças futuras na `main`.

## Handoff — componentes compartilhados e aviso web — 2026-09-20

### TODO desta tarefa
- [x] Ler AGENTS, workflow, contexto, estado, progresso UX e copilot-instructions.
- [x] Investigar pointerEvents em código próprio e dependências instaladas.
- [x] Refinar Button, Input, Card, Modal, EmptyState e cálculo de sombra compartilhado.
- [x] Executar docs:check, typecheck, lint e exportação web.
- [x] Atualizar documentação existente e revisar diff sem alterar staging.
- [ ] Conferir visualmente em 320, 375 e 430px, navegador com teclado e dispositivos nativos.
- [ ] Resolver configuração ESLint e acompanhar correção upstream de pointerEvents.

### Mudanças
- Refinamento RN inspirado em superfícies discretas, hierarquia e estados de interação de interfaces modernas; nenhuma instalação ou uso de Skiper UI, CULT UI ou OriginKIT. Expo 57, RN 0.86.3 e React 19 preservados.
- Button: foco visível, feedback de pressão, alvo mínimo de 44px, nome acessível durante loading e raio por tamanho respeitado.
- Input: anel de foco web discreto, ícones Lucide existentes em vez de emojis de senha, callbacks de foco preservados, ação de ícone direito implementada, estado inválido acessível e campo flexível sem largura mínima implícita.
- Card: variante elevada diferenciada e raio solicitado respeitado. Sombras web passam a aplicar shadowOpacity, antes ignorada e responsável por halos roxos opacos.
- Modal: largura fluida com limite por tamanho, altura limitada, conteúdo rolável, título flexível e fechar com alvo de 44px.
- EmptyState: ícone padrão vetorial, medalhão discreto, hierarquia compacta e descrição sem redução adicional de contraste. Dados, navegação e handlers de domínio não foram alterados.

### Diagnóstico do warning
- Busca em todo `src` não encontrou uso de `pointerEvents`; não existe uso próprio para migrar nesta entrega.
- Emissor: `node_modules/react-native-web/src/modules/createDOMProps/index.js:876–884`; a prop ainda é convertida em estilo, mas gera warnOnce de depreciação.
- Chamadores upstream concretos: `@react-navigation/bottom-tabs/src/views/BottomTabBar.tsx:385,388`, `BottomTabView.tsx:349` e componentes de stack/elements. MainNavigation utiliza esse bottom-tabs.
- Diagnóstico estático: sem captura de stack em navegador, não foi isolado qual chamador dispara primeiro nem a causa de repetição entre recargas. O aviso NÃO foi eliminado; não houve patch em node_modules, troca de navegação ou supressão global. Uma atualização upstream compatível deve ser avaliada/testada separadamente.
- Mensagens ReactDevTools e Running application são informativas normais, não bugs.

### Validações e limites
- `npm run docs:check`: passou.
- `npm run typecheck`: passou com o script real de pilha ampliada.
- `npm run lint`: typecheck passou; ESLint 8.57.1 bloqueado por ausência de configuração, limitação preexistente. Não se declara validação completa.
- `npx expo export --platform web`: passou (2317 módulos). Executado via processo node.exe/npx.cmd com EXPO_NO_DOTENV=1 e variáveis Supabase retiradas somente do ambiente filho, sem ler/modificar `.env`; bundle sem credenciais não valida API remota.
- Sem testes visuais, autenticados, leitores de tela ou nativos nesta entrega. Validar modais com teclado aberto e fontes ampliadas; validar foco, senha, loading e ações em larguras 320–430px.
- Git: staging anterior de 54 arquivos preservado; oito arquivos modificados somente na árvore de trabalho, sem add, reset, commit ou push. Autenticação/identidade GitHub continuam fora do escopo.
- Diff revisado: `git diff --check` acusa CRLF como whitespace; `git -c core.whitespace=cr-at-eol diff --check` passou. Opção aplicada somente ao comando, sem alterar configuração Git ou normalizar arquivos legados.

## Handoff — preparação Git/GitHub e VS Code — 2026-09-20

### Mudanças
- README refeito em português, sem emojis, com stack real, módulos, instalação, comandos, arquitetura, segurança, branches e limitações explícitas.
- `.vscode/settings.json` usa TypeScript local e exclusões de pesquisa/watch; adicionados `extensions.json` (Expo/Prettier) e `tasks.json` com scripts existentes, sem configurar ESLint inexistente.
- `.gitignore` exclui ambientes, credenciais, chaves, dependências, builds, caches, `.opencode`, temporários Supabase e `teste.wav`; permite somente o exemplo de ambiente raiz e os três arquivos compartilhados do VS Code.
- `.env.example` substituído integralmente por placeholders de URL e chave pública anon. Removida a variável administrativa pública do exemplo; `.env` não foi lido nem modificado. Revisar/remover a variável administrativa local e avaliar rotação caso tenha ocorrido exposição.
- Git inicializado com `main` ainda sem commit. Identidade `user.name`/`user.email` ausente; nenhuma configuração Git foi alterada. `develop` e `teste` dependem do primeiro commit e NÃO foram criadas.
- GitHub CLI 2.101.0 instalado somente em `/tmp/opencode/gh_2.101.0_linux_amd64/bin/gh`, a partir do release oficial, com SHA-256 conferido contra o manifesto oficial. WSL/PATH e `where.exe gh` não localizaram instalação prévia. `gh auth status` confirmou ausência de autenticação.
- Nenhum repositório remoto criado, commit, push, deploy ou alteração no Supabase realizado. A publicação futura deve criar `Zenith` privado, verificando antes que não exista; não reutilizar nem sobrescrever repo existente automaticamente.

### Validações desta entrega
- `npm run docs:check`: passou.
- `npm run lint`: etapa `npm run typecheck` passou; ESLint 8.57.1 falhou por ausência de configuração (limitação existente).
- Exportação web: passou. A primeira tentativa com `EXPO_NO_DOTENV=1 npx expo export --platform web` atravessou npm Windows e ainda carregou `.env`; somente nomes de variáveis apareceram no log, não valores. Repetida com `node.exe`, definindo `EXPO_NO_DOTENV` dentro do processo, retirando variáveis Supabase herdadas e executando a CLI Expo com `export --platform web --clear`: passou sem carregar `.env`. `dist/` permanece ignorado, sem publicação; esse bundle sem credenciais não valida integração remota.
- JSON dos três arquivos VS Code: válido.
- Auditoria estática dos 54 arquivos candidatos ao Git: nenhum padrão de JWT, chave privada, token GitHub/Supabase, chave AWS ou credencial embutida detectado; somente caminhos/contagens foram exibidos. Essa checagem por padrões não comprova ausência absoluta de segredos.
- `git check-ignore`: confirmou exclusão de `.env`, `.env.local`, `node_modules`, `dist`, `.opencode`, `supabase/.temp` e `teste.wav`.
- `git status`, `git diff` e `git log --oneline -10` inspecionados; log retorna o erro esperado de branch sem commits. Os 54 arquivos auditados foram adicionados ao staging por caminhos explícitos, sem ambientes reais ou temporários.
- `git diff --cached --check`: falhou por whitespace/terminadores CRLF preexistentes em arquivos legados e linhas extras ao final dos SQL. Não foi aplicada reformatação em massa fora do escopo; revisar normalização antes do primeiro commit.

### Bloqueadores e continuação
1. Usuário deve informar/configurar nome e e-mail de autoria Git antes de qualquer commit; não inventar identidade nem contornar com `git -c`.
2. Autenticar interativamente com `/tmp/opencode/gh_2.101.0_linux_amd64/bin/gh auth login --hostname github.com --web`, sem fornecer tokens ou senhas ao agente. A instalação em `/tmp` é temporária.
3. Após identidade e autenticação, revisar staging novamente, fazer o commit inicial, criar `develop` e `teste`, verificar a inexistência de `Zenith` na conta via `gh` e só então criar privado/publicar as três branches.
4. Resolver configuração ESLint e conflito peer de Lucide/React sem alterar a stack obrigatória. Testes autenticados, nativos e RLS continuam pendentes.

## Handoff — integração persistente dos módulos — 2026-09-20

### Lista de tarefas desta entrega
- [x] Ler instruções, contexto, estado, UX e copilot-instructions.
- [x] Mapear schema português e substituir consultas às tabelas inexistentes em inglês.
- [x] Integrar store, restauração de sessão, limpeza de dados por usuário e descarte de respostas de sessões anteriores.
- [x] Conectar tarefas, hábitos, água, histórico de treino, check-in, gatilhos, perfil e medidas corporais.
- [x] Exibir carregamento, gravação, erros, confirmação de e-mail e recarga de dados.
- [x] Executar as quatro validações solicitadas e investigar falhas sem mudar Expo/RN/React.
- [ ] Testar ponta a ponta com duas contas, RLS, falhas de rede e dispositivos nativos.
- [ ] Configurar ESLint após resolver compatibilidade das dependências de desenvolvimento.

### Mudanças reais
- `src/api/index.ts`: adaptadores de campos e enums para `perfis`, `tarefas`, `habitos`, `registros_agua`, `sessoes_treino`, `progresso_guerreiro`, `registros_gatilhos`, `metricas_corporais` e `conquistas`; sessão em AsyncStorage; água por limites do dia local; consultas filtradas por usuário.
- `src/store/useStore.ts`: removidos seeds pessoais, leitura centralizada, mutações aguardadas, bloqueio de gravações concorrentes no cliente, erros recuperáveis, reset ao trocar conta e proteção contra respostas antigas. Check-in/hábito repetido no mesmo dia não incrementa a sequência; atualização existente usa comparação do timestamp para concorrência.
- `src/index.tsx` e `src/navigation/RootNavigation.tsx`: restauração com tratamento de falha, proteção de corrida com eventos de autenticação, atualização ao retornar ao app e periódica, indicador global e ação de recarregar.
- `src/features/home/HomeScreen.tsx`: indicadores de tarefas/treinos reais em vez de calorias, agenda e insights fictícios; confirmações somente após gravação.
- `src/features/life/LifeScreen.tsx`: criação persistente de tarefas/hábitos, próxima tarefa real, conclusão, adiamento e hidratação integrada.
- `src/features/training/TrainingScreen.tsx`: removido histórico fictício; registro de séries/repetições de exercícios do catálogo existente, duração calculada, detalhes e histórico persistido ao finalizar; formulário preservado se gravação falhar.
- `src/features/warrior/WarriorScreen.tsx`: check-in diário e gatilhos/estratégias persistentes, retirada de datas e gatilhos fictícios.
- `src/features/profile/ProfileScreen.tsx`: nome/telefone/altura persistentes, alteração de e-mail via Auth com confirmação, peso/histórico/IMC e estatísticas reais, tratamento de erro no logout; removidos botões de configurações sem implementação.
- `src/types/index.ts`: telefone e timestamp do check-in.
- `package.json`: `npm run typecheck` amplia a pilha do Node; lint usa esse comando antes do ESLint. Versões da stack preservadas.

### Validações executadas
- `npm run docs:check`: passou.
- `npx expo export --platform web`: passou após alterações finais de código.
- `npx tsc --noEmit`: falhou com `RangeError: Maximum call stack size exceeded` no Node 24.21.0 / TypeScript 6.
- `node.exe --stack-size=8192 node_modules/typescript/bin/tsc --noEmit`: passou; mesma solução incorporada em `npm run typecheck`, que passou durante o lint final.
- `npm run lint`: TypeScript passou com pilha ampliada; ESLint 8.57.1 falhou por ausência de configuração. Instalação do parser TS foi tentada, mas bloqueada por ERESOLVE do peer React <=18 de `lucide-react-native@0.418.0`; não foi forçada e não foi criada configuração inválida.
- `git status` / `git diff`: indisponíveis, diretório não é repositório Git. Nenhum commit ou alteração remota executado.
- Não houve teste autenticado no Supabase nem teste visual/dispositivo; bundle e typecheck não comprovam funcionamento remoto/RLS.

### Limitações e próximos passos
1. Revisar o ambiente: Expo anunciou uma variável com nome `EXPO_PUBLIC_SUPABASE_SERVICE_KEY`. Seu valor não foi lido nem usado pelo código desta entrega; remover chaves administrativas do ambiente cliente e avaliar rotação caso tenham sido publicadas. Não declarar segurança de produção validada.
2. Testar criação/restauração/logout/troca de contas, confirmação de e-mail e falhas de rede com contas de teste autorizadas.
3. Schema atual não possui coluna dedicada de check-in nem unicidade de progresso por usuário. O adaptador usa `atualizado_em` enquanto apenas check-in altera o progresso. Primeiro check-in simultâneo em dispositivos distintos pode criar duas jornadas; requer migration/RPC transacional futura, não aplicada nesta entrega.
4. Catálogo de exercícios continua estático existente (não há tabela de catálogo no schema). Sessão em andamento e Pomodoro continuam locais e se perdem ao recarregar; somente treinos finalizados persistem. Recaídas, planos, uploads, notificações e conquistas automáticas permanecem pendentes.
5. Recarga usa snapshot completo, sem realtime, paginação, cache offline ou fila de reenvio. Uma falha de leitura conserva o snapshot anterior e mostra erro; após gravação bem-sucedida com falha de recarga, usar Recarregar dados, não repetir a gravação.
6. Perfil é salvo em etapas (perfil/Auth/altura), sem transação entre Auth e banco; falha intermediária pode deixar atualização parcial. E-mail exibido vem do Auth; coluna histórica `perfis.email` não é usada para simular confirmação.
7. Hábito semanal ainda segue bloqueio diário, não uma regra de semana civil. Não há fluxo de criação semanal na UI desta entrega.
8. Validar responsividade 320–430px e acessibilidade em dispositivo; ainda há refinamentos nas telas legadas. Estado de carregamento/gravação é global, não granular por operação.
9. Resolver tooling ESLint sem alterar stack e acrescentar testes automatizados de adaptadores, concorrência e isolamento. Entrega funcional incremental, não app completo de produção.

## Registro de handoff — documentação
- Criado `AGENTS.md` na raiz com instrução explícita para leitura da documentação antes de editar.
- Criado `scripts/docs-check.js` e o comando `npm run docs:check`.
- Validação executada: `npm run docs:check` passou.
- A checagem não força leitura em runtime, mas bloqueia o fluxo quando arquivos/referências obrigatórios faltam.

## Tarefa atual
Manter a integração funcional dos módulos e preparar a próxima etapa de persistência real no Supabase.

## Registro de handoff — Home
- Home passou a usar o nome do usuário no estado global.
- Home permite criar tarefas por modal com campo de título.
- Home permite concluir tarefas diretamente na rotina.
- Home navega para Vida em `Ver tudo` da rotina e para Treino em `Ver tudo` do treino.
- Home registra hidratação e check-in Guerreiro no Zustand.
- Home exibe estado vazio para rotina sem tarefas.
- Padding horizontal do Home se adapta a telas abaixo de 380px.
- Validação: `npm run docs:check` e `npx expo export --platform web` passaram.
- `npm run lint` continua bloqueado pelo `Maximum call stack size exceeded` do TypeScript 6/Node 24.

## Estado atual
- `AGENTS.md` foi criado na raiz com o protocolo obrigatório de leitura para agentes.
- `scripts/docs-check.js` valida a presença e as referências da documentação obrigatória.
- Home e Vida compartilham tarefas e hidratação via Zustand.
- Home e Warrior compartilham streak/check-in via Zustand.
- Treino permite pesquisar exercícios, iniciar e finalizar sessão local e exibir histórico.
- Vida possui Pomodoro local, tarefas, hábitos e registro de água.
- Perfil edita nome/e-mail no estado global e possui logout Supabase.
- Estados vazios usam `src/ui/EmptyState.tsx`.
- Erro de bundling web identificado como incompatibilidade de versões entre Expo e React Native, não como falha no código da aplicação.
- Dependências do projeto foram alinhadas ao SDK 57 do Expo.
- `react-native` foi estabilizado em `0.86.3` e o pacote de runtime `@expo/metro-runtime` foi revalidado para a versão compatível com o SDK.
- O Metro web foi validado com sucesso: o bundle foi gerado e o projeto iniciou em `http://localhost:8081` sem o erro `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Componentes visuais e tokens continuam em desenvolvimento, mas a base do app passou a ser estável para build web/local.

## Descoberta importante
- O projeto estava resolvendo uma árvore de dependências inconsistente.
- O erro era causado por subpath `react-native/rn-get-polyfills` sendo requisitado em uma versão que não correspondia ao SDK do Expo.
- O problema principal estava em `package.json`/dependências, não em `src/index.tsx`.

## Arquivos importantes
- `package.json`
- `node_modules/react-native/rn-get-polyfills.js`
- `docs/CURRENT_STATE.md`

## Próximo passo
1. Desativar confirmação de email no painel para desenvolvimento ou confirmar o email enviado antes do login.
2. Migrar a API existente para os nomes das tabelas em português e conectar as telas às consultas reais.
3. Implementar upload de fotos/documentos no bucket privado `arquivos-pessoais`.
4. Configurar sincronização automática das telas após as operações de leitura e gravação.

## Persistência e segurança
- Criado `supabase/schema.sql` com tabelas em português, relacionamentos, índices, trigger de perfil, RLS por usuário e bucket privado para arquivos.
- Criada e aplicada a migration `supabase/migrations/20260920000000_base_zenith.sql` no projeto remoto `zviwvovfangszgalweez`.
- `npx supabase migration list`: migration local e remota sincronizadas.
- Senhas não são armazenadas pelo app; permanecem no Supabase Auth.
- A conta proprietária do Supabase mantém acesso administrativo ao projeto e aos dados.
- Cadastro agora informa quando a confirmação de email é necessária.
- Login identifica `email not confirmed` e reenvia o link de confirmação automaticamente.

## Verificação
- Navegação: corrigida; login e onboarding não tentam mais navegar para `Main` diretamente.
- TypeScript: pendente; o TypeScript 6 no Node 24 apresentou estouro de pilha interno durante a checagem.
- Bundle web: OK (`npx expo export --platform web`).
- Lint: ESLint ainda não executa porque o projeto não possui configuração ESLint.
- Avisos próprios de `shadow*`: substituídos por `boxShadow` no web nos componentes ajustados.
