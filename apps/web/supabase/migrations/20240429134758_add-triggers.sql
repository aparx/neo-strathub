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
      and team_player_slot.member_id is null;

    if (_free_slot_id is not null) then
        update public.team_player_slot
        set member_id = new.profile_id
        where id = _free_slot_id;
    end if;

    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_team_member
    after insert
    on public.team_member
    for each row
execute function on_create_team_member();

-- //////////////////////////////// team ////////////////////////////////

-- This function assigns
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
            insert into public.team_player_slot (team_id, color)
            values (new.id, 'hsl(' || ((i * 51) % 360) || ', 75%, 75%)');
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