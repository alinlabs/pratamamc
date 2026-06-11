import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DaftarWOView from './view-wo';

interface WOProps {
  clientId?: string;
  timWO: any[];
  canEdit?: boolean;
}

export default function DaftarWO({ clientId, timWO, canEdit = true }: WOProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div className="pb-20 md:pb-8">
      <DaftarWOView timWO={timWO} onEdit={canEdit ? () => navigate(`/${username}/wo/edit`) : undefined} />
    </div>
  );
}
