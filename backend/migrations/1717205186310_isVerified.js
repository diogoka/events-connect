/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', { isVerified: { type: 'boolean', notNull: true, default: false } });
};

exports.down = pgm => { };
