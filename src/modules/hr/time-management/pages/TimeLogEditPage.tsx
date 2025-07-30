import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHrService } from '../../services/hrService';
import { title } from '@/modules/core/design-system/primitives';
import type { TimeLogResponse } from '../../api/models/TimeLog';
import TimeLogEditForm from '../forms/TimeLogEditForm';


const TimeLogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTimeLogById } = useHrService();
  const [timeLog, setTimeLog] = useState<TimeLogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTimeLogById(id)
      .then(setTimeLog)
      .catch(err => console.error(`Failed to fetch time log ${id}:`, err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading Time Log...</div>;
  }

  if (!timeLog) {
    return <div className="text-center p-10">Time Log not found.</div>;
  }

  return (
    <section>
      <h1 className={title({ class: 'mb-6' })}>Edit Time Log</h1>
      <TimeLogEditForm initialData={timeLog} />
    </section>
  );
};

export default TimeLogEditPage;