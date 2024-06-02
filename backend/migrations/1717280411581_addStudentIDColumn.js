/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', { student_id_user: { type: 'integer', notNull: true, default: '000000' } });
};

exports.down = pgm => { };
