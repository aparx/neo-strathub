-- noinspection SqlResolveForFile

-- //////////////////////////////// profile ////////////////////////////////
create or replace function copy_avatar_from_user_update()
    returns trigger as $$
begin
    update public.profile
    set avatar = new.raw_user_meta_data ->> 'avatar_url'
    where id = old.id;
    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_copy_avatar_from_user_update
    after update
    on auth.users
    for each row
    when (new.raw_user_meta_data != old.raw_user_meta_data)
execute function copy_avatar_from_user_update();

create or replace function get_avatar_on_profile_insert()
    returns trigger as $$
declare
    _avatar_url varchar;
begin
    -- retrieve avatar and insert it directly into the profile
    select raw_user_meta_data ->> 'avatar_url'
    into _avatar_url
    from auth.users
    where id = new.id;

    new.avatar = _avatar_url;
    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_copy_avatar_on_profile_create
    before insert
    on public.profile
    for each row
execute function get_avatar_on_profile_insert();

-- //////////////////////////////// team_member ////////////////////////////////

create or replace function delete_team_if_empty()
    returns trigger as $$
begin
    if (not exists(select profile_id
                   from public.team_member
                   where team_id = old.team_id)) then
        delete from public.team where id = old.team_id;
    end if;

    return old;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_delete_team_if_empty
    after delete
    on public.team_member
    for each row
execute function delete_team_if_empty();

create or replace function on_create_team_member()
    returns trigger as
$$
declare
    _free_slot_id uuid;
begin
    -- Try to assign new team_member to a team_player_slot if any is free
    select id
    into _free_slot_id
    from public.team_player_slot
    where team_player_slot.team_id = new.team_id
      and not exists(select id
                     from player_slot_assign
                     where slot_id = team_player_slot.id)
    order by slot_index
    limit 1;

    if (_free_slot_id is not null) then
        insert into public.player_slot_assign (slot_id, member_id)
        values (_free_slot_id, new.id);
    end if;

    insert into public.audit_log (team_id, performer_id, type, message)
    values (new.team_id, new.profile_id, 'create'::audit_log_type,
            'Joined the team');

    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_team_member
    after insert
    on public.team_member
    for each row
execute function on_create_team_member();

-- //////////////////////////////// team_player_slot ////////////////////////////////

create or replace function on_create_team_player_slot_index()
    returns trigger as $$
declare
    _max_index int;
begin
    if (new.slot_index is not null) then
        return new;
    end if;

    select max(slot_index)
    into _max_index
    from public.team_player_slot
    where team_id = new.team_id;

    new.slot_index := (case when (_max_index is null) then 0 else 1 + _max_index end);
    return new;
end;
$$ volatile language plpgsql;

create trigger trigger_update_team_player_slot_index
    before insert
    on public.team_player_slot
    for each row
execute function on_create_team_player_slot_index();

-- //////////////////////////////// player_slot_assign ////////////////////////////////

create or replace function on_create_player_slot_assign()
    returns trigger as $$
declare
    _slot     record;
    _username text;
begin
    -- Insert assignment into audit log

    select team_id, slot_index
    from public.team_player_slot
    where id = new.slot_id
    into _slot;

    select public.profile.username
    into _username
    from public.team_member
             left join public.profile on team_member.profile_id = profile.id
    where team_member.id = new.member_id;

    insert into public.audit_log (team_id, performer_id, type, message)
    values (_slot.team_id, auth.uid(), 'update',
            'Assigned ' || coalesce(_username, '(Unknown)') || ' to slot #' ||
            (1 + _slot.slot_index));

    return new;
end;
$$ language plpgsql security definer;

create trigger trigger_create_player_slot_assign
    after insert
    on public.player_slot_assign
    for each row
execute function on_create_player_slot_assign();

-- //////////////////////////////// team ////////////////////////////////

create or replace function on_create_team()
    returns trigger as $$
declare
    _game_player_count int;
begin
    insert into public.book (name, team_id)
    values ('Example Stratbook', new.id);

    -- Try to insert as many member roles as there are players per team for given game
    select (public.game.metadata ->> 'player_count')::int
    into _game_player_count
    from public.team
             left join game on game.id = team.game_id
    where team.id = new.id;

    if (_game_player_count is not null) then
        for i in 1.._game_player_count loop
            insert into public.team_player_slot (team_id, color, slot_index)
            values (new.id, 'hsl(' || (((i - 1) * 60) % 360) || ', 75%, 75%)', i - 1);
        end loop;
    end if;

    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_sample_book
    after insert
    on public.team
    for each row
execute function on_create_team();

-- //////////////////////////////// arena ////////////////////////////////

create or replace function on_arena_create()
    returns trigger as $$
declare
    _newest_date timestamptz;
begin
    if (new.outdated is not null) then
        -- Do nothing, since the insert has manually set the `outdated` column
        return new;
    end if;

    -- Check if the newly inserted arena outdates anything other equivalent arena
    select max(created_at)
    into _newest_date
    from public.arena
    where game_id = new.game_id
      and name = new.name
      and outdated = false;

    if (new.created_at < _newest_date) then
        -- The newly inserted is outdated (version is older than any equivalent)
        new.outdated = true;
        return new;
    end if;

    -- The newly inserted arena is the newest, outdate any predecessors
    update public.arena
    set outdated = true
    where game_id = new.game_id
      and name = new.name
      and created_at <= new.created_at;
    new.outdated = false;
    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_arena
    before insert
    on public.arena
    for each row
execute function on_arena_create();

-- //////////////////////////////// blueprint_character ////////////////////////////////

create or replace function on_blueprint_character_create()
    returns trigger as $$
declare
    _gadget_count int;
begin
    -- Determine how many gadget slots to generate automatically
    select public.game.metadata ->> 'gadgets_per_character'
    into _gadget_count
    from public.team
             left join public.game on game.id = team.game_id
    where team.id = (select public.book.team_id
                     from public.blueprint
                              left join public.book on book.id = blueprint.book_id
                     where blueprint.id = new.blueprint_id);

    -- Automatically insert character_gadget slots for given blueprint_character
    for _ in 1..coalesce(_gadget_count, 0) loop
        insert into public.character_gadget (character_id)
        values (new.id);
    end loop;

    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_bp_char
    after insert
    on public.blueprint_character
    for each row
execute function on_blueprint_character_create();