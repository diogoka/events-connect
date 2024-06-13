/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.renameColumn('users', 'isVerified', 'is_verified_user');
};

exports.down = pgm => { };
