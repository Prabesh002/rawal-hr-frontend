import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';
import { Trash } from 'lucide-react';

import { useHrService } from '../../services/hrService';
import { title, subtitle } from '@/modules/core/design-system/primitives';
import { calculateCompletedDuration } from '../utils/duration';
import useAppToasts from '@/modules/core/hooks/useAppToasts';

import type { TimeLogResponse } from '../../api/models/TimeLog';
import type { EmployeeResponse } from '../../api/models/Employee';

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-sm text-default-500">{label}</p>
    <p className="text-lg font-medium">{value ?? 'N/A'}</p>
  </div>
);

const TimeLogViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppToasts();
  const { getTimeLogById, getEmployeeById, deleteTimeLog } = useHrService();
  
  const [timeLog, setTimeLog] = useState<TimeLogResponse | null>(null);
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const logData = await getTimeLogById(id);
        setTimeLog(logData);
        const employeeData = await getEmployeeById(logData.employee_id);
        setEmployee(employeeData);
      } catch (error) {
        console.error(`Failed to fetch details for time log ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to permanently delete this time log?')) return;
    try {
      await deleteTimeLog(id);
      showToast({ title: 'Deleted', description: 'Time log has been removed.', color: 'success' });
      navigate('/hr/time-logs');
    } catch(error) {
      console.error("Failed to delete time log:", error);
    }
  }

  if (loading) {
    return <div className="text-center p-10">Loading Time Log...</div>;
  }

  if (!timeLog || !employee) {
    return <div className="text-center p-10">Time Log data not found.</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className={title()}>{`Time Log for ${employee.first_name} ${employee.last_name}`}</h1>
          <p className={subtitle({ class: 'mt-2' })}>{`Log ID: ${timeLog.id}`}</p>
        </div>
        <Button color="danger" variant='bordered' startContent={<Trash size={16}/>} onPress={handleDelete}>
          Delete Log
        </Button>
      </div>
      <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <DetailItem label="Shift Start Time" value={new Date(timeLog.start_time).toLocaleString()} />
              <DetailItem label="Shift End Time" value={timeLog.end_time ? new Date(timeLog.end_time).toLocaleString() : 'Still Active'} />
              <DetailItem label="Total Duration" value={calculateCompletedDuration(timeLog.start_time, timeLog.end_time)} />
          </div>
      </Card>
    </section>
  );
};

export default TimeLogViewPage;