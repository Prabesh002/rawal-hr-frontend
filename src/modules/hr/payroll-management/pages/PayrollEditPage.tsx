import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHrService } from '../../services/hrService';
import type { PayrollResponse } from '../../api/models/Payroll';
import { title } from '@/modules/core/design-system/primitives';
import PayrollEditForm from '../forms/PayrollEditForm';

const PayrollEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPayrollById } = useHrService();
  const [payroll, setPayroll] = useState<PayrollResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        const data = await getPayrollById(id);
        setPayroll(data);
      } catch (error) {
        console.error(`Failed to fetch payroll ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!payroll) {
    return <div className="text-center p-10">Payroll not found.</div>;
  }

  return (
    <section>
      <h1 className={title({ class: 'mb-6' })}>Edit Payroll Record</h1>
      <PayrollEditForm initialData={payroll} />
    </section>
  );
};

export default PayrollEditPage;