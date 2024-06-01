import express, { Router } from 'express';
import {
  createEvents,
  getEvents,
  getEvent,
  getUserEvents,
  updateEvents,
  deleteEvents,
  newAttendee,
  deleteAttendee,
  newReview,
  getReviews,
  getEventsByOwner,
  getEventsByUser,
  searchEvents,
} from '../controllers/eventsControllers';

const eventsRouter: Router = express.Router();

eventsRouter.get('/user', getUserEvents);

eventsRouter.get('/user/:id', getEventsByUser);
eventsRouter.get('/owner/:id', getEventsByOwner);
eventsRouter.get('/search/', searchEvents);

eventsRouter.get('/', getEvents);
eventsRouter.get('/:id', getEvent);

eventsRouter.post('/new', createEvents);

eventsRouter.post('/attendee', newAttendee);
eventsRouter.delete('/attendee', deleteAttendee);

eventsRouter.put('/:id', updateEvents);

eventsRouter.delete('/:id', deleteEvents);

eventsRouter.post('/review/new', newReview);
eventsRouter.get('/reviews/:id', getReviews);

export default eventsRouter;
