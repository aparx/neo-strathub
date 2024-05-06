-- noinspection SqlResolveForFile @ routine/"uid"

-- //////////////////////////////// game ////////////////////////////////

create policy "public read access"
    on public.game as permissive
    for select to authenticated using (not game.hidden);

-- //////////////////////////////// arena ////////////////////////////////


create policy "public read access"
    on public.arena as permissive
    for select to authenticated
    using (exists(select id
                  from public.game
                  where id = arena.game_id
                    and hidden = false));

-- //////////////////////////////// profile ////////////////////////////////

create policy "public read access"
    on public.profile as permissive
    for select to authenticated using (true);

-- //////////////////////////////// plan ////////////////////////////////

create policy "public read access"
    on public.plan as permissive
    for select to authenticated using (true);

-- //////////////////////////////// team ////////////////////////////////

create or replace function can_create_team()
    returns boolean as $$
declare
    _team_count     int;
    _max_team_count int;
begin
    -- The user is not allowed to create any more teams if exceeds the maximum team count
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

    return true;
end;
$$ volatile language plpgsql
   security definer;

create policy "authenticated write access"
    on public.team as permissive
    for insert to authenticated with check (can_create_team());

create policy "public read access"
    on public.team as permissive
    for select to authenticated using (true);

-- //////////////////////////////// book ////////////////////////////////

create or replace function can_select_book(book book)
    returns boolean as $$
begin
    -- only allow the book to be seen when the user is a member of the team or there
    -- is any publicly accessible blueprint within that book.

    if (not exists(select id
                   from public.game
                   where id = book.game_id
                     and hidden = false)) then
        -- game of book does not exist or is hidden, thus disallow read
        return false;
    end if;

    if (exists(select profile_id
               from public.team_member
               where profile_id = auth.uid()
                 and team_id = book.team_id)) then
        -- user is member of the team, thus automatically allow
        return true;
    end if;

    if (exists(select id
               from public.blueprint
               where book_id = book.id
                 and visibility = 'public')) then
        -- book contains at least one publicly accessible blueprint
        -- todo maybe separate out into a different column updated by triggers?
        return true;
    end if;

    return false;
end;
$$ volatile language plpgsql
   security definer;

create policy "public read access"
    on public.book as permissive
    for select to authenticated
    using (can_select_book(book));

-- //////////////////////////////// team_member_role ////////////////////////////////

create policy "public read access"
    on public.team_member_role as permissive
    for select to authenticated using (true);

-- //////////////////////////////// team_member ////////////////////////////////

create or replace function can_select_team_member(target team_member)
    returns boolean as $$
begin
    -- TODO exclude site admins from this function
    -- only allow select if authenticated user is in a team with target member
    return exists(select profile_id
                  from public.team_member
                  where team_id = target.team_id
                    and profile_id = auth.uid());
end;
$$ language plpgsql security definer;

create policy "public read access"
    on public.team_member as permissive
    for select to authenticated
    using (auth.uid() = team_member.profile_id or
           can_select_team_member(team_member));

-- //////////////////////////////// blueprint ////////////////////////////////

create or replace function can_select_blueprint(target blueprint)
    returns boolean as $$
declare
    _team_id uuid;
begin
    if (target.visibility = 'public'::bp_visibility) then
        return true;
    end if;

    select team_id
    into _team_id
    from public.book
    where id = target.book_id;

    if (_team_id is null) then
        return false;
    end if;

    -- a user can only view a blueprint if they are in the according team
    return exists(select profile_id
                  from public.team_member
                  where profile_id = auth.uid()
                    and team_id = _team_id);
end;
$$ language plpgsql security definer;

create policy "public read access"
    on public.blueprint as permissive
    for select to authenticated
    using (can_select_blueprint(blueprint));

-- //////////////////////////////// config ////////////////////////////////

create policy "public read access"
    on public.config as permissive
    for select to authenticated using (true);