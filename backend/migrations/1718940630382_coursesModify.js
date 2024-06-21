/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        DELETE FROM courses WHERE category_course = 'ESL';
    `);
};

exports.down = pgm => { };
