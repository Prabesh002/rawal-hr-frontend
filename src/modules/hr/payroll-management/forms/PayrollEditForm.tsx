import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { useHrService } from '../../services/hrService';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import type { PayrollResponse, PayrollUpdateRequest } from '../../api/models/Payroll';

interface PayrollEditFormProps {
  initialData: PayrollResponse;
}

const PayrollEditForm: React.FC<PayrollEditFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { updatePayroll } = useHrService();
  const { showToast } = useAppToasts();
  const [formData, setFormData] = useState<PayrollUpdateRequest>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      payment_date: initialData.payment_date || undefined,
      status: initialData.status,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updatePayroll(initialData.id, formData);
      showToast({
        title: 'Success',
        description: 'Payroll record updated successfully.',
        color: 'success',
      });
      navigate(`/hr/payrolls/${initialData.id}`);
    } catch (error) {
      console.error('Failed to update payroll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          variant="bordered"
          required
        />
        <Input
          name="payment_date"
          label="Payment Date"
          type="date"
          value={formData.payment_date || ''}
          onChange={handleChange}
          variant="bordered"
        />
        <div className="col-span-full mt-8 flex justify-end gap-4">
          <Button variant="bordered" onPress={() => navigate(`/hr/payrolls/${initialData.id}`)}>
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

export default PayrollEditForm;