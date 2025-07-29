import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/card';
import { DollarSign, Clock, CheckCircle2, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';

import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { useHrService } from '../../services/hrService';
import { title, subtitle } from '@/modules/core/design-system/primitives';

import type { EmployeeResponse } from '../../api/models/Employee';

interface ReportData {
  requiredHours: number;
  workedHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
}

const StatCard = ({ icon, label, value, colorClass = 'text-default-700' }: { icon: React.ReactNode, label: string, value: string, colorClass?: string }) => (
  <Card className="p-6 flex items-start gap-4">
    <div className="p-3 bg-default-100 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-default-500">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </Card>
);

const EmployeePayReportPage: React.FC = () => {
  const { getEmployees, getPayrolls, getTimeLogsByEmployee, getSalaryRatesByEmployee } = useHrService();

  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Please select an employee to view their pay report.');

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  useEffect(() => {
    if (!selectedEmployee) {
      setReportData(null);
      setMessage('Please select an employee to view their pay report.');
      return;
    }

    const calculateReport = async () => {
      setLoading(true);
      setReportData(null);
      setMessage('');

      try {
        const [payrolls, timeLogs, salaryRates] = await Promise.all([
          getPayrolls(),
          getTimeLogsByEmployee(selectedEmployee.id),
          getSalaryRatesByEmployee(selectedEmployee.id),
        ]);

        const latestPayroll = payrolls
          .filter(p => p.employee_id === selectedEmployee.id)
          .sort((a, b) => new Date(b.pay_period_end).getTime() - new Date(a.pay_period_end).getTime())[0];

        if (!latestPayroll) {
          setMessage('No payroll record found for this employee.');
          return;
        }

        const hourlyRate = salaryRates[0]?.hourly_rate;
        if (!hourlyRate) {
          setMessage('No salary rate found for this employee.');
          return;
        }

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const workedHours = timeLogs
          .filter(log => log.end_time && new Date(log.start_time).getMonth() === currentMonth && new Date(log.start_time).getFullYear() === currentYear)
          .reduce((acc, log) => {
            const start = new Date(log.start_time).getTime();
            const end = new Date(log.end_time!).getTime();
            return acc + (end - start) / (1000 * 60 * 60);
          }, 0);

        const requiredHours = latestPayroll.total_hours;
        const overtimeHours = Math.max(0, workedHours - requiredHours);
        const regularHours = workedHours - overtimeHours;

        const regularPay = regularHours * hourlyRate;
        const overtimePay = overtimeHours * hourlyRate;
        const totalPay = regularPay + overtimePay;

        setReportData({ requiredHours, workedHours, overtimeHours, regularPay, overtimePay, totalPay });
        
        if(workedHours >= requiredHours) {
            setMessage('Employee has met or exceeded the required hours for the month.');
        } else {
            setMessage('Employee has not yet met the required hours.');
        }

      } catch (err) {
        console.error("Failed to generate report:", err);
        setMessage('An error occurred while generating the report.');
      } finally {
        setLoading(false);
      }
    };

    calculateReport();
  }, [selectedEmployee]);

  const employeeLabel = (emp: EmployeeResponse) => `${emp.first_name} ${emp.last_name}`;

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className={title()}>Employee Pay Report</h1>
          <p className={subtitle({ class: 'mt-2' })}>View monthly payment details for an employee.</p>
        </div>
        <div className="w-full md:w-80">
          <CustomSelect
            items={employees}
            value={selectedEmployee}
            onChange={(val) => setSelectedEmployee(val as EmployeeResponse | null)}
            valueKey="id"
            labelKey="email"
            getDisplayValue={(item) => item ? employeeLabel(item) : 'Select an employee...'}
            placeholder="Search and select an employee..."
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}

      {!loading && message && !reportData && (
        <Card className="p-10 text-center text-default-500">
          <p>{message}</p>
        </Card>
      )}

      {!loading && reportData && (
        <div className="space-y-6">
          <Card className={`p-6 flex items-center gap-4 ${reportData.workedHours >= reportData.requiredHours ? 'bg-green-50 dark:bg-green-900/30' : 'bg-amber-50 dark:bg-amber-900/30'}`}>
            {reportData.workedHours >= reportData.requiredHours ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />}
            <p className={`font-medium ${reportData.workedHours >= reportData.requiredHours ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>{message}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<DollarSign/>} label="Total Payable Amount" value={`$${reportData.totalPay.toFixed(2)}`} colorClass="text-green-600"/>
            <StatCard icon={<Clock/>} label="Hours Worked (This Month)" value={`${reportData.workedHours.toFixed(2)} hrs`} />
            <StatCard icon={<Clock/>} label="Required Hours" value={`${reportData.requiredHours} hrs`} />
            <StatCard icon={<TrendingUp/>} label="Overtime Hours" value={`${reportData.overtimeHours.toFixed(2)} hrs`} colorClass="text-blue-600" />
          </div>
          
          {reportData.overtimeHours > 0 && (
             <Card className="p-6">
                <h3 className={title({ size: 'sm', class: 'mb-4' })}>Payment Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-default-500">Regular Pay</p><p className="font-semibold text-lg">${reportData.regularPay.toFixed(2)}</p></div>
                    <div><p className="text-sm text-default-500">Overtime Pay</p><p className="font-semibold text-lg text-blue-600">+ ${reportData.overtimePay.toFixed(2)}</p></div>
                    <div><p className="text-sm text-default-500">Total</p><p className="font-bold text-xl">${reportData.totalPay.toFixed(2)}</p></div>
                </div>
             </Card>
          )}
        </div>
      )}
    </section>
  );
};

export default EmployeePayReportPage;