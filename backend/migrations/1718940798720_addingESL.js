/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        INSERT INTO courses (name_course, category_course)
            VALUES ('English as Second Language', 'ESL');`);

};

exports.down = pgm => { };
