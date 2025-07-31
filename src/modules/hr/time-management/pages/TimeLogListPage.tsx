import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';

import { Table, type Column } from '@/modules/core/components/Ui/table';
import { DataFilter, type FilterConfig } from '@/modules/core/components/Ui/DataFilter';
import { title } from '@/modules/core/design-system/primitives';
import { useHrService } from '@/modules/hr/services/hrService';
import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { calculateCompletedDuration } from '../utils/duration';
import useAppToasts from '@/modules/core/hooks/useAppToasts';

import type { TimeLogResponse } from '../../api/models/TimeLog';
import type { EmployeeResponse } from '../../api/models/Employee';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

const timeLogFilterConfig: FilterConfig<TimeLogResponse>[] = [
  {
    key: 'month',
    label: 'Filter by Month',
    type: 'select',
    placeholder: 'All Months',
    options: months.map((m, i) => ({ value: String(i), label: m })),
    filterFn: (log, month) => new Date(log.start_time).getMonth() === parseInt(month, 10),
  },
  {
    key: 'dayOfWeek',
    label: 'Filter by Day of Week',
    type: 'select',
    placeholder: 'All Days',
    options: days.map((d, i) => ({ value: String(i), label: d })),
    filterFn: (log, day) => new Date(log.start_time).getDay() === parseInt(day, 10),
  }
];

const TimeLogListPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTimeLogsByEmployee, getEmployees, deleteTimeLog } = useHrService();
  const { showToast } = useAppToasts();
  const { isAdmin } = useAuth();

  const [allTimeLogs, setAllTimeLogs] = useState<TimeLogResponse[]>([]);
  const [filteredTimeLogs, setFilteredTimeLogs] = useState<TimeLogResponse[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTimeLogs = useCallback(() => {
    if (!selectedEmployee) return;
    setLoading(true);
    getTimeLogsByEmployee(selectedEmployee.id)
      .then(data => {
        setAllTimeLogs(data);
        const currentMonth = new Date().getMonth();
        const defaultFiltered = data.filter(log => new Date(log.start_time).getMonth() === currentMonth);
        setFilteredTimeLogs(defaultFiltered);
      })
      .catch(err => console.error("Failed to fetch time logs:", err))
      .finally(() => setLoading(false));
  }, [selectedEmployee]);

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchTimeLogs();
    } else {
      setAllTimeLogs([]);
      setFilteredTimeLogs([]);
    }
  }, [selectedEmployee, fetchTimeLogs]);

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
    { key: 'id', header: 'Duration', render: (_, row) => calculateCompletedDuration(row.start_time, row.end_time) },
    {
      key: 'id', // Changed from 'actions' to a valid key
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="light" onPress={() => navigate(`/hr/time-logs/${row.id}`)}>View</Button>
          {isAdmin && (
            <>
              <Button size="sm" onPress={() => navigate(`/hr/time-logs/${row.id}/edit`)}>Edit</Button>
             
            </>
          )}
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
            getDisplayValue={(item: EmployeeResponse) => item ? `${item.first_name} ${item.last_name}` : "Select an employee to view logs"}
            placeholder="Select an employee..."
          />
        </div>
      </div>
      
      {selectedEmployee && (
        <>
          <div className="mb-6">
            <DataFilter 
              data={allTimeLogs}
              filterConfig={timeLogFilterConfig}
              onFilterChange={setFilteredTimeLogs}
              initialFilters={{ month: String(new Date().getMonth()) }}
            />
          </div>
          <Table
            data={filteredTimeLogs}
            columns={columns}
            loading={loading}
            pagination
            searchable
            striped
            hoverable
          />
        </>
      )}
    </section>
  );
};

export default TimeLogListPage;