-- noinspection SqlResolveForFile @ table/"users"

-- noinspection sqlresolveforfile

begin;
drop publication if exists supabase_realtime;
create publication supabase_realtime;
commit;

create type bp_visibility as enum ('public', 'private', 'unlisted');
create type pay_interval as enum ('monthly', 'annually');

create type audit_log_type as enum ('create', 'update', 'delete', 'info');
create type config_value_type as enum ('boolean', 'numeric', 'date', 'text');

-- -------------------------- game --------------------------
create table if not exists public.game
(
    id         serial primary key,
    name       varchar(128) not null unique,
    alias      varchar(64),
    icon       text         not null,
    hidden     boolean      not null default false,
    metadata   jsonb        not null default '{}'::jsonb,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

create index
    if not exists game__hidden_idx
    on public.game (hidden);

alter table public.game
    enable row level security;

-- -------------------------- arena --------------------------
create table if not exists public.arena
(
    id         bigserial primary key,
    game_id    smallint     not null references public.game (id)
        on delete cascade
        on update cascade,
    name       varchar(128) not null,
    metadata   jsonb        not null default '{}'::jsonb,
    outdated   boolean               default null,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

alter table public.arena
    enable row level security;

create index
    if not exists arena__game_name_outdated
    on public.arena (game_id, name, outdated);

-- -------------------------- profile --------------------------
create table if not exists public.profile
(
    id         uuid primary key references auth.users (id)
        on delete cascade
        on update cascade,
    name       varchar(128) not null unique
        constraint name_length check (length(name) >= 3 and length(name) <= 32),
    avatar     varchar(256),
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

alter table public.profile
    enable row level security;

-- -------------------------- plan --------------------------
create table if not exists public.plan
(
    id               serial primary key,
    name             varchar(128)   not null unique,
    pricing          decimal(10, 2) not null,
    pricing_interval public.pay_interval,
    default_plan     boolean        not null default false,
    config           jsonb          not null default '{}'::jsonb,
    created_at       timestamptz    not null default now(),
    updated_at       timestamptz    not null default now()
);

alter table public.plan
    enable row level security;

-- -------------------------- team --------------------------
create table if not exists public.team
(
    id         uuid primary key      default gen_random_uuid(),
    name       varchar(128) not null unique
        constraint name_length check (length(name) >= 3 and length(name) <= 32),
    plan_id    int references public.plan (id)
        on delete set null
        on update cascade,
    game_id    int          not null references public.game (id)
        on delete restrict
        on update cascade,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

alter table public.team
    enable row level security;

-- -------------------------- book --------------------------
create table if not exists public.book
(
    id         uuid primary key      default gen_random_uuid(),
    name       varchar(256) not null
        constraint name_length check (length(name) >= 2 and length(name) <= 32),
    team_id    uuid         not null references public.team (id)
        on delete cascade
        on update cascade,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

alter table public.book
    enable row level security;

create unique index
    if not exists book__unique_name_per_team_uidx
    on public.book (team_id, name);

-- -------------------------- member_role --------------------------
create table if not exists public.member_role
(
    id    serial primary key,
    name  varchar(128) not null
        constraint name_length check (length(name) != 0),
    flags bigint       not null
);

alter table public.member_role
    enable row level security;

create index
    if not exists member_role__sorted_flags_idx
    on public.member_role (flags desc);

-- -------------------------- team_member --------------------------
create table if not exists public.team_member
(
    id         bigserial primary key,
    profile_id uuid        not null references public.profile (id)
        on delete cascade
        on update cascade,
    team_id    uuid        not null references public.team (id)
        on delete cascade
        on update cascade,
    role_id    int         not null references public.member_role (id)
        on delete restrict
        on update cascade,
    -- If true this member has privileged access (inception/owner status)
    privileged boolean     not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.team_member
    enable row level security;

create unique index
    if not exists team_member__profile_team_uidx
    on public.team_member (profile_id, team_id);

-- -------------------------- blueprint --------------------------
create table if not exists public.blueprint
(
    id         uuid primary key       default gen_random_uuid(),
    book_id    uuid          not null references public.book (id)
        on delete cascade
        on update cascade,
    arena_id   int           not null references public.arena (id)
        on delete restrict
        on update cascade,
    visibility bp_visibility not null default 'private'::bp_visibility,
    name       varchar(256)  not null
        constraint name_length check (length(name) >= 3 and length(name) <= 64),
    tags       varchar(32)[32],
    created_at timestamptz   not null default now(),
    updated_at timestamptz   not null default now()
);

alter table public.blueprint
    enable row level security;

create index
    if not exists blueprint__book_visibility_idx
    on public.blueprint (book_id, visibility);

create index
    if not exists blueprint__book_arena_name_idx
    on public.blueprint (book_id, arena_id, name);

create index
    if not exists blueprint__visibility_idx
    on public.blueprint (visibility);

-- -------------------------- blueprint_stage --------------------------
create table if not exists public.blueprint_stage
(
    id           bigserial primary key,
    blueprint_id uuid        not null references public.blueprint (id)
        on delete cascade
        on update cascade,
    index        smallint    not null
        constraint index_positive check (index >= 0),
    data         jsonb       not null,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

alter table public.blueprint_stage
    enable row level security;

create unique index
    if not exists blueprint_stage__blueprint_index_uidx
    on public.blueprint_stage (blueprint_id, index);

-- -------------------------- player_slot --------------------------
create table if not exists public.player_slot
(
    id         bigserial primary key,
    team_id    uuid         not null references public.team (id)
        on delete cascade
        on update cascade,
    index      smallint
        constraint index_positive check (index >= 0),
    color      varchar(128) not null,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

alter table public.player_slot
    enable row level security;

create unique index
    if not exists player_slot__team_index_uidx
    on public.player_slot (team_id, index);

-- -------------------------- member_to_player_slot --------------------------
create table if not exists public.member_to_player_slot
(
    slot_id    bigint      not null references public.player_slot (id)
        on delete cascade
        on update cascade,
    member_id  bigint      not null references public.team_member (id)
        on delete cascade
        on update cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    primary key (slot_id, member_id)
);

alter table public.member_to_player_slot
    enable row level security;

-- -------------------------- game_object --------------------------
create table if not exists public.game_object
(
    id       bigserial primary key,
    game_id  int          not null references public.game (id)
        on delete cascade
        on update cascade,
    type     varchar(128) not null,
    url      varchar(512) not null,
    name     varchar(128),
    metadata jsonb
);

alter table public.game_object
    enable row level security;

-- -------------------------- blueprint_character --------------------------
create table if not exists public.blueprint_character
(
    id           bigserial primary key,
    object_id    bigint references public.game_object (id)
        on delete set null
        on update cascade,
    blueprint_id uuid        not null references public.blueprint (id)
        on delete cascade
        on update cascade,
    slot_id      bigint references public.player_slot (id)
        on delete set null
        on update cascade,
    index        smallint    not null
        constraint index_positive check (index >= 0),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

alter table public.blueprint_character
    enable row level security;

create unique index blueprint_character__blueprint_index_object_uidx
    on public.blueprint_character (blueprint_id, index, object_id);

-- -------------------------- character_gadget --------------------------
create table if not exists public.character_gadget
(
    id           bigserial primary key,
    character_id bigint      not null references public.blueprint_character (id)
        on delete cascade
        on update cascade,
    object_id    bigint references public.game_object (id)
        on delete set null
        on update cascade,
    created_at   timestamptz not null default now()
);

alter table public.character_gadget
    enable row level security;

-- -------------------------- audit_log --------------------------
create table if not exists public.audit_log
(
    id           bigserial primary key,
    team_id      uuid references public.team (id)
        on delete set null
        on update cascade,
    performer_id uuid references public.profile (id)
        on delete set null
        on update cascade,
    type         public.audit_log_type default 'info'::audit_log_type,
    message      varchar(512),
    created_at   timestamptz not null  default now()
);

alter table public.audit_log
    enable row level security;

-- -------------------------- config --------------------------
create table if not exists public.config
(
    name          varchar primary key,
    type          public.config_value_type,
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
values ('max_teams_per_user', 'numeric'::config_value_type, null, 50, null, null);