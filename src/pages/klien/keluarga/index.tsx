import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PengantinView from '../pengantin/view-pengantin';
import KeluargaView from './view-keluarga';
import PendampingView from '../pendamping/view-pendamping';
import TamuView from '../tamu/view-tamu';

interface KeluargaProps {
  event: any;
  canEdit?: boolean;
}

export default function KeluargaTab({ event, canEdit = true }: KeluargaProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-8">
      <div id="pengantin"><PengantinView event={event} onEdit={canEdit ? () => navigate(`/${username}/pengantin/edit`) : undefined} /></div>
      <div id="keluarga-inti"><KeluargaView event={event} onEdit={canEdit ? () => navigate(`/${username}/keluarga/edit`) : undefined} /></div>
      <div id="pendamping"><PendampingView event={event} onEdit={canEdit ? () => navigate(`/${username}/pendamping/edit`) : undefined} /></div>
      <div id="tamu-khusus"><TamuView event={event} onEdit={canEdit ? () => navigate(`/${username}/tamu/edit`) : undefined} /></div>
    </div>
  );
}
