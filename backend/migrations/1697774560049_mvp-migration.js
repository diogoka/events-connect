/* eslint-disable camelcase */

exports.shorthands = undefined;

const tableNameUsersType = 'users_type';
const tableNameUsers = 'users';
const users_courses = 'users_courses';
const courses = 'courses';
const events = 'events';
const reviews = 'reviews';
const events_reviews = 'events_reviews';
const attendees = 'attendees';
const tags = 'tags';
const events_tags = 'events_tags';

exports.up = async (pgm) => {
  pgm.createTable(tableNameUsersType, {
    id_user_type: 'serial primary key',
    role_user: { type: 'varchar(100)', notNull: true },
  });

  pgm.createTable(tableNameUsers, {
    id_user: 'varchar(100) primary key',
    id_user_type: {
      type: 'integer',
      references: `${tableNameUsersType}(id_user_type)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    first_name_user: { type: 'varchar(500)', notNull: true },
    last_name_user: { type: 'varchar(500)', notNull: true },
    email_user: { type: 'varchar(500)', notNull: true },
    postal_code_user: { type: 'varchar(500)', notNull: false },
    phone_user: { type: 'varchar(500)', notNull: false },
    provider: { type: 'varchar(500)', notNull: false },
    avatar_url: { type: 'varchar(500)', notNull: false },
  });

  pgm.createTable(courses, {
    id_course: 'serial primary key',
    name_course: { type: 'varchar(500)', notNull: true },
    category_course: { type: 'varchar(500)', notNull: true },
  });

  pgm.createTable(users_courses, {
    id_user_course: 'serial primary key',
    id_user: {
      type: 'VARCHAR(100)',
      references: `${tableNameUsers}(id_user)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    id_course: {
      type: 'integer',
      references: `${courses}(id_course)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
  });

  pgm.createTable(events, {
    id_event: 'serial primary key',
    id_owner: {
      type: 'VARCHAR(100)',
      references: `${tableNameUsers}(id_user)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    name_event: { type: 'varchar(500)', notNull: true },
    description_event: { type: 'varchar(500)', notNull: true },
    date_event_start: { type: 'timestamp', notNull: true },
    date_event_end: { type: 'timestamp', notNull: true },
    location_event: { type: 'varchar(500)', notNull: true },
    capacity_event: { type: 'integer', notNull: true },
    price_event: { type: 'integer', notNull: true },
    image_url_event: { type: 'varchar(500)', notNull: false },
    category_event: { type: 'varchar(500)', notNull: true }
  });

  pgm.createTable(tags, {
    id_tag: 'serial primary key',
    name_tag: { type: 'varchar(500)', notNull: true },
  });

  pgm.createTable(events_tags, {
    id_event_tag: 'serial primary key',
    id_event: {
      type: 'integer',
      references: `${events}(id_event)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    id_tag: {
      type: 'integer',
      references: `${tags}(id_tag)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
  });

  pgm.createTable(reviews, {
    id_review: 'serial primary key',
    id_user: {
      type: 'VARCHAR(100)',
      references: `${tableNameUsers}(id_user)`,
      notNull: true
    },
    description_review: { type: 'varchar(500)', notNull: true },
    rating: { type: 'numeric(2,1)', notNull: true },
    date_review: { type: 'timestamp', notNull: true },
  });

  pgm.createTable(events_reviews, {
    id_event_review: 'serial primary key',
    id_event: {
      type: 'integer',
      references: `${events}(id_event)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    id_review: {
      type: 'integer',
      references: `${reviews}(id_review)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
  });

  pgm.createTable(attendees, {
    id_attendee: 'serial primary key',
    id_user: {
      type: 'VARCHAR(100)',
      references: `${tableNameUsers}(id_user)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
    id_event: {
      type: 'integer',
      references: `${events}(id_event)`,
      notNull: true,
      onDelete: 'CASCADE'
    },
  });

};

exports.down = async (pgm) => {
  pgm.dropTable(events_tags);
  pgm.dropTable(tags);
  pgm.dropTable(attendees);
  pgm.dropTable(events_reviews);
  pgm.dropTable(reviews);
  pgm.dropTable(events);
  pgm.dropTable(users_courses);
  pgm.dropTable(courses);
  pgm.dropTable(tableNameUsers);
  pgm.dropTable(tableNameUsersType);
};