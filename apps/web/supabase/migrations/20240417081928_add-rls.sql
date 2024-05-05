-- noinspection SqlResolveForFile @ routine/"uid"

-- //////////////////////////////// GAME ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.game AS PERMISSIVE
    FOR SELECT TO authenticated USING (NOT game.hidden);

-- //////////////////////////////// ARENA ////////////////////////////////


CREATE POLICY "Public read access"
    ON public.arena AS PERMISSIVE
    FOR SELECT TO authenticated
    USING (EXISTS(SELECT id
                  FROM public.game
                  WHERE id = arena.game_id
                    AND hidden = false));

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

CREATE OR REPLACE FUNCTION can_select_book(book book)
    RETURNS boolean AS $$
BEGIN
    -- Only allow the book to be seen when the user is a member of the team or there
    -- is any publicly accessible blueprint within that book.

    if (NOT EXISTS(SELECT id
                   FROM public.game
                   WHERE id = book.game_id
                     AND hidden = false)) then
        -- Game of book does not exist or is hidden, thus disallow read
        return false;
    end if;

    if (EXISTS(SELECT profile_id
               FROM public.team_member
               WHERE profile_id = auth.uid()
                 AND team_id = book.team_id)) then
        -- User is member of the team, thus automatically allow
        return true;
    end if;

    if (EXISTS(SELECT id
               FROM public.blueprint
               WHERE book_id = book.id
                 AND visibility = 'public')) then
        -- Book contains at least one publicly accessible blueprint
        -- TODO maybe separate out into a different column updated by triggers?
        return true;
    end if;

    return false;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE POLICY "Public read access"
    ON public.book AS PERMISSIVE
    FOR SELECT TO authenticated
    USING (can_select_book(book));

-- //////////////////////////////// TEAM_MEMBER_ROLE ////////////////////////////////

CREATE POLICY "Public read access"
    ON public.team_member_role AS PERMISSIVE
    FOR SELECT TO authenticated USING (true);

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE OR REPLACE FUNCTION can_select_team_member(target team_member)
    RETURNS boolean AS $$
BEGIN
    -- TODO Exclude site admins from this function
    -- Only allow SELECT if authenticated user is in a team with target member
    return EXISTS(SELECT profile_id
                  FROM public.team_member
                  WHERE team_id = target.team_id
                    AND profile_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Public read access"
    ON public.team_member AS PERMISSIVE
    FOR SELECT TO authenticated
    USING (auth.uid() = team_member.profile_id OR
           can_select_team_member(team_member));

-- //////////////////////////////// BLUEPRINT ////////////////////////////////

CREATE OR REPLACE FUNCTION can_select_blueprint(target blueprint)
    RETURNS boolean AS $$
DECLARE
    _team_id uuid;
BEGIN
    if (target.visibility = 'public'::bp_visibility) then
        return true;
    end if;

    SELECT team_id
    INTO _team_id
    FROM public.book
    WHERE id = target.book_id;

    if (_team_id is null) then
        return false;
    end if;

    -- A user can only view a blueprint if they are in the according team
    return EXISTS(SELECT profile_id
                  FROM public.team_member
                  WHERE profile_id = auth.uid()
                    AND team_id = _team_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Public read access"
    ON public.blueprint AS PERMISSIVE
    FOR SELECT TO authenticated
    USING (can_select_blueprint(blueprint));