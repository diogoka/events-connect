/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('users', 'unique_student_id_user', {
        unique: 'student_id_user',
    });
};

exports.down = pgm => { pgm.dropConstraint('users', 'unique_student_id_user'); };
