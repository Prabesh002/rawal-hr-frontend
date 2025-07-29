import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';

import { useHrService } from '../../services/hrService';
import type { PayrollResponse } from '../../api/models/Payroll';
import type { EmployeeResponse } from '../../api/models/Employee';
import { title, subtitle } from '@/modules/core/design-system/primitives';

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-sm text-default-500">{label}</p>
    <p className="text-lg font-medium">{value ?? 'N/A'}</p>
  </div>
);

const PayrollViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPayrollById, getEmployeeById, getSalaryRatesByEmployee } = useHrService();
  
  const [payroll, setPayroll] = useState<PayrollResponse | null>(null);
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const payrollData = await getPayrollById(id);
        setPayroll(payrollData);
        
        const [employeeData, ratesData] = await Promise.all([
          getEmployeeById(payrollData.employee_id),
          getSalaryRatesByEmployee(payrollData.employee_id)
        ]);
        
        setEmployee(employeeData);
        const latestRate = ratesData[0]?.hourly_rate || null;
        setHourlyRate(latestRate);

      } catch (error) {
        console.error(`Failed to fetch payroll details for ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading Payroll Details...</div>;
  }

  if (!payroll || !employee) {
    return <div className="text-center p-10">Payroll or Employee data not found.</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className={title()}>{`Payroll for ${employee.first_name} ${employee.last_name}`}</h1>
          <p className={subtitle({ class: 'mt-2' })}>{`Pay Period: ${payroll.pay_period_start} to ${payroll.pay_period_end}`}</p>
        </div>
        <Button color="primary" onPress={() => navigate(`/hr/payrolls/${payroll.id}/edit`)}>
          Edit Payroll
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
            <h2 className={title({ size: 'sm', class: 'mb-6' })}>Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem label="Gross Pay" value={`$${payroll.gross_pay.toFixed(2)}`} />
                <DetailItem label="Deductions" value={`$${payroll.deductions.toFixed(2)}`} />
                <DetailItem label="Net Pay" value={`$${payroll.net_pay.toFixed(2)}`} />
                <DetailItem label="Status" value={payroll.status} />
                <DetailItem label="Total Hours" value={payroll.total_hours} />
                <DetailItem label="Payment Date" value={payroll.payment_date} />
            </div>
        </Card>
         <Card className="p-6">
            <h2 className={title({ size: 'sm', class: 'mb-6' })}>Employee Info</h2>
            <div className="space-y-4">
                <DetailItem label="Employee Name" value={`${employee.first_name} ${employee.last_name}`} />
                <DetailItem label="Position" value={employee.position} />
                <DetailItem label="Hourly Rate at time of Payroll" value={hourlyRate ? `$${hourlyRate.toFixed(2)}` : 'Not Found'} />
            </div>
         </Card>
      </div>
    </section>
  );
};

export default PayrollViewPage;