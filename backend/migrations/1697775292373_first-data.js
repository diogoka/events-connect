/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  pgm.sql(`
        INSERT INTO users_type (role_user) VALUES ('organizer');
        INSERT INTO users_type (role_user) VALUES ('student');
        INSERT INTO users_type (role_user) VALUES ('admin');
    `);



  const courses = [
    { name_course: 'English Languages Courses 1.0', category_course: 'ESL' },
    { name_course: 'English Languages Courses 1.5', category_course: 'ESL' },
    { name_course: 'English Languages Courses 2.0', category_course: 'ESL' },
    { name_course: 'English Languages Courses 2.5', category_course: 'ESL' },
    { name_course: 'English Languages Courses 3.0', category_course: 'ESL' },
    { name_course: 'English Languages Courses 3.5', category_course: 'ESL' },
    { name_course: 'English Languages Courses 4.0', category_course: 'ESL' },
    { name_course: 'English Languages Courses 4.5', category_course: 'ESL' },
    { name_course: 'English Languages Courses 5.0', category_course: 'ESL' },
    { name_course: 'English Languages Courses 5.5', category_course: 'ESL' },
    { name_course: 'English Languages Courses 6.0', category_course: 'ESL' },
    {
      name_course: 'English Languages Courses Advance 1',
      category_course: 'ESL',
    },
    {
      name_course: 'English Languages Courses Advance 2',
      category_course: 'ESL',
    },
    { name_course: 'Web Application Development', category_course: 'Tech' },
    { name_course: 'Data Science', category_course: 'Tech' },
    { name_course: 'Network and System Solutions', category_course: 'Tech' },
    { name_course: 'UI/UX Design Specialist', category_course: 'Design' },
    {
      name_course: 'International Business Management',
      category_course: 'IBM',
    },
    {
      name_course: 'Digital Marketing Specialist',
      category_course: 'Digital Marketing',
    },
    {
      name_course: 'Advanced Digital Marketing',
      category_course: 'Digital Marketing',
    },
    {
      name_course: 'Customer Relations Specialist',
      category_course: 'Customer Relations',
    },
    { name_course: 'Hospitality Management', category_course: 'Hospitality' },
    { name_course: 'All', category_course: 'All' },
  ];

  for (const course of courses) {
    await pgm.sql(`
            INSERT INTO courses (name_course, category_course)
            VALUES ('${course.name_course}', '${course.category_course}');
        `);
  }

  const tags = [
    { name_tag: 'Workshop' },
    { name_tag: 'Sports' },
    { name_tag: 'Party' },
    { name_tag: 'Dinner' },
    { name_tag: 'Lunch' },
    { name_tag: 'Hike' },
    { name_tag: 'Others' },
    { name_tag: 'Bring your food' },
    { name_tag: 'Picnic' },
    { name_tag: 'Lesson' },
    { name_tag: 'Network' },
    { name_tag: 'Conversation' },
    { name_tag: 'Heritage Place' },
    { name_tag: 'Culture' },
    { name_tag: 'Music' },
    { name_tag: 'Online' },
    { name_tag: 'In Person' },
    { name_tag: 'Online and In Person' },
  ];

  for (const tag of tags) {
    await pgm.sql(`
            INSERT INTO tags (name_tag)
            VALUES ('${tag.name_tag}');
        `);
  }
};

exports.down = async (pgm) => {
  pgm.sql(`
        DELETE FROM events_tags;
        DELETE FROM tags;
        DELETE FROM events_reviews;
        DELETE FROM reviews;
        DELETE FROM attendees;
        DELETE FROM events;
        DELETE FROM users_courses;
        DELETE FROM courses;
        DELETE FROM users;
        DELETE FROM users_type;
    `);
};
