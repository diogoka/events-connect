/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.addConstraint('users', 'unique_email_user', {
        unique: 'email_user',
    });
};

exports.down = pgm => { pgm.dropConstraint('users', 'unique_email_user'); };
