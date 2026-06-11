import React from 'react';
import RingkasanView from './view-ringkasan';
import { useNavigate, useParams } from 'react-router-dom';

export interface EventData {
  [key: string]: any;
}

interface RingkasanProps {
  event: EventData;
  canEdit?: boolean;
}

export default function Ringkasan({ event, canEdit }: RingkasanProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <RingkasanView event={event} onEdit={canEdit ? () => navigate(`/${username}/ringkasan/edit`) : undefined} />
    </div>
  );
}
