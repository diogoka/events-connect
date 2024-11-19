/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumn('events', {
        isCanceled: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('events', 'isCanceled');
};