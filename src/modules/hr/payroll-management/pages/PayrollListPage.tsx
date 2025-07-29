import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';

import { Table, type Column } from '@/modules/core/components/Ui/table';
import { title } from '@/modules/core/design-system/primitives';
import { useHrService } from '@/modules/hr/services/hrService';
import type { PayrollResponse } from '@/modules/hr/api/models/Payroll';
import type { EmployeeResponse } from '@/modules/hr/api/models/Employee';
import { HR_PAGE_ROUTES } from '../../routes/hrRouteConstants';

const PayrollListPage: React.FC = () => {
  const navigate = useNavigate();
  const { getPayrolls, getEmployees } = useHrService();
  const [payrolls, setPayrolls] = useState<PayrollResponse[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [payrollData, employeeData] = await Promise.all([getPayrolls(), getEmployees()]);
        setPayrolls(payrollData);
        setEmployees(employeeData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const employeeMap = useMemo(() => {
    return new Map(employees.map(emp => [emp.id, `${emp.first_name} ${emp.last_name}`]));
  }, [employees]);

  const columns: Column<PayrollResponse>[] = [
    {
      key: 'employee_id',
      header: 'Employee',
      sortable: true,
      render: (employeeId) => employeeMap.get(employeeId) || 'Unknown Employee',
    },
    { key: 'pay_period_start', header: 'Period Start', sortable: true },
    { key: 'pay_period_end', header: 'Period End', sortable: true },
    { key: 'gross_pay', header: 'Gross Pay', sortable: true, render: (val) => `$${val.toFixed(2)}` },
    { key: 'net_pay', header: 'Net Pay', sortable: true, render: (val) => `$${val.toFixed(2)}` },
    { key: 'status', header: 'Status', sortable: true },
    {
      key: 'id',
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="light" onPress={() => navigate(`/hr/payrolls/${row.id}`)}>View</Button>
          <Button size="sm" onPress={() => navigate(`/hr/payrolls/${row.id}/edit`)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className={title()}>All Payrolls</h1>
        <Button color="primary" onPress={() => navigate(HR_PAGE_ROUTES.PAYROLL_CREATE)}>
          Create New Payroll
        </Button>
      </div>
      <Table
        data={payrolls}
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

export default PayrollListPage;