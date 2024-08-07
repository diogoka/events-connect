/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = current_timestamp;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    pgm.addColumns('users', {
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.sql(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `);
};

exports.down = pgm => {
    pgm.sql(`
    DROP TRIGGER IF EXISTS update_timestamp ON users;
    DROP FUNCTION IF EXISTS update_updated_at_column;
  `);


    pgm.dropColumns('users', ['created_at', 'updated_at']);
};
