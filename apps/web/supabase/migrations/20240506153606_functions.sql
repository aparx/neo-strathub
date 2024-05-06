CREATE OR REPLACE FUNCTION create_book(
    book_name varchar, target_team_id uuid, target_game_id int
) RETURNS varchar AS $$
DECLARE
    _book_id        varchar;
    _book_count     int;
    _max_book_count int;
BEGIN
    INSERT INTO public.book (name, team_id, game_id)
    VALUES (book_name, target_team_id, target_game_id)
    RETURNING id INTO _book_id;

    SELECT COUNT(id)
    INTO _book_count
    FROM public.book
    WHERE team_id = target_team_id;

    SELECT (plan.config ->> 'max_books')::int
    INTO _max_book_count
    FROM public.team
             INNER JOIN plan ON team.plan_id = plan.id
    WHERE team.id = target_team_id;

    if (_max_book_count is null OR _book_count > _max_book_count) then
        RAISE EXCEPTION 'Maximum number of books reached';
    end if;

    return _book_id;
END;
$$ VOLATILE LANGUAGE plpgsql
   SECURITY DEFINER;

-- Only allow admin privileges to call this function
REVOKE EXECUTE ON FUNCTION create_book(varchar, uuid, int)
    FROM anon, authenticated;