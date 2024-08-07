/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = current_timestamp AT TIME ZONE 'America/Vancouver';
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    pgm.alterColumn('users', 'created_at', {
        type: 'timestamp with time zone',
        default: pgm.func('current_timestamp AT TIME ZONE \'America/Vancouver\''),
    });

    pgm.alterColumn('users', 'updated_at', {
        type: 'timestamp with time zone',
        default: pgm.func('current_timestamp AT TIME ZONE \'America/Vancouver\''),
    });

    pgm.sql(`
    UPDATE users
    SET 
      created_at = created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver',
      updated_at = updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Vancouver';
  `);



};

exports.down = pgm => {
    pgm.alterColumn('users', 'created_at', {
        type: 'timestamp without time zone',
        default: pgm.func('current_timestamp'),
    });

    pgm.alterColumn('users', 'updated_at', {
        type: 'timestamp without time zone',
        default: pgm.func('current_timestamp'),
    });

    pgm.sql(`
    UPDATE users
    SET 
      created_at = created_at AT TIME ZONE 'America/Vancouver' AT TIME ZONE 'UTC',
      updated_at = updated_at AT TIME ZONE 'America/Vancouver' AT TIME ZONE 'UTC';
  `);

    pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = current_timestamp;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
};
