import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TamuView from './view-tamu';

export default function TamuTab({ event, canEdit = true }: { event: any; canEdit?: boolean; }) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <TamuView 
        event={event} 
        onEdit={canEdit ? () => navigate(`/${username}/tamu/edit`) : undefined} 
      />
    </div>
  );
}
