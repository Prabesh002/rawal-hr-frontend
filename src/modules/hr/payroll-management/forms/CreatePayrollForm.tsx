import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Switch } from '@heroui/switch';
import { Loader2 } from 'lucide-react';

import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { useHrService } from '../../services/hrService';
import useAppToasts from '@/modules/core/hooks/useAppToasts';

import type { EmployeeResponse } from '../../api/models/Employee';
import type { SalaryRateResponse } from '../../api/models/SalaryRate';
import type { PayrollCreateRequest } from '../../api/models/Payroll';

const CreatePayrollForm: React.FC = () => {
  const { getEmployees, getSalaryRatesByEmployee, createSalaryRate, updateSalaryRate, createPayroll } = useHrService();
  const { showToast } = useAppToasts();

  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [currentRate, setCurrentRate] = useState<SalaryRateResponse | null>(null);
  
  const [loading, setLoading] = useState({ employees: true, rate: false, submitting: false });
  
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [hourlyRateInput, setHourlyRateInput] = useState('');
  const [payrollData, setPayrollData] = useState<Partial<PayrollCreateRequest>>({
    total_hours: 0,
    deductions: 0,
  });

  useEffect(() => {
    getEmployees().then(setEmployees).finally(() => setLoading(p => ({ ...p, employees: false })));
  }, []);

  useEffect(() => {
    if (!selectedEmployee) {
      setCurrentRate(null);
      setHourlyRateInput('');
      return;
    }

    setLoading(p => ({ ...p, rate: true }));
    getSalaryRatesByEmployee(selectedEmployee.id)
      .then(rates => {
        const latestRate = rates.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())[0] || null;
        setCurrentRate(latestRate);
        setHourlyRateInput(latestRate ? String(latestRate.hourly_rate) : '');
      })
      .finally(() => setLoading(p => ({ ...p, rate: false })));
      
  }, [selectedEmployee]);

  const handleRateInputBlur = async () => {
    if (!selectedEmployee || hourlyRateInput === (currentRate?.hourly_rate.toString() || '')) return;

    const newRateValue = parseFloat(hourlyRateInput);
    if (isNaN(newRateValue)) return;

    try {
      setLoading(p => ({ ...p, rate: true }));
      let updatedRate;
      if (currentRate) {
        updatedRate = await updateSalaryRate(currentRate.id, { hourly_rate: newRateValue });
        showToast({ title: 'Rate Updated', description: 'Salary rate has been updated.', color: 'success' });
      } else {
        updatedRate = await createSalaryRate({ 
          employee_id: selectedEmployee.id, 
          hourly_rate: newRateValue, 
          effective_date: new Date().toISOString().split('T')[0] 
        });
        showToast({ title: 'Rate Created', description: 'Salary Rate Was Saved For The Employee', color: 'success' });
      }
      setCurrentRate(updatedRate);
    } catch (error) {
      console.error("Failed to update/create salary rate", error);
    } finally {
      setLoading(p => ({ ...p, rate: false }));
    }
  };

  const calculatedGrossPay = useMemo(() => {
    const hours = Number(payrollData.total_hours) || 0;
    const rate = Number(hourlyRateInput) || 0;
    return (hours * rate).toFixed(2);
  }, [payrollData.total_hours, hourlyRateInput]);

  const handlePayrollDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayrollData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      showToast({ title: 'Error', description: 'Please select an employee.', color: 'danger' });
      return;
    }

    setLoading(p => ({ ...p, submitting: true }));

    const grossPay = isAutomatic ? parseFloat(calculatedGrossPay) : Number(payrollData.gross_pay) || 0;
    const netPay = grossPay - (Number(payrollData.deductions) || 0);

    const finalPayrollData: PayrollCreateRequest = {
      employee_id: selectedEmployee.id,
      pay_period_start: payrollData.pay_period_start!,
      pay_period_end: payrollData.pay_period_end!,
      total_hours: Number(payrollData.total_hours) || 0,
      gross_pay: grossPay,
      deductions: Number(payrollData.deductions) || 0,
      net_pay: netPay,
    };
    
    try {
      await createPayroll(finalPayrollData);
      showToast({ title: 'Success', description: 'Payroll record created successfully.', color: 'success' });
      setPayrollData({ total_hours: 0, deductions: 0 });
      setSelectedEmployee(null);
    } catch(error) {
      console.error("Failed to create payroll", error);
    } finally {
      setLoading(p => ({ ...p, submitting: false }));
    }
  }

  const employeeLabel = (emp: EmployeeResponse) => `${emp.first_name} ${emp.last_name}`;

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomSelect
          items={employees}
          value={selectedEmployee}
          onChange={(val) => setSelectedEmployee(val as EmployeeResponse | null)}
          valueKey="id"
          labelKey="email"
          getDisplayValue={(item: EmployeeResponse) => item ? employeeLabel(item) : 'Select an employee...'}
          searchable
          placeholder="Search and select an employee..."
          disabled={loading.employees}
        />
        {selectedEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
            <Input name="pay_period_start" label="Pay Period Start" type="date" required onChange={handlePayrollDataChange} variant="bordered"/>
            <Input name="pay_period_end" label="Pay Period End" type="date" required onChange={handlePayrollDataChange} variant="bordered"/>
            <Input name="total_hours" label="Total Hours" type="number" required value={String(payrollData.total_hours || '')} onChange={handlePayrollDataChange} variant="bordered"/>
            
            <div className="relative">
              <Input
                label="Hourly Rate ($)"
                type="number"
                value={hourlyRateInput}
                onChange={(e) => setHourlyRateInput(e.target.value)}
                onBlur={handleRateInputBlur}
                variant="bordered"
                step="0.01"
              />
              {loading.rate && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />}
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 text-sm">
                <Switch isSelected={isAutomatic} onValueChange={setIsAutomatic} />
                Automatic Pay
              </label>
            </div>
            
            <Input name="deductions" label="Deductions ($)" type="number" value={String(payrollData.deductions || '')} onChange={handlePayrollDataChange} variant="bordered"/>

            <Input
              name="gross_pay"
              label="Gross Pay ($)"
              type="number"
              value={isAutomatic ? calculatedGrossPay : String(payrollData.gross_pay || '')}
              onChange={handlePayrollDataChange}
              isDisabled={isAutomatic}
              variant="bordered"
              step="0.01"
            />
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button type="submit" color="primary" isLoading={loading.submitting} isDisabled={!selectedEmployee}>
            Create Payroll
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePayrollForm;