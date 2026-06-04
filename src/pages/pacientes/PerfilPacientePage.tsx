import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Form, Row, Col, Badge, Card } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePaciente, useUpdatePaciente } from '../../hooks/usePacientes';
import { useAuth } from '../../contexts/authcontext';
import Spinner from '../../components/ui/Spinner';
import FormField from '../../components/ui/FormField';

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  correoElectronico: z.string().email('Correo inválido'),
  edad: z.number({ error: 'Debe ser un número' }).min(0, 'Edad inválida'),
  telefono: z.string().min(7, 'Teléfono inválido'),
  sexo: z.string().min(1, 'Requerido'),
  fechaDeNacimiento: z.string().min(1, 'Requerido'),
  aseguradora: z.string().min(1, 'Requerido'),
  estadoDeSalud: z.string().min(1, 'Requerido'),
});

type FormValues = z.infer<typeof schema>;

const toYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromYMD = (value?: string): Date | null => {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if ([y, m, d].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d);
};

const PerfilPacientePage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const id = usuario?.id ?? 0;
  const { data: paciente, isLoading, isError, error } = usePaciente(id);
  const actualizar = useUpdatePaciente();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (paciente) {
      reset({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        correoElectronico: paciente.correoElectronico,
        edad: paciente.edad ?? 0,
        telefono: paciente.telefono ?? '',
        sexo: paciente.sexo ?? '',
        fechaDeNacimiento: paciente.fechaDeNacimiento?.split('T')[0] ?? '',
        aseguradora: paciente.aseguradora ?? '',
        estadoDeSalud: paciente.estadoDeSalud ?? '',
      });
    }
  }, [paciente, reset]);

  const onSubmit = (values: FormValues) => {
    if (!paciente) return;
    actualizar.mutate({
      id: paciente.id,
      data: { ...values, rol: paciente.rol, fechaDeRegistro: paciente.fechaDeRegistro },
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{String(error instanceof Error ? error.message : error)}</div>;
  if (!paciente) return null;

  return (
    <Container className="py-4" style={{ maxWidth: 860 }}>
      <div className="position-relative mb-4" style={{ minHeight: 56 }}>
        <Button
          variant="outline-secondary"
          size="sm"
          className="position-absolute start-0 top-50 translate-middle-y w-auto float-none px-3"
          onClick={() => navigate('/dashboard')}
        >
          Volver
        </Button>

        <div className="d-flex justify-content-center">
          <Card className="border-0 shadow-sm" style={{ width: '100%', maxWidth: 520 }}>
            <Card.Body className="d-flex flex-column align-items-center text-center py-4">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2">
                <User size={32} className="text-primary" />
              </div>
              <h2 className="mb-1">{paciente.nombre} {paciente.apellido}</h2>
              <p className="text-muted mb-0 small">{paciente.correoElectronico}</p>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="mb-4 border-0 bg-light">
        <Card.Body className="py-3">
          <Row className="g-2 text-muted small">
            <Col xs="auto">
              <span className="fw-semibold">Registrado:</span>{' '}
              {paciente.fechaDeRegistro?.split('T')[0]}
            </Col>
            <Col xs="auto">
              <Badge bg="success">Paciente</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3">
          <h5 className="mb-0">Editar información personal</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row>
              <Col md={6}>
                <FormField label="Nombre" error={errors.nombre}>
                  <Form.Control isInvalid={!!errors.nombre} {...register('nombre')} />
                </FormField>
              </Col>
              <Col md={6}>
                <FormField label="Apellido" error={errors.apellido}>
                  <Form.Control isInvalid={!!errors.apellido} {...register('apellido')} />
                </FormField>
              </Col>
            </Row>

            <FormField label="Correo electrónico" error={errors.correoElectronico}>
              <Form.Control type="email" isInvalid={!!errors.correoElectronico} {...register('correoElectronico')} />
            </FormField>

            <Row>
              <Col md={4}>
                <FormField label="Edad" error={errors.edad}>
                  <Form.Control type="number" isInvalid={!!errors.edad} {...register('edad', { valueAsNumber: true })} />
                </FormField>
              </Col>
              <Col md={4}>
                <FormField label="Sexo" error={errors.sexo}>
                  <Form.Select isInvalid={!!errors.sexo} {...register('sexo')}>
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                </FormField>
              </Col>
              <Col md={4}>
                <FormField label="Teléfono" error={errors.telefono}>
                  <Form.Control isInvalid={!!errors.telefono} {...register('telefono')} />
                </FormField>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormField label="Fecha de nacimiento" error={errors.fechaDeNacimiento}>
                  <Controller
                    control={control}
                    name="fechaDeNacimiento"
                    render={({ field }) => (
                      <Calendar
                        value={fromYMD(field.value)}
                        onChange={(e) => {
                          const date = e.value instanceof Date ? e.value : null;
                          field.onChange(date ? toYMD(date) : '');
                        }}
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona fecha"
                        maxDate={new Date()}
                        className={errors.fechaDeNacimiento ? 'p-invalid w-100' : 'w-100'}
                        inputClassName="form-control"
                        showIcon
                        showButtonBar
                      />
                    )}
                  />
                </FormField>
              </Col>
              <Col md={6}>
                <FormField label="Aseguradora" error={errors.aseguradora}>
                  <Form.Control isInvalid={!!errors.aseguradora} {...register('aseguradora')} />
                </FormField>
              </Col>
            </Row>

            <FormField label="Estado de salud" error={errors.estadoDeSalud}>
              <Form.Control isInvalid={!!errors.estadoDeSalud} {...register('estadoDeSalud')} />
            </FormField>

            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary" disabled={actualizar.isPending}>
                {actualizar.isPending ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PerfilPacientePage;
