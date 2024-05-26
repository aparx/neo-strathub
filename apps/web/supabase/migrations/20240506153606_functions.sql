-- noinspection SqlResolveForFile

-- //////////////////////////////////////////////////////////////////////
--                                  TEAM
-- //////////////////////////////////////////////////////////////////////

create or replace function create_team(
    team_name varchar, target_plan_id int, target_game_id int, creator_id uuid
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
        raise exception 'Game not found';
    end if;

    insert into public.team (name, plan_id, game_id)
    values (team_name, target_plan_id, target_game_id)
    returning id into _uid;

    if (creator_id is null) then
        return _uid;
    end if;

    -- Check if the user is allowed to create any more teams in the first place
    select count(team_id)
    into _team_count
    from public.team_member
    where profile_id = creator_id;

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
    from public.member_role
    order by flags desc
    limit 1;

    if (_highest_role_id is null) then
        raise exception 'Could not find a fitting member_role';
    end if;

    insert into team_member (profile_id, team_id, role_id, protected)
    values (creator_id, _uid, _highest_role_id, true);

    return _uid;
end;
$$ volatile language plpgsql
   security definer;

-- Only allow the service to call this function, due to validation
revoke
    execute on function
    create_team(varchar, int, int, uuid)
    from public, anon, authenticated;

-- //////////////////////////////////////////////////////////////////////
--                                  BOOK
-- //////////////////////////////////////////////////////////////////////

create or replace function create_book(
    book_name varchar, team_id uuid
) returns uuid as $$
declare
    _book_id        varchar;
    _book_count     int;
    _max_book_count int;
    _self_member    record;
begin
    select member_role.flags
    from public.team_member
             inner join member_role on team_member.role_id = member_role.id
    where team_member.team_id = $2
      and team_member.profile_id = auth.uid()
    into _self_member;

    if (_self_member is null) then
        raise exception 'Not a member of the team';
    end if;

    if ((_self_member.flags & 64) = 0) then
        raise exception 'Missing permission to create books';
    end if;

    insert into public.book (name, team_id)
    values (book_name, team_id)
    returning id into _book_id;

    select count(id)
    into _book_count
    from public.book
    where book.team_id = $2;

    select (plan.config ->> 'max_books')::int
    into _max_book_count
    from public.team
             inner join plan on team.plan_id = plan.id
    where team.id = team_id;

    if (_max_book_count is null or _book_count > _max_book_count) then
        raise exception 'Maximum number of books reached';
    end if;

    return _book_id;
end;
$$ volatile language plpgsql
   security definer;

revoke
    execute on function
    create_book(varchar, uuid)
    from public, anon;

create or replace function rename_book(book_id uuid, name text)
    returns void as $$
declare
    _team_id    uuid;
    _self_flags bigint;
begin
    -- Check if user can modify the book in the first place
    select team_id
    into _team_id
    from public.book
    where id = book_id;

    if (_team_id is null) then
        raise exception 'Book does not exist';
    end if;

    select member_role.flags
    into _self_flags
    from public.team_member
             inner join member_role on team_member.role_id = member_role.id
    where profile_id = auth.uid()
      and team_id = _team_id;

    if (_self_flags is null) then
        raise exception 'Not a member of the team';
    end if;

    if ((_self_flags & 64 /* MODIFY_BOOKS */) = 0) then
        raise exception 'Missing permission to edit books';
    end if;

    update public.book
    set name=$2
    where id = book_id;
end;
$$ language plpgsql
    security definer;

revoke execute on function
    rename_book(uuid, text)
    from public, anon;

create or replace function delete_book(book_id uuid)
    returns void as $$
declare
    _team_id     uuid;
    _self_member record;
begin
    select team_id
    into _team_id
    from public.book
    where id = book_id;

    if (_team_id is null) then
        raise exception 'Book does not exist';
    end if;

    select member_role.flags
    from public.team_member
             inner join member_role on team_member.role_id = member_role.id
    where team_id = _team_id
      and profile_id = auth.uid()
    into _self_member;

    if (_self_member is null) then
        raise exception 'Not a member of the team';
    end if;

    if ((_self_member.flags & 128 /* DELETE_BOOKS */) = 0) then
        raise exception 'Missing permission to delete books';
    end if;

    delete from public.book where id = book_id;
end;
$$ language plpgsql
    security definer;

revoke execute on function
    delete_book(uuid)
    from public, anon;

-- //////////////////////////////////////////////////////////////////////
--                              TEAM_MEMBER
-- //////////////////////////////////////////////////////////////////////

create or replace function kick_member(member_id bigint)
    returns void as $$
declare
    _target_member record;
    _self_member   record;
    _target_name   varchar;
begin
    select team_member.team_id,
           team_member.profile_id,
           team_member.protected,
           public.member_role.flags
    from public.team_member
             left join public.member_role on team_member.role_id = member_role.id
    where team_member.id = member_id
    into _target_member;

    if (_target_member is null) then
        raise exception 'Target member is not existing';
    end if;

    select team_member.id,
           team_member.protected,
           public.member_role.flags
    from public.team_member
             inner join public.member_role
                        on team_member.role_id = member_role.id
    where team_member.profile_id = auth.uid()
      and team_member.team_id = _target_member.team_id
    into _self_member;

    if (member_id != _self_member.id and not _self_member.protected) then
        if ((_self_member.flags & 32 /* KICK_MEMBERS */) = 0) then
            raise exception 'Missing permission to kick members';
        end if;

        if (_self_member.flags <= _target_member.flags or _target_member.protected) then
            raise exception 'You have equal or less permissions than the target member';
        end if;
    end if;

    select name
    into _target_name
    from public.profile
    where id = _target_member.profile_id;

    insert into public.audit_log (team_id, performer_id, type, message)
    values (_target_member.team_id, auth.uid(), 'delete'::audit_log_type,
            'Removed ' || _target_name || ' from the team');

    -- This delete could cause the team to be deleted, thus do at the end (audit log)
    delete from public.team_member where id = member_id;
end;
$$ volatile language plpgsql
   security definer;

revoke
    execute on function
    kick_member(bigint)
    from public, anon;

create or replace function update_member_role(
    team_id uuid, target_profile_id uuid, new_role_id bigint
) returns void as $$
declare
    _self_member    record;
    _target_member  record;
    _new_role_flags bigint;
begin
    select team_member.id, team_member.protected, public.member_role.flags
    from public.team_member
             inner join member_role
                        on team_member.role_id = member_role.id
    where team_member.profile_id = auth.uid()
      and team_member.team_id = $1
    into _self_member;

    select team_member.id, team_member.protected, public.member_role.flags
    from public.team_member
             inner join member_role
                        on team_member.role_id = member_role.id
    where team_member.profile_id = target_profile_id
      and team_member.team_id = $1
    into _target_member;

    if (_self_member is null) then
        raise exception 'You are not a member of target team';
    end if;

    if (_target_member is null) then
        raise exception 'Target user not a member of target team';
    end if;

    if (_target_member.protected and _target_member.id != _self_member.id) then
        raise exception 'Target member is protected and cannot be changed';
    end if;

    if (not _self_member.protected) then
        if ((_self_member.flags & 16 /* EDIT_MEMBERS */) = 0) then
            raise exception 'Missing permission to edit members';
        end if;

        if (_self_member.flags <= _target_member.flags or _target_member.protected) then
            raise exception 'Target member has equal or higher permissions than you';
        end if;

        select flags
        into _new_role_flags
        from public.member_role
        where id = new_role_id;

        if (_new_role_flags is null or _new_role_flags >= _self_member.flags) then
            raise exception 'Target role''s flags are higher or equal to yours';
        end if;
    end if;

    update public.team_member
    set role_id = new_role_id
    where id = _target_member.id;
end;
$$ volatile language plpgsql
   security definer;

revoke
    execute on function
    update_member_role(uuid, uuid, bigint)
    from public, anon;

create or replace function assign_member_to_slot(
    member_id bigint, slot_id bigint, try_swap boolean
) returns void as $$
declare
    _target_member  record;
    _self_member    record;
    _slot_index     int;
    _target_name    varchar;
    _slots_before   bigint[];
    _target_members bigint[];
    _l_slot         bigint;
    _l_mem          bigint;
begin
    select team_id, profile_id, public.member_role.flags
    from public.team_member
             inner join member_role
                        on team_member.role_id = member_role.id
    where team_member.id = $1
    into _target_member;

    if (_target_member is null) then
        raise exception 'Target member does not exist';
    end if;

    select team_member.id, public.member_role.flags
    from public.team_member
             inner join member_role
                        on team_member.role_id = member_role.id
    where team_member.profile_id = auth.uid()
      and team_member.team_id = _target_member.team_id
    into _self_member;

    if (_self_member is null) then
        raise exception 'You are not a member of target team';
    end if;

    if ((_self_member.flags & 16 /* EDIT_MEMBERS */) = 0) then
        raise exception 'Missing permission to edit members';
    end if;

    select name
    into _target_name
    from public.profile
    where id = _target_member.profile_id;

    if (slot_id is not null and try_swap) then
        -- Get the slots of `member_id` before
        _slots_before := (select array_agg(member_to_player_slot.slot_id)
                          from public.member_to_player_slot
                          where member_to_player_slot.member_id = $1);

        -- Get all members in the slots `member_id` was associated before
        _target_members := (select array_agg(member_to_player_slot.member_id)
                            from public.member_to_player_slot
                            where member_to_player_slot.slot_id = $2
                              and member_to_player_slot.member_id != $1);

        if (coalesce(array_length(_slots_before, 1), 0) > 0
            and coalesce(array_length(_target_members, 1), 0) > 0) then
            -- Move the current with `slot_id` associated members to `_slots_before`
            foreach _l_slot in array _slots_before loop
                foreach _l_mem in array _target_members loop
                    delete
                    from public.member_to_player_slot
                    where member_to_player_slot.member_id = _l_mem;

                    insert into public.member_to_player_slot (slot_id, member_id)
                    values (_l_slot, _l_mem);
                end loop;
            end loop;
        end if;
    end if;

    delete
    from public.member_to_player_slot
    where member_to_player_slot.member_id = $1;

    if (slot_id is not null) then
        select index
        into _slot_index
        from public.player_slot
        where id = slot_id;

        if (_slot_index is null) then
            raise exception 'Slot does not exist or is invalid';
        end if;

        insert into public.member_to_player_slot (slot_id, member_id)
        values ($2, $1);
    else
        insert into public.audit_log (team_id, performer_id, type, message)
        values (_target_member.team_id, auth.uid(), 'update'::audit_log_type,
                'Assigned ' || _target_name || ' to no slot');
    end if;

end;
$$ volatile language plpgsql
   security definer;

revoke
    execute on function
    assign_member_to_slot(bigint, bigint, boolean)
    from public, anon;

-- //////////////////////////////////////////////////////////////////////
--                                BLUEPRINT
-- //////////////////////////////////////////////////////////////////////

create or replace function get_perms_on_blueprint(blueprint_id uuid, user_id uuid)
    returns bigint as $$
declare
    _flags   bigint;
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
    select public.member_role.flags
    into _flags
    from public.team_member
             inner join public.member_role
                        on team_member.role_id = member_role.id
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

-- //////////////////////////////////////////////////////////////////////
--                          BLUEPRINT_CHARACTER
-- //////////////////////////////////////////////////////////////////////

create or replace function update_character_object(
    character_id bigint, object_id bigint
) returns boolean as $$
declare
    _blueprint_id uuid;
    _flags        bigint;
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
    set object_id  = $2,
        updated_at = now()
    where id = character_id;

    return true;
end;
$$ volatile language plpgsql
   security definer;

-- //////////////////////////////////////////////////////////////////////
--                            CHARACTER_GADGET
-- //////////////////////////////////////////////////////////////////////

create or replace function update_gadget_object(
    gadget_id bigint, object_id bigint
) returns boolean as $$
declare
    _blueprint_id uuid;
    _flags        bigint;
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