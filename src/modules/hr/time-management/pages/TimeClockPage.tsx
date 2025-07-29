import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';
import { Loader2, PlayCircle, StopCircle, Clock } from 'lucide-react';

import { useHrService } from '../../services/hrService';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import { title, subtitle } from '@/modules/core/design-system/primitives';
import type { TimeLogResponse } from '../../api/models/TimeLog';

const formatElapsedTime = (startTime: string): string => {
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  const difference = Math.floor((now - start) / 1000);

  const hours = Math.floor(difference / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = difference % 60;

  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const TimeClockPage: React.FC = () => {
  const { getActiveShift, startShift, stopShift } = useHrService();
  const { showToast } = useAppToasts();

  const [activeShift, setActiveShift] = useState<TimeLogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeShift) {
      const timer = setInterval(() => {
        setElapsedTime(formatElapsedTime(activeShift.start_time));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeShift]);

  useEffect(() => {
    setLoading(true);
    getActiveShift()
      .then(setActiveShift)
      .catch(error => console.error("Failed to fetch active shift:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleStartShift = useCallback(async () => {
    setProcessing(true);
    try {
      const newShift = await startShift();
      setActiveShift(newShift);
      showToast({ title: 'Shift Started', description: 'You are now on the clock.', color: 'success' });
    } catch (error) {
      console.error("Failed to start shift:", error);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleStopShift = useCallback(async () => {
    if (!activeShift) return;
    setProcessing(true);
    try {
      await stopShift(activeShift.id);
      setActiveShift(null);
      setElapsedTime('');
      showToast({ title: 'Shift Stopped', description: 'You have been clocked out.', color: 'default' });
    } catch (error) {
      console.error("Failed to stop shift:", error);
    } finally {
      setProcessing(false);
    }
  }, [activeShift]);

  const renderStatus = () => {
    if (loading) {
      return <Loader2 className="h-10 w-10 animate-spin text-gray-400" />;
    }

    if (activeShift) {
      return (
        <>
          <p className="text-xl font-semibold text-green-500">Status: Clocked In</p>
          <div className="my-4 text-center">
            <p className="text-sm text-default-500">Shift Started At</p>
            <p className="text-2xl font-medium">{new Date(activeShift.start_time).toLocaleString()}</p>
          </div>
          <div className="my-6 text-center bg-default-100 dark:bg-default-200/50 p-4 rounded-xl">
            <p className="text-sm text-default-500 uppercase tracking-wider">Elapsed Time</p>
            <p className="text-5xl font-mono font-bold tracking-tighter">{elapsedTime}</p>
          </div>
          <Button fullWidth size="lg" color="danger" isLoading={processing} onPress={handleStopShift} startContent={<StopCircle />}>
            Stop Shift
          </Button>
        </>
      );
    }

    return (
      <>
        <p className="text-xl font-semibold text-default-600">Status: Clocked Out</p>
        <p className="my-4 text-default-500">You are not currently on the clock.</p>
        <Button fullWidth size="lg" color="success" isLoading={processing} onPress={handleStartShift} startContent={<PlayCircle />}>
          Start Shift
        </Button>
      </>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className={title()}>Time Clock</h1>
        <p className={subtitle({ class: 'mt-2' })}>Manage your work shifts here.</p>
      </div>
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-default-500" />
            <p className="text-xl font-medium text-default-700">{currentTime.toLocaleTimeString()}</p>
          </div>
          {renderStatus()}
        </div>
      </Card>
    </section>
  );
};

export default TimeClockPage;