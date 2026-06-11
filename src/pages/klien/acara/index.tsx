import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SusunanAcaraView from "./view-acara";

interface SusunanAcaraProps {
  rundown: any[];
  clientName: string;
  canEdit?: boolean;
  clientId?: string;
}

export default function SusunanAcara({
  rundown: originalRundown,
  clientName,
  canEdit = true,
  clientId,
}: SusunanAcaraProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  const rundown = (originalRundown || []).map((item, index) => ({
    ...item,
    id: item.id || `acara-${index}`,
  }));

  return (
    <div>
      <SusunanAcaraView
        clientId={clientId}
        rundown={rundown}
        clientName={clientName}
        onEdit={canEdit ? () => navigate(`/${username}/acara/edit`) : undefined}
      />
    </div>
  );
}
