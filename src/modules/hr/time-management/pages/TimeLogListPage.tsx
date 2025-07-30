import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';

import { Table, type Column } from '@/modules/core/components/Ui/table';
import { title } from '@/modules/core/design-system/primitives';
import { useHrService } from '@/modules/hr/services/hrService';
import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { calculateDuration } from '../utils/duration';
import useAppToasts from '@/modules/core/hooks/useAppToasts';

import type { TimeLogResponse } from '../../api/models/TimeLog';
import type { EmployeeResponse } from '../../api/models/Employee';

const TimeLogListPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTimeLogs, getTimeLogsByEmployee, getEmployees, deleteTimeLog } = useHrService();
  const { showToast } = useAppToasts();

  const [timeLogs, setTimeLogs] = useState<TimeLogResponse[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTimeLogs = useCallback(() => {
    setLoading(true);
    const promise = selectedEmployee ? getTimeLogsByEmployee(selectedEmployee.id) : getTimeLogs();
    promise
      .then(setTimeLogs)
      .catch(err => console.error("Failed to fetch time logs:", err))
      .finally(() => setLoading(false));
  }, [selectedEmployee]);

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  useEffect(() => {
    fetchTimeLogs();
  }, [fetchTimeLogs]);

  const handleDelete = async (logId: string) => {
    if (window.confirm('Are you sure you want to delete this time log?')) {
      try {
        await deleteTimeLog(logId);
        showToast({ title: 'Success', description: 'Time log deleted.', color: 'success' });
        fetchTimeLogs();
      } catch (error) {
        console.error("Failed to delete time log:", error);
      }
    }
  };

  const employeeMap = useMemo(() => {
    return new Map(employees.map(emp => [emp.id, `${emp.first_name} ${emp.last_name}`]));
  }, [employees]);

  const columns: Column<TimeLogResponse>[] = [
    {
      key: 'employee_id',
      header: 'Employee',
      sortable: true,
      render: (employeeId) => employeeMap.get(employeeId) || 'Unknown',
    },
    { key: 'start_time', header: 'Shift Start', sortable: true, render: (val) => new Date(val).toLocaleString() },
    { key: 'end_time', header: 'Shift End', sortable: true, render: (val) => val ? new Date(val).toLocaleString() : 'Active' },
    { key: 'id', header: 'Duration', render: (_, row) => calculateDuration(row.start_time, row.end_time) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="light" onPress={() => navigate(`/hr/time-logs/${row.id}`)}>View</Button>
          <Button size="sm" onPress={() => navigate(`/hr/time-logs/${row.id}/edit`)}>Edit</Button>
          <Button size="sm" color="danger" variant="light" onPress={() => handleDelete(row.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className={title()}>Employee Time Logs</h1>
        <div className="w-full md:w-72">
          <CustomSelect
            items={employees}
            value={selectedEmployee}
            onChange={(val) => setSelectedEmployee(val as EmployeeResponse | null)}
            valueKey="id"
            labelKey="first_name"
            getDisplayValue={(item) => item ? `${item.first_name} ${item.last_name}` : "Filter by employee..."}
            placeholder="Filter by employee..."
            clearable
          />
        </div>
      </div>
      <Table
        data={timeLogs}
        columns={columns}
        loading={loading}
        pagination
        searchable
        striped
        hoverable
      />
    </section>
  );
};

export default TimeLogListPage;