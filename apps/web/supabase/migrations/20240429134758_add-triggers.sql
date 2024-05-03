-- noinspection SqlResolveForFile

-- //////////////////////////////// PROFILE ////////////////////////////////
CREATE OR REPLACE FUNCTION copy_avatar_from_user_update()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profile
    SET avatar = new.raw_user_meta_data ->> 'avatar_url'
    WHERE id = old.id;
    return new;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE TRIGGER trigger_copy_avatar_from_user_update
    AFTER UPDATE
    ON auth.users
    FOR EACH ROW
    WHEN (new.raw_user_meta_data != old.raw_user_meta_data)
EXECUTE FUNCTION copy_avatar_from_user_update();

CREATE OR REPLACE FUNCTION get_avatar_on_profile_insert()
    RETURNS TRIGGER AS $$
DECLARE
    _avatar_url varchar;
BEGIN
    -- Retrieve avatar and insert it directly into the profile
    SELECT raw_user_meta_data ->> 'avatar_url'
    INTO _avatar_url
    FROM auth.users
    WHERE id = new.id;

    new.avatar = _avatar_url;
    return new;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE TRIGGER trigger_copy_avatar_on_profile_create
    BEFORE INSERT
    ON public.profile
    FOR EACH ROW
EXECUTE FUNCTION get_avatar_on_profile_insert();

-- //////////////////////////////// TEAM_MEMBER ////////////////////////////////

CREATE OR REPLACE FUNCTION delete_team_if_empty()
    RETURNS TRIGGER AS $$
DECLARE
    _count int;
BEGIN
    SELECT COUNT(*)
    INTO _count
    FROM public.team_member
    WHERE team_id = old.team_id;

    if (_count = 0) then
        DELETE FROM public.team WHERE id = old.team_id;
    end if;

    return old;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE TRIGGER trigger_delete_team_if_empty
    AFTER DELETE
    ON public.team_member
    FOR EACH ROW
EXECUTE FUNCTION delete_team_if_empty();

-- //////////////////////////////// TEAM ////////////////////////////////

CREATE OR REPLACE FUNCTION team_create()
    RETURNS TRIGGER AS $$
DECLARE
    _highest_role   record;
    _random_game_id int;
BEGIN
    if (auth.uid() is not null) then
        -- Select the highest available role
        SELECT id, MAX(flags)
        INTO _highest_role
        FROM public.team_member_role
        GROUP BY id
        LIMIT 1;

        -- Put the authorized user in that team
        INSERT INTO public.team_member (profile_id, team_id, role_id)
        VALUES (auth.uid(), new.id, _highest_role.id);
    end if;

    -- Insert an example book into that team
    SELECT id INTO _random_game_id FROM public.game ORDER BY random() LIMIT 1;

    if (_random_game_id is null) then
        -- Skip the creation of a book, since no game is existing
        return new;
    end if;

    INSERT INTO public.book (name, team_id, game_id)
    VALUES ('Example Stratbook', new.id, _random_game_id);

    return new;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

CREATE TRIGGER trigger_on_team_create
    AFTER INSERT
    ON public.team
    FOR EACH ROW
EXECUTE FUNCTION team_create();