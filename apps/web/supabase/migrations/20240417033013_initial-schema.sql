-- noinspection SqlResolveForFile

create type public.profile_role as enum ('admin', 'user');
create type public.member_role as enum ('owner', 'manager', 'viewer');
create type public.bp_visibility as enum ('public', 'private', 'unlisted');

-- //////////////////////////////// GAME ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.game
(
    id       smallserial PRIMARY KEY,
    name     varchar(64) NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(name) >= 2),
    alias    varchar(32),
    metadata json        NOT NULL DEFAULT '{}'
);

ALTER TABLE public.game
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// ARENA ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.arena
(
    id       serial PRIMARY KEY,
    game_id  smallint    NOT NULL REFERENCES public.game (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    name     varchar(64) NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(name) >= 2),
    metadata json
);

ALTER TABLE public.arena
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// PROFILE ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.profile
(
    id         uuid PRIMARY KEY REFERENCES auth.users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    username   varchar(64)         NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(username) >= 3),
    role       public.profile_role NOT NULL DEFAULT 'user'::public.profile_role,
    created_at timestamptz         NOT NULL DEFAULT now(),
    updated_at timestamptz         NOT NULL DEFAULT now()
);

ALTER TABLE public.profile
    ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.team
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(32) NOT NULL
        CONSTRAINT min_name_length CHECK (length(name) >= 3),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team
    ENABLE ROW LEVEL SECURITY;

-- Disallow case-insensitive duplicate team names globally
CREATE UNIQUE INDEX
    IF NOT EXISTS uidx_team_unique_name
    ON public.team (lower(name));

-- //////////////////////////////// BOOK ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.book
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(32) NOT NULL
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

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.team_member
(
    id      bigserial PRIMARY KEY,
    user_id uuid               NOT NULL REFERENCES public.profile (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    team_id uuid               NOT NULL REFERENCES public.team (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    role    public.member_role NOT NULL DEFAULT 'viewer'::public.member_role
);

ALTER TABLE public.team_member
    ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX
    IF NOT EXISTS idx_team_member_user_team
    ON public.team_member (user_id, team_id);

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
    tags       varchar[],
    -- The actual data (including canvas) of the blueprint
    data       jsonb                NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.blueprint
    ENABLE ROW LEVEL SECURITY;

CREATE INDEX
    IF NOT EXISTS idx_blueprint_book_arena_name
    ON public.blueprint (book_id, arena_id, name);

CREATE INDEX
    IF NOT EXISTS idx_blueprint_visibility
    ON public.blueprint (visibility);
