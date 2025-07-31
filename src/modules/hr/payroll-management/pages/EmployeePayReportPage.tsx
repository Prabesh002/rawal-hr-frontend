import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@heroui/card';
import { DollarSign, Clock, CheckCircle2, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';

import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { useHrService } from '../../services/hrService';
import { title, subtitle } from '@/modules/core/design-system/primitives';

import type { EmployeeResponse } from '../../api/models/Employee';
import type { PayrollResponse } from '../../api/models/Payroll';
import type { TimeLogResponse } from '../../api/models/TimeLog';
import type { SalaryRateResponse } from '../../api/models/SalaryRate';

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
  
  const [allData, setAllData] = useState<{ payrolls: PayrollResponse[], timeLogs: TimeLogResponse[], salaryRates: SalaryRateResponse[] } | null>(null);
  const [dateOptions, setDateOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ value: string, label: string } | null>(null);
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Please select an employee to view their pay report.');

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  const calculateReport = useCallback((month: number, year: number) => {
    if (!allData) return;
    
    const { payrolls, timeLogs, salaryRates } = allData;

    const latestPayroll = payrolls[0];
    if (!latestPayroll) {
      setMessage('No payroll record found for this employee.');
      setReportData(null);
      return;
    }

    const hourlyRate = salaryRates[0]?.hourly_rate;
    if (!hourlyRate) {
      setMessage('No salary rate found for this employee.');
      setReportData(null);
      return;
    }

    const workedHours = timeLogs
      .filter(log => log.end_time && new Date(log.start_time).getMonth() === month && new Date(log.start_time).getFullYear() === year)
      .reduce((acc, log) => {
        const start = new Date(log.start_time).getTime();
        const end = new Date(log.end_time!).getTime();
        return acc + (end - start) / (1000 * 60 * 60);
      }, 0);

    const requiredHours = latestPayroll.total_hours;
    const overtimeHours = Math.max(0, workedHours - requiredHours);
    const regularHours = workedHours - overtimeHours;

    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalPay = regularPay + overtimePay;

    setReportData({ requiredHours, workedHours, overtimeHours, regularPay, overtimePay, totalPay });
    setMessage(workedHours >= requiredHours ? 'Employee has met or exceeded the required hours.' : 'Employee has not yet met the required hours.');
  }, [allData]);


  useEffect(() => {
    if (!selectedEmployee) {
      setReportData(null);
      setAllData(null);
      setDateOptions([]);
      setSelectedDate(null);
      setMessage('Please select an employee to view their pay report.');
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setReportData(null);
      setMessage('');
      
      try {
        const [payrolls, timeLogs, salaryRates] = await Promise.all([
          getPayrolls().then(p => p.filter(pr => pr.employee_id === selectedEmployee.id).sort((a,b) => new Date(b.pay_period_end).getTime() - new Date(a.pay_period_end).getTime())),
          getTimeLogsByEmployee(selectedEmployee.id),
          getSalaryRatesByEmployee(selectedEmployee.id),
        ]);
        
        setAllData({ payrolls, timeLogs, salaryRates });

        const uniqueMonths = [...new Set(timeLogs.map(log => `${new Date(log.start_time).getFullYear()}-${new Date(log.start_time).getMonth()}`))];
        const options = uniqueMonths.map(ym => {
            const [year, month] = ym.split('-');
            const date = new Date(Number(year), Number(month));
            return { value: ym, label: date.toLocaleString('default', { month: 'long', year: 'numeric' }) };
        }).sort((a,b) => new Date(b.value).getTime() - new Date(a.value).getTime());

        setDateOptions(options);
        if (options.length > 0) {
            setSelectedDate(options[0]);
        } else {
            setMessage('No time log data found for this employee to generate a report.');
        }

      } catch(err) {
        console.error("Failed to fetch data:", err);
        setMessage('An error occurred while fetching report data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [selectedEmployee]);

  useEffect(() => {
    if (selectedDate && allData) {
      const [year, month] = selectedDate.value.split('-').map(Number);
      calculateReport(month, year);
    }
  }, [selectedDate, allData, calculateReport]);
  
  const employeeLabel = (emp: EmployeeResponse) => `${emp.first_name} ${emp.last_name}`;

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className={title()}>Employee Pay Report</h1>
          <p className={subtitle({ class: 'mt-2' })}>View monthly payment details for an employee.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-60">
              <CustomSelect
                  items={dateOptions}
                  value={selectedDate}
                  onChange={(val) => setSelectedDate(val as { value: string, label: string } | null)}
                  valueKey="value"
                  labelKey="label"
                  placeholder="Select a month"
                  disabled={!selectedEmployee || dateOptions.length === 0}
              />
          </div>
          <div className="w-full md:w-60">
            <CustomSelect
              items={employees}
              value={selectedEmployee}
              onChange={(val) => setSelectedEmployee(val as EmployeeResponse | null)}
              valueKey="id"
              labelKey="email"
              getDisplayValue={(item: EmployeeResponse) => item ? employeeLabel(item) : 'Select an employee...'}
              placeholder="Search an employee..."
            />
          </div>
        </div>
      </div>

      {loading && ( <div className="flex justify-center items-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div> )}

      {!loading && message && !reportData && ( <Card className="p-10 text-center text-default-500"><p>{message}</p></Card> )}

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
                    <div><p className="text-sm text-default-500">Overtime Pay (1.5x)</p><p className="font-semibold text-lg text-blue-600">+ ${reportData.overtimePay.toFixed(2)}</p></div>
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