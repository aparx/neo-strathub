-- noinspection SqlResolveForFile

-- //////////////////////////////// CREATE BOOK ////////////////////////////////
create or replace function create_book(
    book_name varchar, target_team_id uuid, target_game_id int
) returns uuid as $$
declare
    _book_id        varchar;
    _book_count     int;
    _max_book_count int;
begin
    if (exists(select id
               from public.game
               where id = target_game_id
                 and hidden = true)) then
        raise exception 'Game is hidden, cannot create book';
    end if;

    insert into public.book (name, team_id, game_id)
    values (book_name, target_team_id, target_game_id)
    returning id into _book_id;

    select count(id)
    into _book_count
    from public.book
    where team_id = target_team_id;

    select (plan.config ->> 'max_books')::int
    into _max_book_count
    from public.team
             inner join plan on team.plan_id = plan.id
    where team.id = target_team_id;

    if (_max_book_count is null or _book_count > _max_book_count) then
        raise exception 'Maximum number of books reached';
    end if;

    return _book_id;
end;
$$ volatile language plpgsql
   security definer;

-- only the service and higher level roles can create a book, to ensure server side logic
revoke execute on function create_book(varchar, uuid, int)
    from public, anon, authenticated;

-- //////////////////////////////// CREATE TEAM ////////////////////////////////
create or replace function create_team(team_name varchar, target_plan_id int)
    returns uuid as $$
declare
    _team_count     int;
    _max_team_count int;
    _uid            uuid;
begin
    insert into public.team (name, plan_id)
    values (team_name, target_plan_id)
    returning id into _uid;

    select count(team_id)
    into _team_count
    from public.team_member
    where profile_id = _user_id;

    -- Check if the user is even allowed to create any more teams
    select numeric_value
    into _max_team_count
    from public.config
    where name = 'max_teams_per_user';

    if (_max_team_count is null) then
        raise exception 'Missing max_teams_per_user numeric config value';
    end if;

    if (_team_count > _max_team_count) then
        raise exception 'Reached maximum amount of teams';
    end if;

    return _uid;
end;
$$ volatile language plpgsql
   security definer;

-- only the service and higher level roles can create a team, to ensure server side logic
revoke execute on function create_team(varchar, int)
    from public, anon, authenticated;