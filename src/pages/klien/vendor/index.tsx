import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DaftarVendorView from './view-vendor';

interface DaftarVendorProps {
  clientId?: string;
  vendor: any[];
  timWO?: any[];
  canEdit?: boolean;
}

export default function DaftarVendor({ clientId, vendor, timWO, canEdit = true }: DaftarVendorProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  return (
    <div className="pb-20 md:pb-8">
      <DaftarVendorView vendor={vendor} timWO={timWO} onEdit={canEdit ? () => navigate(`/${username}/vendor/edit`) : undefined} />
    </div>
  );
}
