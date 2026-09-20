create extension if not exists pgcrypto;

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  email text not null default '',
  avatar_url text,
  telefone text,
  biografia text,
  objetivos text[] not null default '{}',
  idade integer check (idade is null or idade between 0 and 150),
  altura numeric(5,2) check (altura is null or altura > 0),
  nivel_atividade text check (nivel_atividade is null or nivel_atividade in ('sedentario','leve','moderado','ativo','muito_ativo')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.metricas_corporais (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  data date not null default current_date,
  peso numeric(6,2),
  percentual_gordura numeric(5,2),
  medidas jsonb not null default '{}'::jsonb,
  foto_url text,
  observacoes text,
  criado_em timestamptz not null default now()
);

create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  prioridade text not null default 'media' check (prioridade in ('baixa','media','alta')),
  data_vencimento timestamptz,
  concluida boolean not null default false,
  concluida_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.habitos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  descricao text,
  frequencia text not null default 'diaria' check (frequencia in ('diaria','semanal')),
  dias_da_semana integer[] not null default '{}',
  sequencia integer not null default 0,
  ultimo_concluido_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.registros_agua (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  quantidade_ml integer not null check (quantidade_ml > 0),
  registrado_em timestamptz not null default now(),
  criado_em timestamptz not null default now()
);

create table if not exists public.sessoes_treino (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  data date not null default current_date,
  inicio timestamptz not null default now(),
  fim timestamptz,
  duracao_minutos integer,
  exercicios jsonb not null default '[]'::jsonb,
  total_series integer,
  total_repeticoes integer,
  esforco_percebido numeric(3,1),
  dificuldade text,
  observacoes text,
  criado_em timestamptz not null default now()
);

create table if not exists public.progresso_guerreiro (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  data_inicio date not null default current_date,
  data_fim date,
  sequencia integer not null default 0,
  recaidas integer[] not null default '{}',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.registros_gatilhos (
  id uuid primary key default gen_random_uuid(),
  progresso_id uuid not null references public.progresso_guerreiro(id) on delete cascade,
  gatilho text not null,
  registrado_em timestamptz not null default now(),
  estrategia text
);

create table if not exists public.conquistas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  icone text not null default 'trophy',
  categoria text not null,
  desbloqueada_em timestamptz not null default now()
);

create table if not exists public.arquivos_pessoais (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  caminho text not null,
  nome text not null,
  tipo_mime text not null,
  tamanho_bytes bigint,
  categoria text not null default 'geral' check (categoria in ('avatar','progresso','documento','geral')),
  criado_em timestamptz not null default now(),
  unique (usuario_id, caminho)
);

create index if not exists metricas_corporais_usuario_data_idx on public.metricas_corporais(usuario_id, data desc);
create index if not exists tarefas_usuario_data_idx on public.tarefas(usuario_id, data_vencimento);
create index if not exists registros_agua_usuario_data_idx on public.registros_agua(usuario_id, registrado_em desc);
create index if not exists sessoes_treino_usuario_data_idx on public.sessoes_treino(usuario_id, data desc);

create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''), coalesce(new.email, ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
after insert on auth.users
for each row execute function public.criar_perfil_novo_usuario();

create or replace function public.atualizar_atualizado_em()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end;
$$;

drop trigger if exists perfis_atualizado_em on public.perfis;
create trigger perfis_atualizado_em before update on public.perfis for each row execute function public.atualizar_atualizado_em();
drop trigger if exists tarefas_atualizado_em on public.tarefas;
create trigger tarefas_atualizado_em before update on public.tarefas for each row execute function public.atualizar_atualizado_em();
drop trigger if exists habitos_atualizado_em on public.habitos;
create trigger habitos_atualizado_em before update on public.habitos for each row execute function public.atualizar_atualizado_em();
drop trigger if exists progresso_atualizado_em on public.progresso_guerreiro;
create trigger progresso_atualizado_em before update on public.progresso_guerreiro for each row execute function public.atualizar_atualizado_em();

alter table public.perfis enable row level security;
alter table public.metricas_corporais enable row level security;
alter table public.tarefas enable row level security;
alter table public.habitos enable row level security;
alter table public.registros_agua enable row level security;
alter table public.sessoes_treino enable row level security;
alter table public.progresso_guerreiro enable row level security;
alter table public.registros_gatilhos enable row level security;
alter table public.conquistas enable row level security;
alter table public.arquivos_pessoais enable row level security;

create policy "usuario gerencia proprio perfil" on public.perfis for all using (id = auth.uid()) with check (id = auth.uid());
create policy "usuario gerencia proprias metricas" on public.metricas_corporais for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprias tarefas" on public.tarefas for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprios habitos" on public.habitos for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia propria agua" on public.registros_agua for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprios treinos" on public.sessoes_treino for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprio guerreiro" on public.progresso_guerreiro for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprios gatilhos" on public.registros_gatilhos for all using (exists (select 1 from public.progresso_guerreiro p where p.id = progresso_id and p.usuario_id = auth.uid())) with check (exists (select 1 from public.progresso_guerreiro p where p.id = progresso_id and p.usuario_id = auth.uid()));
create policy "usuario gerencia proprias conquistas" on public.conquistas for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy "usuario gerencia proprios arquivos" on public.arquivos_pessoais for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

insert into storage.buckets (id, name, public) values ('arquivos-pessoais', 'arquivos-pessoais', false) on conflict (id) do nothing;

create policy "usuario acessa proprios arquivos" on storage.objects for all using (bucket_id = 'arquivos-pessoais' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'arquivos-pessoais' and (storage.foldername(name))[1] = auth.uid()::text);

