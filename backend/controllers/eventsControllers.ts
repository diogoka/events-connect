import pool from '../db/db';
import express from 'express';
import { sendEmail } from '../helpers/mail';
import { Date, QueryEventsParamType } from '../types/types';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUpComingEvents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const queryParams: QueryEventsParamType = req.query as QueryEventsParamType;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.events.findMany({
      where: {
        date_event_start: {
          gte: today,
        },
      },
      orderBy: {
        date_event_start: 'asc',
      },
    });

    const start = parseInt(queryParams.start);
    const quantity = parseInt(queryParams.qnt);

    const slicedEvents = events.slice(start, quantity);

    res.status(200).json({
      events: slicedEvents.length === 0 ? events : slicedEvents,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getPastEvents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const queryParams: QueryEventsParamType = req.query as QueryEventsParamType;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.events.findMany({
      where: {
        date_event_start: {
          lt: today,
        },
      },
      orderBy: {
        date_event_start: 'desc',
      },
    });

    const start = parseInt(queryParams.start);
    const quantity = parseInt(queryParams.qnt);

    const slicedEvents = events.slice(start, start + quantity);

    res.status(200).json({
      events: slicedEvents.length === 0 ? events : slicedEvents,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getPastEventsOfMonth = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const month = req.query.month;
    const year = req.query.year;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(+year, +month - 1, 1);
    const endDate = new Date(+year, +month, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.events.findMany({
      where: {
        AND: [
          {
            date_event_end: {
              lt: today,
            },
          },
          {
            date_event_start: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      orderBy: {
        date_event_start: 'desc',
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching past events:', error);
    res.status(500).json({ error: 'Failed to fetch past events' });
  }
};

export const getUpcomingMonthEvents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const month = req.query.month;
    const year = req.query.year;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(+year, +month - 1, 1);
    const endDate = new Date(+year, +month, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.events.findMany({
      where: {
        AND: [
          {
            date_event_start: {
              gte: today,
            },
          },
          {
            date_event_start: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      orderBy: {
        date_event_start: 'asc',
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
};

export const getEventById = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;

  try {
    const event = await prisma.events.findUnique({
      where: {
        id_event: +id,
      },
      include: {
        attendees: {
          select: {
            users: {
              select: {
                first_name_user: true,
                last_name_user: true,
                avatar_url: true,
                id_user: true,
              },
            },
          },
        },
        events_tags: {
          select: {
            tags: {
              select: {
                name_tag: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ event });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getUpcomingEventsByUserId = async (
  req: express.Request,
  res: express.Response
) => {
  const queryParams: QueryEventsParamType = req.query as QueryEventsParamType;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const id = req.params.id;

  try {
    const data = await prisma.attendees.findMany({
      where: {
        id_user: id,
      },
      include: {
        events: true,
      },
    });

    const events = data.map((attendee) => attendee.events);

    const upcomingEvents = events.filter(
      (event) => event.date_event_start >= today
    );

    if (upcomingEvents.length > 6) {
      const start = parseInt(queryParams.start);
      const quantity = parseInt(queryParams.qnt);
      const slicedEvents = upcomingEvents.slice(start, quantity);
      res.status(200).json(slicedEvents);
    } else {
      res.status(200).json(upcomingEvents);
    }
  } catch (error: any) {
    res.status(505).json(error.message);
  }
};

export const getPastEventsByUserId = async (
  req: express.Request,
  res: express.Response
) => {
  const queryParams: QueryEventsParamType = req.query as QueryEventsParamType;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const id = req.params.id;

  try {
    const data = await prisma.attendees.findMany({
      where: {
        id_user: id,
      },
      include: {
        events: true,
      },
    });

    const events = data.map((attendee) => attendee.events);

    const pastEvents = events.filter(
      (event) => event.date_event_start <= today
    );

    if (pastEvents.length > 6) {
      const start = parseInt(queryParams.start);
      const quantity = parseInt(queryParams.qnt);
      const slicedEvents = pastEvents.slice(start, quantity);
      res.status(200).json(slicedEvents);
    } else {
      res.status(200).json(pastEvents);
    }
  } catch (error: any) {
    res.status(505).json(error.message);
  }
};

export const getAttendedEventsByUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const attendedEvents = await prisma.attendees.findMany({
      where: {
        id_user: id,
      },
      select: {
        id_event: true,
      },
    });

    return res.status(200).json(attendedEvents);
  } catch (error) {
    console.error('Error fetching user attended events:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch user attended events.' });
  }
};

export const searchEvents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { text, past } = req.query;
    const today = new Date();

    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Search text must be a string' });
    }

    const dateFilter =
      past === 'true'
        ? { date_event_end: { lt: today } }
        : { date_event_start: { gte: today } };

    const events = await prisma.events.findMany({
      where: {
        name_event: {
          contains: text,
          mode: 'insensitive',
        },
        ...dateFilter,
      },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error searching events:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while searching for events' });
  }
};

export const createEvents = async (
  req: express.Request,
  res: express.Response
) => {
  const {
    id_owner,
    name_event,
    description_event,
    date_event_start,
    date_event_end,
    capacity_event,
    location_event,
    price_event,
    tags,
    category_event,
    image_event,
  } = req.body;

  try {
    const createdEvent = await prisma.events.create({
      data: {
        id_owner: id_owner,
        name_event: name_event,
        description_event,
        date_event_start,
        date_event_end,
        capacity_event,
        location_event,
        price_event,
        category_event,
        image_url_event: image_event,
      },
    });

    if (tags && tags.length > 0) {
      const tagsToAdd = tags.map(
        (tag: { id_tag: number; name_tag: string }) => ({
          id_event: createdEvent.id_event,
          id_tag: tag.id_tag,
        })
      );

      await prisma.events_tags.createMany({
        data: tagsToAdd,
      });
    }
    res
      .status(201)
      .json({ message: 'Event created successfully', createdEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getUpcomingEventsByOwner = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const createdEvents = await prisma.events.findMany({
      where: {
        id_owner: id,
        AND: [
          {
            date_event_start: {
              gte: today,
            },
          },
        ],
      },
    });

    const attendingEvents = await prisma.attendees.findMany({
      where: { id_user: id },
      select: { events: true },
    });

    const attendingEventsArray = attendingEvents.map((item) => item.events);

    const upcomingAttendingEvents = attendingEventsArray.filter(
      (event) => event.date_event_start >= today
    );

    const events = [...createdEvents, ...upcomingAttendingEvents];

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the events' });
  }
};

export const getPastEventsByOwner = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const createdEvents = await prisma.events.findMany({
      where: {
        id_owner: id,
        AND: [
          {
            date_event_start: {
              lte: today,
            },
          },
        ],
      },
    });

    const attendingEvents = await prisma.attendees.findMany({
      where: { id_user: id },
      select: { events: true },
    });

    const attendingEventsArray = attendingEvents.map((item) => item.events);

    const upcomingAttendingEvents = attendingEventsArray.filter(
      (event) => event.date_event_start <= today
    );

    const events = [...createdEvents, ...upcomingAttendingEvents];

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the events' });
  }
};

export const newAttendee = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId, eventId } = req.body;
  try {
    const newAttendee = await prisma.attendees.create({
      data: {
        id_event: +eventId,
        id_user: userId,
      },
    });

    res.status(201).json(newAttendee);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteAttendee = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res
      .status(400)
      .json({ message: 'User ID and Event ID are required.' });
  }

  try {
    const deletedAttendee = await prisma.attendees.deleteMany({
      where: {
        id_user: userId,
        id_event: +eventId,
      },
    });

    if (deletedAttendee.count === 0) {
      return res.status(404).json({ message: 'Attendee not found.' });
    }

    return res.status(200).json(deleteAttendee);
  } catch (error) {
    console.error('Error deleting attendee:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getEventAttendees = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  try {
    const rawData = await prisma.attendees.findMany({
      where: { id_event: +id },
      select: {
        events: {
          select: {
            name_event: true,
            location_event: true,
            date_event_start: true,
          },
        },
        users: {
          select: {
            first_name_user: true,
            last_name_user: true,
            email_user: true,
            student_id_user: true,
            users_courses: {
              select: {
                courses: { select: { name_course: true } },
              },
            },
          },
        },
      },
    });

    if (rawData.length <= 0) {
      return res.status(200).json([]);
    }

    const event = rawData[0].events;
    const attendees: any = [];
    rawData.forEach((item) => {
      const course = item.users.users_courses[0].courses.name_course;
      const studentId = item.users.student_id_user.toString();
      const attendee = {
        ...item.users,
        users_courses: course,
        student_id_user: studentId,
      };
      attendees.push(attendee);
    });

    return res.status(200).json({ event: event, attendees: [...attendees] });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

export const newReview = async (
  req: express.Request,
  res: express.Response
) => {
  const { id_event, id_user, review } = req.body;

  try {
    const newReview = await prisma.reviews.create({
      data: {
        id_user: id_user,
        description_review: review.description,
        rating: review.rating,
        date_review: review.date_review,
      },
    });

    await prisma.events_reviews.create({
      data: {
        id_event: id_event,
        id_review: newReview.id_review,
      },
    });

    return res.status(201).json({
      message: 'Review created successfully!',
      review: newReview,
    });
  } catch (error: any) {
    console.error('Error creating review:', error);

    return res.status(500).json({
      message: 'An error occurred while creating the review.',
      error: error.message,
    });
  }
};

// Legacy Controllers

export const updateEvents = async (
  req: express.Request,
  res: express.Response
) => {
  const id = parseInt(req.params.id);

  const {
    title,
    description,
    dates,
    location,
    spots,
    price,
    image,
    tagId,
    category,
    imageURL,
  } = req.body;

  if (!id) {
    res.status(404).send('Update events failed');
  } else {
    try {
      const numberOfAttendees = await pool.query(
        `SELECT COUNT(*) FROM attendees WHERE id_event = $1`,
        [id]
      );

      const updatedSpots = (spots: number) => {
        const count = parseInt(numberOfAttendees.rows[0].count);
        return spots - count;
      };

      dates.forEach(async (date: Date) => {
        const events = await pool.query(
          `UPDATE events SET name_event = $1, description_event = $2, date_event_start = $3, date_event_end = $4, location_event = $5, capacity_event = $6, price_event = $7, category_event = $8, image_url_event = $9 WHERE id_event = $10 RETURNING *`,
          [
            title,
            description,
            date.dateStart,
            date.dateEnd,
            location,
            updatedSpots(spots),
            price,
            category,
            imageURL,
            id,
          ]
        );

        await pool.query(`DELETE FROM events_tags WHERE id_event = $1`, [id]);
        tagId.forEach(async (tag: number) => {
          await pool.query(
            `INSERT INTO events_tags (id_event, id_tag) VALUES ($1, $2) RETURNING *;`,
            [id, tag]
          );
        });
      });

      res.status(200).json({});
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }
};

export const getReviews = async (
  req: express.Request,
  res: express.Response
) => {
  const event_id = req.params.id;
  try {
    const reviews = await pool.query(
      `
    SELECT
      u.first_name_user,
      u.last_name_user,
      u.avatar_url,
      u.id_user,
      r.description_review,
      r.rating,
      r.date_review,
      r.id_review
    FROM
      events_reviews er
    JOIN
      reviews r ON er.id_review = r.id_review
    JOIN
      users u ON r.id_user = u.id_user
    WHERE
      er.id_event = $1;`,
      [event_id]
    );

    res.status(200).json({
      reviews: reviews.rows,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const sendTicket = async (eventId: any, userId: any) => {
  try {
    const eventResult = await pool.query(
      `
    SELECT
      *
    FROM
      events
    WHERE
      id_event = $1
    `,
      [eventId]
    );
    const event = eventResult.rows[0];

    const userResult = await pool.query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        id_user = $1
      `,
      [userId]
    );
    const user = userResult.rows[0];

    await sendEmail({
      to: [user.email_user],
      subject: `
        Your Ticket for ${event.name_event}
      `,
      text: `
        Hi, ${user.first_name_user}. Thank you for joining our event.
        This is your ticket.
        Event Name: ${event.name_event}
        Date: ${event.date_event_start.toDateString()}
        Place: ${event.location_event}
      `,
    });
  } catch (err: any) {
    console.error(err);
  }
};
