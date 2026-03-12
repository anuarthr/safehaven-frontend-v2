import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  usePacientes,
  useCreatePaciente,
  useUpdatePaciente,
  useDeletePaciente,
} from '../../hooks/usePacientes';
import { useRoles } from '../../hooks/useRoles';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormField from '../../components/ui/FormField';
import type { Paciente, RegistroPacienteDto, ActualizarPacienteDto } from '../../types';

// ── Schemas ──────────────────────────────────────────────────────────────────

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
  fechaDeRegistro: z.string().min(1, 'Requerido'),
  rol: z.number({ error: 'Seleccione un rol' }).min(1, 'Requerido'),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Modo = 'crear' | 'editar';

// ── Formulario ────────────────────────────────────────────────────────────────

interface PacienteFormProps {
  modo: Modo;
  valores?: Paciente;
  onSubmit: (data: RegistroPacienteDto | ActualizarPacienteDto) => void;
  cargando: boolean;
  onCancelar: () => void;
}

const PacienteForm = ({ modo, valores, onSubmit, cargando, onCancelar }: PacienteFormProps) => {
  const { data: roles } = useRoles();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores
      ? {
          ...valores,
          fechaDeRegistro: valores.fechaDeRegistro?.split('T')[0] ?? '',
          fechaDeNacimiento: valores.fechaDeNacimiento?.split('T')[0] ?? '',
        }
      : { estadoDeSalud: 'Saludable', fechaDeRegistro: new Date().toISOString().split('T')[0], rol: 4 },
  });

  const handleFormSubmit = (values: FormValues) => {
    if (modo === 'crear') {
      if (!values.password || values.password.length < 6) {
        setError('password', { type: 'manual', message: 'Mínimo 6 caracteres' });
        return;
      }
      const { password, ...rest } = values;
      onSubmit({ ...rest, password } as RegistroPacienteDto);
    } else {
      const { password: _pw, ...rest } = values;
      onSubmit(rest as ActualizarPacienteDto);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
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
      {modo === 'crear' && (
        <FormField label="Contraseña" error={errors.password}>
          <Form.Control
            type="password"
            placeholder="Mínimo 6 caracteres"
            isInvalid={!!errors.password}
            {...register('password')}
          />
        </FormField>
      )}
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
            <Form.Control type="date" isInvalid={!!errors.fechaDeNacimiento} {...register('fechaDeNacimiento')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Fecha de registro" error={errors.fechaDeRegistro}>
            <Form.Control type="date" isInvalid={!!errors.fechaDeRegistro} {...register('fechaDeRegistro')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormField label="Aseguradora" error={errors.aseguradora}>
            <Form.Control isInvalid={!!errors.aseguradora} {...register('aseguradora')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Estado de salud" error={errors.estadoDeSalud}>
            <Form.Control isInvalid={!!errors.estadoDeSalud} {...register('estadoDeSalud')} />
          </FormField>
        </Col>
      </Row>
      <FormField label="Rol" error={errors.rol}>
        <Form.Select isInvalid={!!errors.rol} {...register('rol', { valueAsNumber: true })}>
          <option value="">Seleccione un rol...</option>
          {roles?.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </Form.Select>
      </FormField>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancelar} disabled={cargando}>Cancelar</Button>
        <Button type="submit" variant="primary" disabled={cargando}>
          {cargando ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : 'Guardar'}
        </Button>
      </div>
    </Form>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────

const PacientesPage = () => {
  const { data: pacientes, isLoading, isError, error } = usePacientes();
  const { data: roles } = useRoles();
  const crear = useCreatePaciente();
  const actualizar = useUpdatePaciente();
  const eliminar = useDeletePaciente();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>('crear');
  const [seleccionado, setSeleccionado] = useState<Paciente | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (p: Paciente) => { setModo('editar'); setSeleccionado(p); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  const handleSubmit = (data: RegistroPacienteDto | ActualizarPacienteDto) => {
    if (modo === 'crear') {
      crear.mutate(data as RegistroPacienteDto, { onSuccess: cerrarModal });
    } else if (seleccionado) {
      actualizar.mutate({ id: seleccionado.id, data: data as ActualizarPacienteDto }, { onSuccess: cerrarModal });
    }
  };

  const handleEliminar = () => {
    if (idEliminar !== null) {
      eliminar.mutate(idEliminar, { onSuccess: () => setIdEliminar(null) });
    }
  };

  const rolNombre = (id: number) => roles?.find((r) => r.id === id)?.nombre ?? `Rol ${id}`;

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{(error as Error).message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Pacientes</h2>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus size={16} className="me-2" />
          Nuevo paciente
        </Button>
      </div>

      {!pacientes?.length ? (
        <EmptyState mensaje="No hay pacientes registrados." />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Aseguradora</th>
                <th>Estado de salud</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.correoElectronico}</td>
                  <td>{p.telefono}</td>
                  <td>{p.aseguradora}</td>
                  <td>{p.estadoDeSalud}</td>
                  <td>{rolNombre(p.rol)}</td>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => abrirEditar(p)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setIdEliminar(p.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal show={modalAbierto} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modo === 'crear' ? 'Nuevo paciente' : 'Editar paciente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PacienteForm
            modo={modo}
            valores={seleccionado ?? undefined}
            onSubmit={handleSubmit}
            cargando={crear.isPending || actualizar.isPending}
            onCancelar={cerrarModal}
          />
        </Modal.Body>
      </Modal>

      {/* Modal confirmación eliminar */}
      <ConfirmModal
        show={idEliminar !== null}
        mensaje={`¿Desea eliminar el paciente con ID ${idEliminar}?`}
        onConfirmar={handleEliminar}
        onCancelar={() => setIdEliminar(null)}
        cargando={eliminar.isPending}
      />
    </Container>
  );
};

export default PacientesPage;
