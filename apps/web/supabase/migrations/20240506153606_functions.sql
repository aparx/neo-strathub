-- noinspection SqlResolveForFile

create or replace function create_book(
    book_name varchar, target_team_id uuid, performer_id uuid
) returns uuid as $$
declare
    _book_id        varchar;
    _book_count     int;
    _max_book_count int;
begin
    -- TODO check if game is hidden

    insert into public.book (name, team_id)
    values (book_name, target_team_id)
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

    insert into public.audit_log (team_id, performer_id, type, message)
    values (target_team_id, performer_id, 'create'::audit_log_type,
            'Created book "' || book_name || '"');

    return _book_id;
end;
$$ volatile language plpgsql
   security definer;

-- only the service and higher level roles can create a book, to ensure server side logic
revoke
    execute on function
    create_book(varchar, uuid, uuid)
    from public, anon, authenticated;

create or replace function create_team(
    team_name varchar, target_plan_id int, target_game_id int
) returns uuid as $$
declare
    _uid             uuid;
    _team_count      int;
    _max_team_count  int;
    _highest_role_id int;
begin
    -- Check if game is hidden, if so deny
    if (not exists(select id
                   from public.game
                   where id = target_game_id
                     and hidden = false)) then
        raise exception 'Game not found or is hidden';
    end if;

    insert into public.team (name, plan_id, game_id)
    values (team_name, target_plan_id, target_game_id)
    returning id into _uid;

    insert into public.audit_log (team_id, performer_id, type, message)
    values (_uid, auth.uid(), 'create'::audit_log_type,
            'Created team "' || team_name || '"');

    if (auth.uid() is null) then
        return _uid;
    end if;

    -- Check if the user is allowed to create any more teams in the first place
    select count(team_id)
    into _team_count
    from public.team_member
    where profile_id = auth.uid();

    select numeric_value
    into _max_team_count
    from public.config
    where name = 'max_teams_per_user';

    if (_max_team_count is null) then
        raise exception 'Missing max_teams_per_user numeric config value';
    end if;

    if (_team_count >= _max_team_count) then
        raise exception 'Reached maximum amount of teams';
    end if;

    -- Select the highest available role and assign the user to it
    select id
    into _highest_role_id
    from public.team_member_role
    order by flags desc
    limit 1;

    if (_highest_role_id is null) then
        raise exception 'Could not find a fitting team_member_role';
    end if;

    insert into team_member (profile_id, team_id, role_id)
    values (auth.uid(), _uid, _highest_role_id);

    return _uid;
end;
$$ volatile language plpgsql
   security definer;

-- Only allow authenticated and higher users to create teams
revoke
    execute on function
    create_team(varchar, int, int)
    from public, anon;

create or replace function get_perms_on_blueprint(blueprint_id uuid, user_id uuid)
    returns int8 as $$
declare
    _flags   int8;
    _team_id uuid;
begin
    -- Determine the identifier of the team
    select public.book.team_id
    into _team_id
    from public.blueprint
             inner join public.book on blueprint.book_id = book.id
    where blueprint.id = blueprint_id;

    if (_team_id is null) then
        return null;
    end if;

    -- Determine the flags of the authenticated user
    select public.team_member_role.flags
    into _flags
    from public.team_member
             inner join public.team_member_role
                        on team_member.role_id = team_member_role.id
    where team_member.profile_id = user_id
      and team_member.team_id = _team_id;

    if (_flags is null) then
        return null;
    end if;

    return _flags;
end;
$$
    language plpgsql
    security definer;

revoke
    execute on function
    get_perms_on_blueprint(uuid, uuid)
    from public, anon, authenticated;

create or replace function update_character_object(
    character_id int8, object_id int8
) returns boolean as $$
declare
    _blueprint_id uuid;
    _flags        int8;
begin
    select blueprint_id
    into _blueprint_id
    from public.blueprint_character
    where id = character_id;

    if (_blueprint_id is null) then
        return false;
    end if;

    _flags := get_perms_on_blueprint(_blueprint_id, auth.uid());
    if (_flags is null or (_flags & 2 /* MODIFY_DOCUMENTS */) = 0) then
        return false; -- No permission
    end if;

    update public.blueprint_character
    set object_id = $2
    where id = character_id;

    return true;
end;
$$ volatile language plpgsql
   security definer;

create or replace function update_gadget_object(
    gadget_id int8, object_id int8
) returns boolean as $$
declare
    _blueprint_id uuid;
    _flags        int8;
begin
    select public.blueprint_character.blueprint_id
    into _blueprint_id
    from public.character_gadget
             inner join public.blueprint_character
                        on character_gadget.character_id = blueprint_character.id
    where character_gadget.id = gadget_id;

    if (_blueprint_id is null) then
        return false;
    end if;

    _flags := get_perms_on_blueprint(_blueprint_id, auth.uid());
    if (_flags is null or (_flags & 2 /* MODIFY_DOCUMENTS */) = 0) then
        return false; -- No permission
    end if;

    update public.character_gadget
    set object_id = $2
    where id = gadget_id;

    return true;
end;
$$ volatile language plpgsql
   security definer;