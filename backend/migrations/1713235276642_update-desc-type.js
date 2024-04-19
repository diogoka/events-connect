/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.alterColumn('events', 'description_event', { type: 'text' });

};

exports.down = pgm => {
    pgm.alterColumn('events', 'description_event', { type: 'varchar(500)' });
};



