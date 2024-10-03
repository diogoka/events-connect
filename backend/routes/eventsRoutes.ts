import express, { Router } from 'express';
import {
  createEvents,
  updateEvents,
  deleteEvents,
  newAttendee,
  deleteAttendee,
  newReview,
  getReviews,
  getEventsByOwner,
  searchEvents,
  getPastEvents,
  getEventById,
  getUpComingEvents,
  getUpcomingEventsByUserId,
  getPastEventsByUserId,
  getPastEventsOfMonth,
  getUpcomingMonthEvents,
  getAttendedEventsByUser,
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

// Old
eventsRouter.get('/owner/:id', getEventsByOwner);
eventsRouter.get('/search/', searchEvents);

eventsRouter.post('/new', createEvents);

eventsRouter.post('/attendee', newAttendee);
eventsRouter.delete('/attendee', deleteAttendee);

eventsRouter.put('/:id', updateEvents);

eventsRouter.delete('/:id', deleteEvents);

eventsRouter.post('/review/new', newReview);
eventsRouter.get('/reviews/:id', getReviews);

export default eventsRouter;
