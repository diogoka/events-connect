/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.alterColumn('users', 'student_id_user', {
        type: 'bigint',
        using: 'student_id_user::bigint'
    });

};

exports.down = pgm => {
    pgm.alterColumn('users', 'student_id_user', {
        type: 'integer',
        using: 'student_id_user::integer'
    });
};
