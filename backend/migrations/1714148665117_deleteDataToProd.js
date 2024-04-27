/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => { };

exports.down = pgm => {
    pgm.sql(`
        DELETE FROM events_tags;
        DELETE FROM events_reviews;
        DELETE FROM reviews;
        DELETE FROM attendees;
        DELETE FROM events;
    `);
};
