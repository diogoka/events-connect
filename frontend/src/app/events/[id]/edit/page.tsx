'use client';
import { useState, useEffect, useContext } from 'react';
import { PageContext } from '@/context/pageContext';
import { EventContext, EventData, Tag } from '@/context/eventContext';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import axios from 'axios';
import EventsControl from '@/components/events/newEvents/eventsControl';

type Params = {
  params: {
    id: number;
  };
};

dayjs.extend(CustomParseFormat);

type SelectedEvent = {
  id_event: number;
  id_owner: string;
  name_event: string;
  description_event: string;
  date_event_start: string;
  date_event_end: string;
  image_url_event: string;
  location_event: string;
  capacity_event: number;
  price_event: number;
  category_event: string;
  tags: Array<Tag>;
};

type ReplaceDates = {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
};

export default function EditEventPage({ params }: Params) {
  const [editEvent, setEditEvent] = useState<SelectedEvent>();
  const { notFound } = useContext(PageContext);
  const { dispatch, setImage } = useContext(EventContext);

  const [eventId, setEventId] = useState<number>();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${params.id}`)
      .then((res) => {
        if (res.data.event.id_event) {
          setEditEvent(res.data.event);
          setEventId(res.data.event.id_event);
        } else {
          notFound();
        }
      })
      .catch((error) => {
        console.error(error);
        notFound();
      });
  }, [params.id]);

  useEffect(() => {
    if (editEvent) {
      const convertedStartDay = dayjs(
        editEvent?.date_event_start,
        'YYYY-MM-DD HH:mm:ss'
      );
      const convertedEndDay = dayjs(
        editEvent?.date_event_end,
        'YYYY-MM-DD HH:mm:ss'
      );
      const replaceDates: ReplaceDates[] = [];
      replaceDates.push({
        dateStart: convertedStartDay,
        dateEnd: convertedEndDay,
      });

      let dividedModality = null;
      const dividedSelectedTags = [];
      for (const tag of editEvent?.tags) {
        if (tag.id_tag === 16 || tag.id_tag === 17 || tag.id_tag === 18) {
          dividedModality = tag;
        } else {
          dividedSelectedTags.push(tag);
        }
      }

      const newObj: EventData = {
        name_event: editEvent?.name_event,
        description_event: editEvent?.description_event,
        dates: replaceDates,
        capacity_event: editEvent?.capacity_event,
        location_event: editEvent?.location_event,
        price_event: editEvent?.price_event,
        selectedTags: dividedSelectedTags,
        modality: dividedModality!,
        category_event: editEvent?.category_event,
        image_event: editEvent.image_url_event,
      };

      dispatch({
        type: 'GET_WHOLE_DATA',
        payload: newObj,
      });
    }
  }, [editEvent, dispatch]);

  return (
    <Stack>
      <EventsControl eventId={eventId!} />
    </Stack>
  );
}
