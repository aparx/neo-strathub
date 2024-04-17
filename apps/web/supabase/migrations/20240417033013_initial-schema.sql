-- noinspection SqlResolveForFile

create type public.profile_role as enum ('admin', 'user');
create type public.member_role as enum ('owner', 'manager', 'viewer');

-- //////////////////////////////// GAME ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.game
(
    id       smallserial PRIMARY KEY,
    name     varchar(64) NOT NULL UNIQUE
        CONSTRAINT min_name_length CHECK (length(name) >= 3),
    alias    varchar(32),
    metadata json        NOT NULL DEFAULT '{}'
);

ALTER TABLE public.game ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// PROFILE ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.profile
(
    id         uuid PRIMARY KEY REFERENCES auth.users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    username   varchar(64)         NOT NULL UNIQUE
        CONSTRAINT name_length CHECK (length(username) >= 3 and length(username) <= 32),
    role       public.profile_role NOT NULL DEFAULT 'user'::public.profile_role,
    created_at timestamptz         NOT NULL DEFAULT now(),
    updated_at timestamptz         NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.team
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(64) NOT NULL
        CONSTRAINT name_length CHECK (length(name) >= 3 AND length(name) <= 32),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Disallow case-insensitive duplicate team names globally
CREATE UNIQUE INDEX
    IF NOT EXISTS team_unique_name
    ON public.team (lower(name));

-- //////////////////////////////// BOOK ////////////////////////////////

CREATE TABLE IF NOT EXISTS public.book
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       varchar(64) NOT NULL
        CONSTRAINT name_length CHECK (length(name) >= 2 and length(name) <= 32),
    team_id    uuid        NOT NULL REFERENCES public.team (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    game_id    smallint    NOT NULL REFERENCES public.game (id)
        ON DELETE RESTRICT -- Restrict to prevent accidental deletion
        ON UPDATE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.book ENABLE ROW LEVEL SECURITY;

-- Disallow case-insensitive duplicate book names per team
CREATE UNIQUE INDEX
    IF NOT EXISTS book_unique_name_per_team
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

ALTER TABLE public.team_member ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX
    IF NOT EXISTS team_member_user_team
    ON public.team_member (user_id, team_id);