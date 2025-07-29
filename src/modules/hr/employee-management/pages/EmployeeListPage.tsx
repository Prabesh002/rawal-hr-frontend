import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';

import { Table, type Column } from '@/modules/core/components/Ui/table';
import { title } from '@/modules/core/design-system/primitives';
import { useHrService } from '@/modules/hr/services/hrService';
import type { EmployeeResponse } from '@/modules/hr/api/models/Employee';
import { HR_PAGE_ROUTES } from '../../routes/hrRouteConstants';

const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const { getEmployees } = useHrService();
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const columns: Column<EmployeeResponse>[] = [
    { key: 'first_name', header: 'First Name', sortable: true },
    { key: 'last_name', header: 'Last Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'position', header: 'Position', sortable: true },
    { key: 'hire_date', header: 'Hire Date', sortable: true },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="light" onPress={() => navigate(`/hr/employees/${row.id}`)}>
            View
          </Button>
          <Button size="sm" onPress={() => navigate(`/hr/employees/${row.id}/edit`)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className={title()}>Employees</h1>
        <Button color="primary" onPress={() => navigate(HR_PAGE_ROUTES.EMPLOYEE_SETUP)}>
          Add New Employee
        </Button>
      </div>
      <Table
        data={employees}
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

export default EmployeeListPage;