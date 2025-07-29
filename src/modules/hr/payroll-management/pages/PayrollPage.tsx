import React from 'react';
import { title, subtitle } from '@/modules/core/design-system/primitives';
import CreatePayrollForm from '../forms/CreatePayrollForm';


const PayrollPage: React.FC = () => {
  return (
    <section>
      <div className="text-left mb-10">
        <h1 className={title()}>Create Payroll</h1>
        <p className={subtitle({ class: 'mt-2' })}>
          Select an employee to generate a new payroll record.
        </p>
      </div>
      <CreatePayrollForm />
    </section>
  );
};

export default PayrollPage;