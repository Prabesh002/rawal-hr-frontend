import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { useHrService } from '../../services/hrService';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import type { TimeLogResponse, TimeLogUpdateRequest } from '../../api/models/TimeLog';

const toInputFormat = (isoString: string | null): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const TimeLogEditForm: React.FC<{ initialData: TimeLogResponse }> = ({ initialData }) => {
  const navigate = useNavigate();
  const { updateTimeLog } = useHrService();
  const { showToast } = useAppToasts();
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStartTime(toInputFormat(initialData.start_time));
    setEndTime(toInputFormat(initialData.end_time));
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: TimeLogUpdateRequest = {
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
    };
    
    try {
      await updateTimeLog(initialData.id, payload);
      showToast({ title: 'Success', description: 'Time log updated successfully.', color: 'success' });
      navigate(`/hr/time-logs/${initialData.id}`);
    } catch (error) {
      console.error("Failed to update time log:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Shift Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          variant="bordered"
          required
        />
        <Input
          label="Shift End Time (leave blank for active shift)"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          variant="bordered"
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="bordered" onPress={() => navigate(`/hr/time-logs`)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} color="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TimeLogEditForm;