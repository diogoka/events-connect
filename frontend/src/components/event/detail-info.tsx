'use client';
import { useContext } from 'react';
import { UserContext, LoginStatus } from '@/context/userContext';
import { Table, TableBody, TableContainer } from '@mui/material';
import DetailInfoRow from './detail-info-row';
import { Attendee, Tag } from '@/types/types';
import AttendeesRow from './attendees/attendees-row';

type Props = {
  price: number;
  maxSpots: number;
  attendees: Attendee[];
  tags: Tag[];
  category: string;
  forMobile: boolean;
  forPreview: boolean;
};

export default function DetailInfo(props: Props) {
  const { loginStatus } = useContext(UserContext);

  let tagsString = '';

  props.tags.map((val: Tag, key: number) => {
    tagsString += key == 0 ? `${val.name_tag}` : `, ${val.name_tag}`;
  });

  return (
    <TableContainer style={{ width: props.forMobile ? '100%' : '70%' }}>
      <Table size='small'>
        <TableBody
          sx={{
            borderWidth: '1px 0px',
            borderColor: '#33333333',
            borderStyle: 'solid',
          }}
        >
          <DetailInfoRow
            title='Price'
            content={props.price === 0 ? 'Free' : `$ ${props.price.toString()}`}
          />
          <DetailInfoRow
            title='Available spots'
            content={
              props.maxSpots <= -1
                ? 'No limit'
                : props.maxSpots == 0
                ? 'No Spot Available'
                : props.maxSpots == 1
                ? `${props.maxSpots.toString()} person`
                : `${props.maxSpots.toString()} people`
            }
          />
          {!props.forPreview && loginStatus === LoginStatus.LoggedIn && (
            <DetailInfoRow
              title='Attendees'
              content={<AttendeesRow attendees={props.attendees} />}
            />
          )}
          <DetailInfoRow title='Tags' content={tagsString} />
          <DetailInfoRow title='Category' content={props.category} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
