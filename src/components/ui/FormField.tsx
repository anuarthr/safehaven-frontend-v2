import type { FieldError } from 'react-hook-form';
import { Form } from 'react-bootstrap';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

const FormField = ({ label, error, children }: FormFieldProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    {children}
    {error && <Form.Text className="text-danger">{error.message}</Form.Text>}
  </Form.Group>
);

export default FormField;
