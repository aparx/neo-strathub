-- noinspection SqlResolveForFile

-- noinspection SqlResolveForFile @ routine/"channel_name"

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

create policy "public read access"
    on public.team as permissive
    for select to authenticated using (true);

-- //////////////////////////////// book ////////////////////////////////

create or replace function can_select_book(book book)
    returns boolean as $$
begin
    -- only allow the book to be seen when the user is a member of the team or there
    -- is any publicly accessible blueprint within that book.

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

-- //////////////////////////////// game_object ////////////////////////////////

create policy "public read access"
    on public.game_object as permissive
    for select to authenticated using (true);

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

-- //////////////////////////////// team_player_slot ////////////////////////////////

-- Public read access for team_player_slot, only then, when the authenticated user
-- is a member of that team or can see a book (thus has any exposed blueprint)
create policy "public read access"
    on public.team_player_slot as permissive
    for select to authenticated
    using (exists(select id
                  from team_member
                  where team_member.team_id = team_player_slot.team_id
                    and profile_id = auth.uid())
    or exists(select id
              from book
              where book.team_id = team_player_slot.team_id));

-- //////////////////////////////// player_slot_assign ////////////////////////////////
create policy "public read access"
    on public.player_slot_assign as permissive
    for select to authenticated
    using (exists(select id
                  from team_player_slot
                  where id = player_slot_assign.slot_id));

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

create policy "read access"
    on public.blueprint as permissive
    for select to authenticated
    using (can_select_blueprint(blueprint));

-- //////////////////////////////// audit_log ////////////////////////////////

create or replace function can_select_audit_log(entry audit_log)
    returns boolean as $$
declare
    _member_flags bigint;
begin
    -- Check if the performer is the authenticated user itself
    if (entry.performer_id is not null and entry.performer_id = auth.uid()) then
        return true;
    end if;

    if (entry.team_id is not null) then
        -- Authenticated user must be a member of the team
        select public.team_member_role.flags
        into _member_flags
        from team_member
                 left join team_member_role on team_member_role.id = team_member.role_id
        where team_id = entry.team_id
          and profile_id = auth.uid();
        -- Check if user is member and their flags contains VIEW_AUDIT_LOG
        return _member_flags is not null and (_member_flags & 256) != 0;
    end if;

    return false;
end;
$$ language plpgsql security definer;

create policy "read access"
    on public.audit_log as permissive
    for select to authenticated
    using (can_select_audit_log(audit_log));

-- //////////////////////////////// config ////////////////////////////////

create policy "public read access"
    on public.config as permissive
    for select to authenticated using (true);
