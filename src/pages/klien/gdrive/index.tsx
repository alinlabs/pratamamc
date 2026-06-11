import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GDriveView from './view-gdrive';

interface GDriveProps {
  event: any;
  canEdit?: boolean;
}

export default function GDriveTab({ event, canEdit = true }: GDriveProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div>
      <GDriveView 
        url={event?.drive_url} 
        onEdit={canEdit ? () => navigate(`/${username}/gdrive/edit`) : undefined} 
      />
    </div>
  );
}
