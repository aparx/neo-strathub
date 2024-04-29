-- noinspection SqlResolveForFile

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
EXECUTE PROCEDURE delete_team_if_empty();