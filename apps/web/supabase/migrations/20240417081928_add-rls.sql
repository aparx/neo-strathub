-- noinspection SqlResolveForFile
-- //////////////////////////////// game ////////////////////////////////
create policy "public read access" on public.game as permissive for
    select
    to authenticated using (not game.hidden);

-- //////////////////////////////// arena ////////////////////////////////
create policy "public read access" on public.arena as permissive for
    select
    to authenticated using (
    exists (select id
            from public.game
            where id = arena.game_id
              and hidden = false)
    );

-- //////////////////////////////// arena_level ////////////////////////////////
create policy "public read access"
    on public.arena_level
    as permissive for select
    to authenticated
    using (true);

-- //////////////////////////////// profile ////////////////////////////////
create policy "public read access" on public.profile as permissive for
    select
    to authenticated using (true);

-- //////////////////////////////// plan ////////////////////////////////
create policy "public read access" on public.plan as permissive for
    select
    to authenticated using (true);

-- //////////////////////////////// team ////////////////////////////////
create policy "public read access" on public.team as permissive for
    select
    to authenticated using (true);

-- //////////////////////////////// book ////////////////////////////////
create function can_select_book(book book) returns boolean as
$$
begin
    -- only allow the book to be seen when the user is a actions of the team or there
    -- is any publicly accessible blueprint within that book.

    if (exists(select profile_id
               from public.team_member
               where profile_id = auth.uid()
                 and team_id = book.team_id)) then
        -- user is actions of the team, thus automatically allow
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

create policy "public read access" on public.book as permissive for
    select
    to authenticated using (can_select_book(book));

-- //////////////////////////////// game_object ////////////////////////////////
create policy "public read access" on public.game_object as permissive for
    select
    to authenticated using (true);

-- //////////////////////////////// member_role ////////////////////////////////
create policy "public read access" on public.member_role as permissive for
    select
    to authenticated using (true);

-- //////////////////////////////// team_member ////////////////////////////////
create function can_select_team_member(target team_member) returns boolean as
$$
begin
    -- TODO exclude site admins from this function
    -- only allow select if authenticated user is in a team with target actions
    return exists(select profile_id
                  from public.team_member
                  where team_id = target.team_id
                    and profile_id = auth.uid());
end;
$$ language plpgsql security definer;

create policy "public read access" on public.team_member as permissive for
    select
    to authenticated using (
    auth.uid() = team_member.profile_id
        or can_select_team_member(team_member)
    );

-- //////////////////////////////// player_slot ////////////////////////////////
-- Public read access for player_slot, only then, when the authenticated user
-- is a actions of that team or can see a book (thus has any exposed blueprint)
create policy "public read access" on public.player_slot as permissive for
    select
    to authenticated using (
    exists (select id
            from team_member
            where team_member.team_id = player_slot.team_id
              and profile_id = auth.uid())
        or exists (select id
                   from book
                   where book.team_id = player_slot.team_id)
    );

-- //////////////////////////////// member_to_player_slot ////////////////////////////////
create policy "public read access" on public.member_to_player_slot as permissive for
    select
    to authenticated using (
    exists (select 1
            from player_slot
            where id = member_to_player_slot.slot_id)
    );

-- //////////////////////////////// blueprint ////////////////////////////////
create function can_select_blueprint(target blueprint) returns boolean as
$$
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

create policy "read access" on public.blueprint as permissive for
    select
    to authenticated using (can_select_blueprint(blueprint));

-- //////////////////////////////// blueprint_stage ////////////////////////////////
create policy "read access"
    on public.blueprint_stage
    as permissive for select
    to authenticated
    using (exists(select 1
                  from public.blueprint
                  where id = blueprint_stage.blueprint_id));

-- //////////////////////////////// blueprint_object ////////////////////////////////
create function can_select_blueprint_object(obj blueprint_object) returns boolean as
$$
declare
    _blueprint record;
begin
    select public.blueprint.id
    from public.blueprint_stage
             inner join public.blueprint on blueprint_stage.blueprint_id = blueprint.id
    where blueprint_stage.id = obj.stage_id
    into _blueprint;

    if (_blueprint is null) then
        -- User cannot access blueprint, or it does not exist
        return false;
    end if;

    return true;
end;
$$ language plpgsql;

create policy "read access"
    on public.blueprint_object
    as permissive for select
    to authenticated
    using (can_select_blueprint_object(blueprint_object));

create function can_modify_blueprint_object(obj blueprint_object) returns boolean as
$$
declare
    _blueprint   record;
    _team_id     uuid;
    _self_member record;
begin
    select public.blueprint.id,
           public.blueprint.book_id
    from public.blueprint_stage
             inner join public.blueprint on blueprint_stage.blueprint_id = blueprint.id
    where blueprint_stage.id = obj.stage_id
    into _blueprint;

    if (_blueprint is null) then
        -- User cannot access blueprint, or it does not exist
        return false;
    end if;

    select team_id
    into _team_id
    from public.book
    where id = _blueprint.book_id;

    if (_team_id is null) then
        return false;
    end if;

    return exists(select 1
                  from public.full_team_member
                  where full_team_member.team_id = _team_id
                    and full_team_member.profile_id = auth.uid()
                    and full_team_member.flags & 2 != 0);
end;
$$ language plpgsql;

create policy "insert access"
    on public.blueprint_object
    as permissive for insert
    to authenticated
    with check (can_modify_blueprint_object(blueprint_object));

create policy "update access"
    on public.blueprint_object
    as permissive for update
    to authenticated
    using (true)
    with check (can_modify_blueprint_object(blueprint_object));

create policy "delete access"
    on public.blueprint_object
    as permissive for delete
    to authenticated
    using (can_modify_blueprint_object(blueprint_object));

-- //////////////////////////////// audit_log ////////////////////////////////
create function can_select_audit_log(entry audit_log) returns boolean as
$$
begin
    -- Check if the performer is the authenticated user itself
    if (entry.performer_id is not null and entry.performer_id = auth.uid()) then
        return true;
    end if;

    if (entry.team_id is null) then
        return false;
    end if;

    return exists(select 1
                  where full_team_member.team_id = entry.team_id
                    and full_team_member.profile_id = auth.uid()
                    and full_team_member.flags & 256 != 0);
end;
$$ language plpgsql security definer;

create policy "read access" on public.audit_log as permissive for
    select
    to authenticated using (can_select_audit_log(audit_log));

-- //////////////////////////////// config ////////////////////////////////
create policy "public read access" on public.config as permissive for
    select
    to authenticated using (true);
