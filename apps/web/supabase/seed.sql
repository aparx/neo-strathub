INSERT INTO game (name, alias)
VALUES ('Primary Game', 'PG'),
       ('Secondary Game', 'SG');

-- Insert sample plans
INSERT INTO public.plan (name, pricing, pricing_interval, is_default)
VALUES ('essential', 0, null, true),
       ('advanced', 9.95, 'monthly'::public.pay_interval, false),
       ('professional', 25.95, 'monthly'::public.pay_interval, false);

DO $$
    DECLARE
        _game       record;
        _plan       record;
        _team       record;
        _book       record;
        _arena      record;
        _visibility public.bp_visibility;
    BEGIN
        -- Insert sample arenas
        FOR _game IN (SELECT id FROM game) LOOP
            INSERT INTO arena (game_id, name)
            VALUES (_game.id, 'At vero eos et'),
                   (_game.id, 'Dolore magna aliquyam'),
                   (_game.id, 'Sed diam nonumy'),
                   (_game.id, 'Diam nonumy');
        END LOOP;

        -- Insert sample teams
        FOR _plan IN (SELECT id, name FROM plan) LOOP
            INSERT INTO team (name, plan_id)
            VALUES ('Team ' || _plan.name, _plan.id);
        END LOOP;

        -- Insert sample books
        FOR _team IN (SELECT id FROM team) LOOP
            FOR _game IN (SELECT id, name FROM game) LOOP
                INSERT INTO book (name, team_id, game_id)
                VALUES ('Pretium ' || _game.name, _team.id, _game.id),
                       ('Lectus ' || _game.name, _team.id, _game.id),
                       ('Quam ' || _game.name, _team.id, _game.id),
                       ('Id leo ' || _game.name, _team.id, _game.id);
            END LOOP;
        END LOOP;

        -- Insert sample blueprints
        FOR _book IN (SELECT id FROM book) LOOP
            FOR _arena IN (SELECT id FROM arena) LOOP
                FOREACH _visibility IN ARRAY (SELECT enum_range(NULL::public.bp_visibility)) LOOP
                    INSERT INTO blueprint (name, book_id, arena_id, visibility)
                    VALUES ('Massa ' || _visibility, _book.id, _arena.id, _visibility),
                           ('Nec ' || _visibility, _book.id, _arena.id, _visibility),
                           ('Vitae ' || _visibility, _book.id, _arena.id, _visibility);
                END LOOP;
            END LOOP;
        END LOOP;
    END;
$$