-- noinspection SqlResolveForFile @ routine/"uid"

-- //////////////////////////////// GAME ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.game AS PERMISSIVE
    FOR SELECT TO public USING (true);

-- //////////////////////////////// ARENA ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.arena AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// PROFILE ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.profile AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// PLAN ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.plan AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE OR REPLACE FUNCTION create_team_rls()
    RETURNS boolean AS $$
DECLARE
    _user_id    uuid = auth.uid();
    _team_count int;
BEGIN
    -- Check if the user has permission to create new teams ("hardcap")
    SELECT COUNT(team_id)
    INTO _team_count
    FROM public.team_member
    WHERE profile_id = _user_id;

    if (_team_count >= 100) then
        raise exception 'Reached maximum amount of teams';
    end if;

    return true;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE POLICY "Public write access"
    ON public.team AS PERMISSIVE
    FOR INSERT TO authenticated WITH CHECK (create_team_rls());

CREATE POLICY "Public read access"
    ON public.team AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// BOOK ////////////////////////////////


-- TODO REMOVE OR EDIT
CREATE POLICY "Public read access"
    ON public.book AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// TEAM_MEMBER_ROLE ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team_member_role AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team_member AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// BLUEPRINT ////////////////////////////////

-- TODO REMOVE OR EDIT
CREATE POLICY "Public read access"
    ON public.blueprint AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);