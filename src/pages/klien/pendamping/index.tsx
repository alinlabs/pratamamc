import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PendampingView from './view-pendamping';

interface PendampingProps {
  event: any;
  canEdit?: boolean;
}

export default function PendampingTab({ event, canEdit = true }: PendampingProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <PendampingView 
        event={event} 
        onEdit={canEdit ? () => navigate(`/${username}/pendamping/edit`) : undefined} 
      />
    </div>
  );
}
