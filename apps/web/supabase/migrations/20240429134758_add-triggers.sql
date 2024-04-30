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