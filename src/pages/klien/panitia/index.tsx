import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DaftarPanitiaView from './view-panitia';
import DaftarVendorView from '../vendor/view-vendor';
import DaftarWOView from '../wo/view-wo';

interface PanitiaProps {
  clientId?: string;
  event: any;
  canEdit?: boolean;
}

export default function DaftarPanitia({ clientId, event, canEdit = true }: PanitiaProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-8">
      <div id="panitia-acara"><DaftarPanitiaView 
        event={event} 
        onEditPanitia={canEdit ? () => navigate(`/${username}/panitia/edit`) : undefined} 
      /></div>
      <div id="vendor"><DaftarVendorView vendor={Array.isArray(event?.vendor) ? event.vendor : (Array.isArray(event?.daftar_vendor) ? event.daftar_vendor : [])} timWO={Array.isArray(event?.wedding_organizer) ? event.wedding_organizer : (Array.isArray(event?.timWO) ? event.timWO : [])} onEdit={canEdit ? () => navigate(`/${username}/vendor/edit`) : undefined} /></div>
      <div id="tim-wo"><DaftarWOView timWO={Array.isArray(event?.wedding_organizer) ? event.wedding_organizer : (Array.isArray(event?.timWO) ? event.timWO : [])} onEdit={canEdit ? () => navigate(`/${username}/wo/edit`) : undefined} /></div>
    </div>
  );
}
