-- //////////////////////////////// GAME ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.game AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// ARENA ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.arena AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// PROFILE ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.profile AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// PLAN ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.plan AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// BOOK ////////////////////////////////

-- TODO REMOVE OR EDIT
CREATE POLICY "Public read access"
    ON public.book AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// TEAM_MEMBER_ROLE ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team_member_role AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team_member AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// BLUEPRINT ////////////////////////////////

-- TODO REMOVE OR EDIT
CREATE POLICY "Public read access"
    ON public.blueprint AS PERMISSIVE
    FOR SELECT TO public USING (true);