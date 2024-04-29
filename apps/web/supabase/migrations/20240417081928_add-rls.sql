-- noinspection SqlResolveForFile @ routine/"uid"

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

-- UPDATE

CREATE OR REPLACE FUNCTION can_update_member(member team_member)
    RETURNS boolean AS $$
DECLARE
    _user_id     uuid = auth.uid();
    _self_member record;
    _new_role    team_member_role;
BEGIN
    SELECT public.team_member.profile_id,
           public.team_member.team_id,
           public.team_member_role.flags
    FROM public.team_member
             INNER JOIN public.team_member_role
                        ON team_member.role_id = team_member_role.id
    WHERE profile_id = _user_id
      AND team_id = member.team_id
    INTO _self_member;

    if (_self_member is null OR _self_member.profile_id = member.profile_id) then
        -- Either user is not a member or cannot modify themselves
        return false;
    end if;

    SELECT flags FROM team_member_role WHERE id = member.role_id INTO _new_role;

    if (_new_role.flags > _self_member.flags) then
        -- Cannot change to a role higher than the user themselves have
        return false;
    end if;

    if (_self_member.flags & 16 /* EDIT_MEMBERS */ = 0) then
        -- User does not have the permission to edit any other member
        return false;
    end if;

    return true;
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "Update access"
    ON public.team_member AS PERMISSIVE
    FOR UPDATE TO authenticated WITH CHECK (can_update_member(team_member));

-- DELETE

CREATE OR REPLACE FUNCTION can_delete_member(member team_member)
    RETURNS boolean AS $$
DECLARE
    _user_id     uuid = auth.uid();
    _self_member record;
    _member_role team_member_role;
BEGIN

    SELECT public.team_member.profile_id,
           public.team_member_role.flags
    FROM public.team_member
             INNER JOIN public.team_member_role
                        ON team_member.role_id = team_member_role.id
    WHERE profile_id = _user_id
      AND team_id = member.team_id
    INTO _self_member;

    if (_self_member is null) then
        -- In order to kick members, the invoker must be a part of the team
        return false;
    end if;

    if (_self_member.profile_id = member.profile_id) then
        -- A user can kick themselves whenever (equals out to a leave basically)
        return true;
    end if;

    if (_self_member.flags & 32 /* KICK_MEMBERS */ = 0) then
        -- No permission to kick this member
        return false;
    end if;

    SELECT flags FROM team_member_role WHERE id = member.role_id INTO _member_role;

    if (_member_role.flags >= _self_member.flags) then
        -- Cannot remove equal or higher ranked members
        return false;
    end if;

    return true;
END;
$$ language plpgsql;

CREATE POLICY "Kick access"
    ON public.team_member AS PERMISSIVE
    FOR DELETE TO authenticated USING (can_delete_member(team_member));

-- //////////////////////////////// BLUEPRINT ////////////////////////////////

-- TODO REMOVE OR EDIT
CREATE POLICY "Public read access"
    ON public.blueprint AS PERMISSIVE
    FOR SELECT TO public USING (true);