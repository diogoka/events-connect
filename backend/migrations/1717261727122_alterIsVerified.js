/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn('users', 'isVerified', 'is_verified');
};

exports.down = pgm => { };
