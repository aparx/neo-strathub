-- noinspection SqlResolveForFile

create type public.profile_role as enum ('admin', 'user');
create type public.bp_visibility as enum ('public', 'private', 'unlisted');
create type public.pay_interval as enum ('monthly', 'yearly');

-- //////////////////////////////// GAME ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.game
(
    id         smallserial PRIMARY KEY,
    name       varchar(64) NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(name) >= 2),
    alias      varchar(32),
    icon       varchar     NOT NULL,
    -- If true, this game is generally hidden from the public
    hidden     bool        NOT NULL DEFAULT false,
    metadata   json        NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX
    IF NOT EXISTS idx_game_id_hidden
    ON public.game (id, hidden);

ALTER TABLE public.game
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// ARENA ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.arena
(
    id         serial PRIMARY KEY,
    game_id    smallint    NOT NULL REFERENCES public.game (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    name       varchar(64) NOT NULL
        CONSTRAINT min_name_length CHECK (length(name) >= 2),
    metadata   json,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.arena
    ENABLE ROW LEVEL SECURITY;

-- Duplicate arena names per game is forbidden
CREATE UNIQUE INDEX
    IF NOT EXISTS uidx_arena_name
    ON public.arena (game_id, name);

-- //////////////////////////////// PROFILE ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.profile
(
    id         uuid PRIMARY KEY REFERENCES auth.users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    username   varchar(32)         NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(username) >= 3),
    role       public.profile_role NOT NULL DEFAULT 'user'::public.profile_role,
    avatar     varchar,
    created_at timestamptz         NOT NULL DEFAULT now(),
    updated_at timestamptz         NOT NULL DEFAULT now()
);

ALTER TABLE public.profile
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// PLAN ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.plan
(
    id               smallserial PRIMARY KEY,
    name             varchar(64)    NOT NULL UNIQUE,
    pricing          decimal(10, 2) NOT NULL,
    pricing_interval public.pay_interval,
    is_default       bool           NOT NULL DEFAULT false,
    config           json           NOT NULL DEFAULT '{}',
    created_at       timestamptz    NOT NULL DEFAULT now(),
    updated_at       timestamptz    NOT NULL DEFAULT now()
);

ALTER TABLE public.plan
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.team
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(20) NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(name) >= 3),
    plan_id    smallint REFERENCES public.plan
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// BOOK ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.book
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(20) NOT NULL
        CONSTRAINT min_name_length CHECK (length(name) >= 2),
    team_id    uuid        NOT NULL REFERENCES public.team (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    game_id    smallint    NOT NULL REFERENCES public.game (id)
        ON DELETE RESTRICT -- Restrict to prevent accidental deletion
        ON UPDATE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.book
    ENABLE ROW LEVEL SECURITY;

-- Disallow case-insensitive duplicate book names per team
CREATE UNIQUE INDEX
    IF NOT EXISTS uidx_book_unique_name_per_team
    ON public.book (team_id, lower(name));

-- //////////////////////////////// TEAM_MEMBER_ROLE ////////////////////////////////
CREATE TABLE IF NOT EXISTS public.team_member_role
(
    id    serial PRIMARY KEY,
    name  varchar(32) NOT NULL
        CONSTRAINT min_name_length CHECK (length(name) >= 3),
    flags bigint      NOT NULL DEFAULT 0
);

ALTER TABLE public.team_member_role
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.team_member
(
    profile_id uuid        NOT NULL REFERENCES public.profile (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    team_id    uuid        NOT NULL REFERENCES public.team (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    role_id    smallint    NOT NULL REFERENCES public.team_member_role (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    PRIMARY KEY (profile_id, team_id)
);

ALTER TABLE public.team_member
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// BLUEPRINT ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.blueprint
(
    id         uuid PRIMARY KEY              default gen_random_uuid(),
    book_id    uuid                 NOT NULL REFERENCES public.book (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    arena_id   int                  NOT NULL REFERENCES public.arena (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    visibility public.bp_visibility NOT NULL DEFAULT 'private'::bp_visibility,
    name       varchar(128)         NOT NULL
        CONSTRAINT min_name_length CHECK (length(name) >= 3),
    tags       varchar(32)[]
        CONSTRAINT max_tags_length CHECK (array_length(tags, 1) <= 16),
    -- The actual data (including canvas) of the blueprint
    data       jsonb                NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz          NOT NULL DEFAULT now(),
    updated_at timestamptz          NOT NULL DEFAULT now()
);

ALTER TABLE public.blueprint
    ENABLE ROW LEVEL SECURITY;

CREATE INDEX
    IF NOT EXISTS idx_book_visibility
    ON public.blueprint (book_id, visibility);

CREATE INDEX
    IF NOT EXISTS idx_blueprint_book_arena_name
    ON public.blueprint (book_id, arena_id, name);

CREATE INDEX
    IF NOT EXISTS idx_blueprint_visibility
    ON public.blueprint (visibility);

-- //////////////////////////////// CONFIG ////////////////////////////////

CREATE TYPE config_value_type AS ENUM ('boolean', 'numeric', 'date', 'text');

CREATE TABLE IF NOT EXISTS public.config
(
    name          varchar PRIMARY KEY,
    type          config_value_type NOT NULL,
    boolean_value boolean,
    numeric_value numeric,
    date_value    date,
    text_value    varchar
);

ALTER TABLE public.config
    ADD CONSTRAINT correct_value CHECK (
        CASE
            WHEN type = 'boolean'::config_value_type
                THEN boolean_value IS NOT NULL
            WHEN type = 'numeric'::config_value_type
                THEN numeric_value IS NOT NULL
            WHEN type = 'date'::config_value_type
                THEN date_value IS NOT NULL
            WHEN type = 'text'::config_value_type
                THEN text_value IS NOT NULL
            ELSE true
            END);

ALTER TABLE public.config
    ADD CONSTRAINT only_one_value CHECK (
                (boolean_value IS NOT NULL)::integer +
                (numeric_value IS NOT NULL)::integer +
                (date_value IS NOT NULL)::integer +
                (text_value IS NOT NULL)::integer
            = 1);