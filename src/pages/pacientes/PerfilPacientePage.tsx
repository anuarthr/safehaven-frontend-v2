import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Form, Row, Col, Badge, Card } from 'react-bootstrap';
import { User } from 'lucide-react';
import { usePaciente, useUpdatePaciente } from '../../hooks/usePacientes';
import { useAuth } from '../../contexts/authcontext';
import Spinner from '../../components/ui/Spinner';
import FormField from '../../components/ui/FormField';

// ── Schema ────────────────────────────────────────────────────────────────────

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

// ── Página ────────────────────────────────────────────────────────────────────

const PerfilPacientePage = () => {
  const { usuario } = useAuth();
  const id = usuario?.id ?? 0;
  const { data: paciente, isLoading, isError, error } = usePaciente(id);
  const actualizar = useUpdatePaciente();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Populate form once data loads
  useEffect(() => {
    if (paciente) {
      reset({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        correoElectronico: paciente.correoElectronico,
        edad: paciente.edad,
        telefono: paciente.telefono,
        sexo: paciente.sexo,
        fechaDeNacimiento: paciente.fechaDeNacimiento?.split('T')[0] ?? '',
        aseguradora: paciente.aseguradora,
        estadoDeSalud: paciente.estadoDeSalud,
      });
    }
  }, [paciente, reset]);

  const onSubmit = (values: FormValues) => {
    if (!paciente) return;
    actualizar.mutate({
      id: paciente.id,
      data: {
        ...values,
        fechaDeRegistro: paciente.fechaDeRegistro,
        rol: paciente.rol,
      },
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{(error as Error).message}</div>;
  if (!paciente) return null;

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-primary bg-opacity-10 rounded-circle p-3">
          <User size={32} className="text-primary" />
        </div>
        <div>
          <h2 className="mb-0">{paciente.nombre} {paciente.apellido}</h2>
          <p className="text-muted mb-0 small">{paciente.correoElectronico}</p>
        </div>
      </div>

      {/* Info de sólo lectura */}
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
              <Form.Control
                type="email"
                isInvalid={!!errors.correoElectronico}
                {...register('correoElectronico')}
              />
            </FormField>

            <Row>
              <Col md={4}>
                <FormField label="Edad" error={errors.edad}>
                  <Form.Control
                    type="number"
                    isInvalid={!!errors.edad}
                    {...register('edad', { valueAsNumber: true })}
                  />
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
                  <Form.Control
                    type="date"
                    isInvalid={!!errors.fechaDeNacimiento}
                    {...register('fechaDeNacimiento')}
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
