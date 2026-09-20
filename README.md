<div align="center">

# Zenith

**Disciplina, saúde e rotina no mesmo lugar.**

O sistema pessoal de Felipe Lima para organizar o dia, registrar treinos e acompanhar a própria evolução.

Expo SDK 57 · React Native 0.86.3 · React 19 · TypeScript · Supabase

[Começar](#começar) · [Módulos](#módulos) · [Desenvolvimento](#desenvolvimento) · [Segurança](#segurança)

</div>

---

## Visão

Zenith reúne desenvolvimento pessoal e treino em uma interface mobile-first com tema escuro e componentes próprios. Android é o foco; o projeto também possui execução web e configuração iOS, sem implicar validação em dispositivos ou publicação nas lojas.

**Status:** integração incremental com Supabase. Não é uma versão de produção validada. O estado técnico e os resultados de cada entrega estão em [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md).

## Módulos

| Área | Implementado | Limites atuais |
| --- | --- | --- |
| Home | Indicadores compartilhados, tarefas, água e check-in | Depende da sessão e das consultas do usuário |
| Treino | Pesquisa no catálogo, sessão, séries/repetições e histórico persistido | Catálogo estático; sessão em andamento é local |
| Vida | Tarefas, hábitos, hidratação e Pomodoro | Pomodoro local; hábitos semanais ainda sem regra semanal completa |
| Guerreiro | Check-in, sequência, gatilhos e estratégias | Primeiro check-in concorrente requer proteção transacional futura |
| Perfil | Nome, telefone, altura, peso, histórico e alteração de e-mail | Atualização em etapas; e-mail depende da confirmação do Auth |
| Autenticação | Login, cadastro, restauração de sessão e logout | Fluxos multiusuário e RLS ainda precisam de teste ponta a ponta |

Uploads, notificações, conquistas automáticas e sincronização offline não estão concluídos.

## Stack

| Camada | Ferramenta |
| --- | --- |
| Aplicação | Expo SDK 57, React Native 0.86.3 e React 19.2.3 |
| Linguagem | TypeScript 6 |
| Navegação | React Navigation 7 |
| Estado compartilhado | Zustand, em `src/store/useStore.ts` |
| Backend | Supabase Auth, PostgreSQL e políticas RLS |
| Sessão local | AsyncStorage |
| Interface | Componentes próprios, tokens e Lucide |

## Começar

### Pré-requisitos

- Node.js e npm compatíveis com Expo SDK 57. O ambiente anterior utilizou Node 24.21.0; confira as limitações de tooling abaixo.
- Projeto Supabase autorizado, com schema compatível e chave pública `anon`.
- Para Android, dispositivo/emulador configurado; para simulador iOS, macOS e Xcode.

### Instalação

```bash
npm ci
```

Existe conflito conhecido entre o peer de React do `lucide-react-native@0.418.0` e React 19. Se ocorrer `ERESOLVE`, resolva a compatibilidade das dependências antes de continuar; não use `--force` como correção automática e preserve a stack obrigatória.

Copie o exemplo de ambiente:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha somente `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com a URL e a chave pública do seu projeto. O exemplo contém apenas placeholders.

Consulte [supabase/schema.sql](supabase/schema.sql) e `supabase/migrations/` antes de preparar um backend. Não aplique migrations em um projeto remoto sem revisar schema, RLS e autorização. A aplicação usa tabelas em português.

```bash
npm run web
```

Use `npm run android` ou `npm run ios` para os respectivos ambientes. A compilação web não comprova funcionamento remoto nem compatibilidade nativa.

## Desenvolvimento

| Comando | Finalidade |
| --- | --- |
| `npm start` | Iniciar o servidor Expo |
| `npm run web` | Abrir a aplicação web |
| `npm run android` | Iniciar no ambiente Android |
| `npm run ios` | Iniciar no ambiente iOS |
| `npm run docs:check` | Verificar documentação obrigatória |
| `npm run typecheck` | Verificar tipos com pilha ampliada do Node |
| `npm run lint` | Executar typecheck e ESLint |
| `npx expo export --platform web` | Gerar o bundle em `dist/` |

**Limitações de validação:** TypeScript 6 apresentou estouro de pilha com o comando direto; o script `typecheck` amplia a pilha. O ESLint ainda não possui configuração, portanto o lint completo permanece pendente. Não há script de testes automatizados configurado. Consulte o handoff para os resultados realmente executados, sem confundir build com testes funcionais.

### VS Code

Abra a raiz do projeto. As configurações compartilhadas selecionam o TypeScript local, ocultam saídas geradas e excluem ambiente/caches da pesquisa. As extensões recomendadas são Expo Tools e Prettier; não há formatação automática imposta nem extensão ESLint recomendada enquanto sua configuração estiver pendente.

Em **Terminal → Executar Tarefa**, há atalhos para web, documentação, tipos, lint e exportação. A tarefa de exportação desativa a leitura automática de `.env`; para um bundle conectado, forneça apenas as duas variáveis públicas permitidas no ambiente do processo. Nunca forneça chaves administrativas ao bundler.

### Estrutura

```text
Zenith/
├── .github/             Instruções para colaboração assistida
├── .vscode/             Configurações e tarefas compartilhadas
├── assets/              Recursos visuais
├── docs/                Contexto, fluxo de trabalho e handoff
├── scripts/             Verificação da documentação
├── src/
│   ├── api/             Cliente Supabase e adaptadores de domínio
│   ├── config/          Tokens de design
│   ├── features/        Telas e módulos
│   ├── navigation/      Fluxos de navegação
│   ├── store/           Estado compartilhado
│   ├── types/           Tipos de domínio
│   ├── ui/              Componentes reutilizáveis
│   └── index.tsx        Entrada da aplicação
└── supabase/            Schema e migrations versionados
```

### Branches

- `main`: referência estável para entregas revisadas.
- `develop`: integração do desenvolvimento.
- `teste`: validação das mudanças antes de promovê-las.
- `feature/<nome>` e `fix/<nome>`: trabalho isolado, integrado por pull request.

Essa é a convenção desejada; a criação de `develop` e `teste` depende do primeiro commit. Proteções de branch e CI não são configuradas automaticamente por este documento.

## Segurança

- `.env`, chaves privadas, credenciais, tokens, caches Supabase, builds e dados temporários não devem ser versionados. Apenas `.env.example` sanitizado é permitido.
- Tudo que começa com `EXPO_PUBLIC_` pode chegar ao cliente. **Nunca use `service_role`, secret keys ou tokens administrativos nessas variáveis.**
- Um handoff anterior identificou o nome `EXPO_PUBLIC_SUPABASE_SERVICE_KEY` no ambiente local. Ele foi removido do exemplo; o `.env` local não foi alterado. Remova a variável local e avalie revogação/rotação se a chave real tiver sido exposta, inclusive em bundles antigos.
- Chaves públicas não substituem RLS. Valide isolamento com duas contas e falhas de rede antes de produção.
- A exclusão pelo `.gitignore` não remove segredos de um histórico já existente; revise os arquivos antes de cada publicação.

## Colaboração e próximos passos

Leia [AGENTS.md](AGENTS.md), [AI_WORKFLOW.md](docs/AI_WORKFLOW.md), [PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) e [CURRENT_STATE.md](docs/CURRENT_STATE.md) antes de alterar o projeto. Preserve Expo 57, React Native 0.86.3 e React 19, use o store compartilhado e valide interfaces entre aproximadamente 320–430px.

Prioridades: resolver ESLint/dependências, testar autenticação e RLS ponta a ponta, proteger check-in concorrente e validar dispositivos/acessibilidade.

## Direitos

Projeto privado de Felipe Lima. Todos os direitos reservados; nenhuma licença de código aberto foi concedida.
