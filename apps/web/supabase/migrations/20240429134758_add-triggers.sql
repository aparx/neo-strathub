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

-- //////////////////////////////// team ////////////////////////////////

-- This function assigns
create or replace function on_create_team()
    returns trigger as $$
declare
    _random_game_id int;
begin
    -- Create a sample book
    select id
    into _random_game_id
    from public.game
    where hidden = false
    order by random()
    limit 1;

    if (_random_game_id is null) then
        -- skip the creation of a book, since no game is existing
        return new;
    end if;

    insert into public.book (name, team_id, game_id)
    values ('Example Stratbook', new.id, _random_game_id);

    return new;
end;
$$ volatile language plpgsql
   security definer;

create trigger trigger_create_sample_book
    after insert
    on public.team
    for each row
execute function on_create_team();