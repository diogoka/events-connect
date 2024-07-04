/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    const tags = [
        { name_tag: 'Walking Tour' },
        { name_tag: 'Museum' },
        { name_tag: 'Bring money' },
        { name_tag: 'Suggested Activity' }
    ];

    for (const tag of tags) {
        await pgm.sql(`
            INSERT INTO tags (name_tag)
            VALUES ('${tag.name_tag}');
        `);
    }
};


exports.down = pgm => { };
