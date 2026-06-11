import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PengantinView from './view-pengantin';

interface PengantinProps {
  event: any;
  canEdit?: boolean;
}

export default function PengantinTab({ event, canEdit = true }: PengantinProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <PengantinView event={event} onEdit={canEdit ? () => navigate(`/${username}/pengantin/edit`) : undefined} />
    </div>
  );
}
