/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {

    pgm.dropConstraint('attendees', 'attendees_id_user_fkey');
    pgm.addConstraint('attendees', 'attendees_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('events', 'events_id_owner_fkey');
    pgm.addConstraint('events', 'events_id_owner_fkey', {
        foreignKeys: {
            columns: 'id_owner',
            references: 'users(id_user)',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('reviews', 'reviews_id_user_fkey');
    pgm.addConstraint('reviews', 'reviews_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('users_courses', 'users_courses_id_user_fkey');
    pgm.addConstraint('users_courses', 'users_courses_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });
};

exports.down = (pgm) => {



    pgm.dropConstraint('attendees', 'attendees_id_user_fkey');
    pgm.addConstraint('attendees', 'attendees_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('events', 'events_id_user_fkey');
    pgm.addConstraint('events', 'events_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('reviews', 'reviews_id_user_fkey');
    pgm.addConstraint('reviews', 'reviews_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onDelete: 'CASCADE'
        }
    });


    pgm.dropConstraint('users_courses', 'users_courses_id_user_fkey');
    pgm.addConstraint('users_courses', 'users_courses_id_user_fkey', {
        foreignKeys: {
            columns: 'id_user',
            references: 'users(id_user)',
            onDelete: 'CASCADE'
        }
    });
};