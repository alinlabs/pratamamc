import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CatatanView from './view-catatan';

interface CatatanProps {
  notes: string | any[];
  canEdit?: boolean;
}

export default function Catatan({ notes, canEdit = true }: CatatanProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <CatatanView notes={ notes } onEdit={canEdit ? () => navigate(`/${username}/catatan/edit`) : undefined} />
    </div>
  );
}
