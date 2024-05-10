-- noinspection SqlResolveForFile

create type public.profile_role as enum ('admin', 'user');
create type public.bp_visibility as enum ('public', 'private', 'unlisted');
create type public.pay_interval as enum ('monthly', 'yearly');

-- //////////////////////////////// game ////////////////////////////////

create table if not exists public.game
(
    id         smallserial primary key,
    name       varchar(64) not null unique
        constraint min_name_length check (length(name) >= 2),
    alias      varchar(32),
    icon       varchar     not null,
    -- if true, this game is generally hidden from the public
    hidden     bool        not null default false,
    metadata   jsonb       not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index
    if not exists idx_game_id_hidden
    on public.game (id, hidden);

alter table public.game
    enable row level security;

-- //////////////////////////////// arena ////////////////////////////////

create table if not exists public.arena
(
    id         serial primary key,
    game_id    smallint    not null references public.game (id)
        on delete cascade
        on update cascade,
    name       varchar(64) not null
        constraint min_name_length check (length(name) >= 2),
    metadata   jsonb       not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.arena
    enable row level security;

-- duplicate arena names per game is forbidden
create unique index
    if not exists uidx_arena_name
    on public.arena (game_id, name);

-- //////////////////////////////// profile ////////////////////////////////

create table if not exists public.profile
(
    id         uuid primary key references auth.users (id)
        on delete cascade
        on update cascade,
    username   varchar(32)         not null unique
        constraint min_name_length check (length(username) >= 3),
    role       public.profile_role not null default 'user'::public.profile_role,
    avatar     varchar,
    created_at timestamptz         not null default now(),
    updated_at timestamptz         not null default now()
);

alter table public.profile
    enable row level security;

-- //////////////////////////////// plan ////////////////////////////////

create table if not exists public.plan
(
    id               smallserial primary key,
    name             varchar(64)    not null unique,
    pricing          decimal(10, 2) not null,
    pricing_interval public.pay_interval,
    is_default       bool           not null default false,
    config           json           not null default '{}',
    created_at       timestamptz    not null default now(),
    updated_at       timestamptz    not null default now()
);

alter table public.plan
    enable row level security;

-- //////////////////////////////// team ////////////////////////////////

create table if not exists public.team
(
    id         uuid primary key     default gen_random_uuid(),
    name       varchar(20) not null unique
        constraint min_name_length check (length(name) >= 3),
    plan_id    smallint references public.plan
        on delete set null
        on update cascade,
    game_id    smallint    not null references public.game (id)
        on delete restrict -- restrict to prevent accidental deletion
        on update cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.team
    enable row level security;

-- //////////////////////////////// book ////////////////////////////////

create table if not exists public.book
(
    id         uuid primary key     default gen_random_uuid(),
    name       varchar(32) not null
        constraint min_name_length check (length(name) >= 2),
    team_id    uuid        not null references public.team (id)
        on delete cascade
        on update cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.book
    enable row level security;

-- disallow case-insensitive duplicate book names per team
create unique index
    if not exists uidx_book_unique_name_per_team
    on public.book (team_id, lower(name));

-- //////////////////////////////// team_member_role ////////////////////////////////

create table if not exists public.team_member_role
(
    id    serial primary key,
    name  varchar(32) not null
        constraint min_name_length check (length(name) >= 3),
    flags bigint      not null default 0
);

create index
    if not exists idx_sorted_flags
    on public.team_member_role (flags desc);

alter table public.team_member_role
    enable row level security;

-- //////////////////////////////// team_member ////////////////////////////////

create table if not exists public.team_member
(
    id         serial primary key,
    profile_id uuid        not null references public.profile (id)
        on delete cascade
        on update cascade,
    team_id    uuid        not null references public.team (id)
        on delete cascade
        on update cascade,
    role_id    smallint    not null references public.team_member_role (id)
        on delete restrict
        on update cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index uidx_pk_team_member
    on public.team_member (profile_id, team_id);

alter table public.team_member
    enable row level security;

-- //////////////////////////////// blueprint ////////////////////////////////

create table if not exists public.blueprint
(
    id         uuid primary key              default gen_random_uuid(),
    book_id    uuid                 not null references public.book (id)
        on delete cascade
        on update cascade,
    arena_id   int                  not null references public.arena (id)
        on delete restrict
        on update cascade,
    visibility public.bp_visibility not null default 'private'::bp_visibility,
    name       varchar(128)         not null
        constraint min_name_length check (length(name) >= 3),
    tags       varchar(32)[]
        constraint max_tags_length check (array_length(tags, 1) <= 16),
    created_at timestamptz          not null default now(),
    updated_at timestamptz          not null default now()
);

alter table public.blueprint
    enable row level security;

create index
    if not exists idx_book_visibility
    on public.blueprint (book_id, visibility);

create index
    if not exists idx_blueprint_book_arena_name
    on public.blueprint (book_id, arena_id, name);

create index
    if not exists idx_blueprint_visibility
    on public.blueprint (visibility);

-- //////////////////////////////// blueprint_stage ////////////////////////////////

-- This table is representing a stage in a blueprint strategy.
-- A blueprint is represented in stages. It contains the (partial) data of a blueprint.
create table if not exists public.blueprint_stage
(
    id           uuid primary key     default gen_random_uuid(),
    blueprint_id uuid        not null references public.blueprint (id)
        on delete cascade
        on update cascade,
    stage        int2        not null
        constraint stage_positive check (stage > 0),
    data         jsonb       not null default '{}'::jsonb,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

alter table public.blueprint_stage
    enable row level security;

create unique index
    if not exists uidx_blueprint_stage_per_blueprint
    on public.blueprint_stage (blueprint_id, stage);

-- //////////////////////////////// team_player_slot ////////////////////////////////

-- This table is an assignment table in which team members can be assigned to slots,
-- that can be used in all blueprints of that team.
create table if not exists public.team_player_slot
(
    -- This PK is referenced in the data of a blueprint_stage
    id         uuid primary key     default gen_random_uuid(),
    team_id    uuid        not null references public.team (id)
        on delete cascade
        on update cascade,
    slot_index int
        constraint positive_slot_index check (slot_index >= 0),
    -- The color used to represent this player (visually) in the blueprint
    color      varchar(32) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.team_player_slot
    enable row level security;

create unique index uidx_unique_slot_index_per_team
    on public.team_player_slot (team_id, slot_index);

-- team_player_slot & member join table that enables multiple members for a single slot
create table if not exists public.player_slot_assign
(
    slot_id    uuid        not null references public.team_player_slot (id)
        on delete cascade
        on update cascade,
    member_id  int         not null references public.team_member (id)
        on delete cascade
        on update cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    primary key (slot_id, member_id)
);

alter table public.player_slot_assign
    enable row level security;

create unique index uidx_unique_member_per_slot
    on public.player_slot_assign (slot_id, member_id);

-- //////////////////////////////// game_object ////////////////////////////////

create type game_object_type as enum ('character', 'gadget', 'floor');

-- A game object is an object that is related to a game and can be used in a blueprint
create table if not exists public.game_object
(
    id       serial primary key,
    game_id  int              not null references public.game (id)
        on delete restrict
        on update cascade,
    type     game_object_type not null,
    name     varchar(32),
    url      varchar          not null,
    metadata jsonb
);

alter table public.game_object
    enable row level security;

create index
    if not exists idx_game_type
    on public.game_object (game_id, type, name);

-- //////////////////////////////// audit_log ////////////////////////////////

create type audit_log_type as enum ('error', 'delete', 'create', 'info');

create table if not exists public.audit_log
(
    id         bigserial primary key,
    team_id    uuid        not null references public.team (id)
        on delete cascade
        on update cascade,
    profile_id uuid references public.profile (id)
        on delete no action
        on update cascade,
    type       audit_log_type       default 'info'::audit_log_type,
    message    varchar(128),
    created_at timestamptz not null default now()
);

-- //////////////////////////////// config ////////////////////////////////

create type config_value_type as enum ('boolean', 'numeric', 'date', 'text');

create table if not exists public.config
(
    name          varchar primary key,
    type          config_value_type,
    boolean_value boolean,
    numeric_value numeric,
    date_value    date,
    text_value    varchar
);

alter table public.config
    enable row level security;

alter table public.config
    add constraint correct_value check (
        case
            when type = 'boolean'::config_value_type
                then boolean_value is not null
            when type = 'numeric'::config_value_type
                then numeric_value is not null
            when type = 'date'::config_value_type
                then date_value is not null
            when type = 'text'::config_value_type
                then text_value is not null
            else true
            end);

alter table public.config
    add constraint only_one_value check (
                (boolean_value is not null)::integer +
                (numeric_value is not null)::integer +
                (date_value is not null)::integer +
                (text_value is not null)::integer
            = 1);

-- default config values

insert into public.config
(name, type, boolean_value, numeric_value, date_value, text_value)
values ('max_teams_per_user', 'numeric'::config_value_type, null, 50, null, null)