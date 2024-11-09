import express, { Router } from 'express';
import {
  createEvents,
  updateEvents,
  newAttendee,
  deleteAttendee,
  newReview,
  getReviews,
  getUpcomingEventsByOwner,
  searchEvents,
  getPastEvents,
  getEventById,
  getUpComingEvents,
  getUpcomingEventsByUserId,
  getPastEventsByUserId,
  getPastEventsOfMonth,
  getUpcomingMonthEvents,
  getAttendedEventsByUser,
  getPastEventsByOwner,
  getEventAttendees,
} from '../controllers/eventsControllers';

const eventsRouter: Router = express.Router();

// Prisma
eventsRouter.get('/past', getPastEvents);
eventsRouter.get('/past/month', getPastEventsOfMonth);

eventsRouter.get('/upcoming', getUpComingEvents);
eventsRouter.get('/upcoming/month', getUpcomingMonthEvents);

eventsRouter.get('/:id', getEventById);

eventsRouter.get('/upcoming/user/:id', getUpcomingEventsByUserId);
eventsRouter.get('/past/user/:id', getPastEventsByUserId);

eventsRouter.get('/attended/user/:id', getAttendedEventsByUser);

eventsRouter.post('/search/', searchEvents);

eventsRouter.post('/new', createEvents);
eventsRouter.get('/owner/:id', getUpcomingEventsByOwner);
eventsRouter.get('/owner/past/:id', getPastEventsByOwner);

eventsRouter.get('/attendee/:id', getEventAttendees);
eventsRouter.post('/attendee', newAttendee);
eventsRouter.delete('/attendee', deleteAttendee);

// Old

eventsRouter.put('/:id', updateEvents);

eventsRouter.post('/review/new', newReview);
eventsRouter.get('/reviews/:id', getReviews);

export default eventsRouter;
