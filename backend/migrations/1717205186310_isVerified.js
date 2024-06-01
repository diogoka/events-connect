/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', { is_verified: { type: 'boolean', notNull: true, default: false } });
};

exports.down = pgm => { };
