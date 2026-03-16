import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col, Card } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';
import {
  usePsicologos,
  useCreatePsicologo,
  useUpdatePsicologo,
  useDeletePsicologo,
} from '../../hooks/usePsicologos';
import { useRoles } from '../../hooks/useRoles';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormField from '../../components/ui/FormField';
import type { Psicologo, RegistroPsicologoDto, ActualizarPsicologoDto } from '../../types';

// ── Schemas ──────────────────────────────────────────────────────────────────

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  correoElectronico: z.string().email('Correo inválido'),
  password: z.string().optional(),
  edad: z.number({ error: 'Debe ser un número' }).min(0),
  telefono: z.string().min(7),
  sexo: z.string().min(1, 'Requerido'),
  fechaDeNacimiento: z.string().min(1, 'Requerido'),
  especialidad: z.string().min(1, 'Requerido'),
  anosDeExperiencia: z.number({ error: 'Debe ser un número' }).min(0),
  horarioDeAtencion: z.string().min(1, 'Requerido'),
});

type FormValues = z.infer<typeof schema>;
type Modo = 'crear' | 'editar';

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

// ── Formulario ────────────────────────────────────────────────────────────────

interface PsicologoFormProps {
  modo: Modo;
  valores?: Psicologo;
  onSubmit: (data: RegistroPsicologoDto | ActualizarPsicologoDto) => void;
  cargando: boolean;
  onCancelar: () => void;
}

const PsicologoForm = ({ modo, valores, onSubmit, cargando, onCancelar }: PsicologoFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores
      ? { ...valores, fechaDeNacimiento: valores.fechaDeNacimiento?.split('T')[0] ?? '' }
      : undefined,
  });

  const handleFormSubmit = (values: FormValues) => {
    if (modo === 'crear') {
      if (!values.password || values.password.length < 6) {
        setError('password', { type: 'manual', message: 'Mínimo 6 caracteres' });
        return;
      }
      const { password, ...rest } = values;
      onSubmit({ ...rest, rol: 2, password } as RegistroPsicologoDto);
    } else {
      const { password: _pw, ...rest } = values;
      onSubmit({ ...rest, rol: valores?.rol ?? 2 } as ActualizarPsicologoDto);
    }
  };

  const e = errors;

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Row>
        <Col md={6}>
          <FormField label="Nombre" error={e.nombre}>
            <Form.Control isInvalid={!!e.nombre} {...register('nombre')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Apellido" error={e.apellido}>
            <Form.Control isInvalid={!!e.apellido} {...register('apellido')} />
          </FormField>
        </Col>
      </Row>
      <FormField label="Correo electrónico" error={e.correoElectronico}>
        <Form.Control type="email" isInvalid={!!e.correoElectronico} {...register('correoElectronico')} />
      </FormField>
      {modo === 'crear' && (
        <FormField label="Contraseña" error={e.password}>
          <Form.Control
            type="password"
            placeholder="Mínimo 6 caracteres"
            isInvalid={!!e.password}
            {...register('password')}
          />
        </FormField>
      )}
      <Row>
        <Col md={4}>
          <FormField label="Edad" error={e.edad}>
            <Form.Control type="number" isInvalid={!!e.edad} {...register('edad', { valueAsNumber: true })} />
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Sexo" error={e.sexo}>
            <Form.Select isInvalid={!!e.sexo} {...register('sexo')}>
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </Form.Select>
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Teléfono" error={e.telefono}>
            <Form.Control isInvalid={!!e.telefono} {...register('telefono')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormField label="Fecha de nacimiento" error={e.fechaDeNacimiento}>
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
                  className={e.fechaDeNacimiento ? 'p-invalid w-100' : 'w-100'}
                  inputClassName="form-control"
                  showIcon
                  showButtonBar
                />
              )}
            />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Especialidad" error={e.especialidad}>
            <Form.Control isInvalid={!!e.especialidad} {...register('especialidad')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormField label="Años de experiencia" error={e.anosDeExperiencia}>
            <Form.Control type="number" isInvalid={!!e.anosDeExperiencia} {...register('anosDeExperiencia', { valueAsNumber: true })} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Horario de atención" error={e.horarioDeAtencion}>
            <Form.Control placeholder="Ej: Lunes - Viernes 8am-5pm" isInvalid={!!e.horarioDeAtencion} {...register('horarioDeAtencion')} />
          </FormField>
        </Col>
      </Row>
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

const PsicologosPage = () => {
  const navigate = useNavigate();
  const { data: psicologos, isLoading, isError, error } = usePsicologos();
  const { data: roles } = useRoles();
  const { usuario } = useAuth();
  const nombreRolUsuario = roles
    ?.find((r) => r.id === usuario?.rol)
    ?.nombre?.toLowerCase();
  const esAdministrador = (nombreRolUsuario?.includes('admin') ?? false) || usuario?.rol === 1;
  const rutaVolver = usuario?.rol === 4 ? '/dashboard' : '/dashboard-psicologo';

  const crear = useCreatePsicologo();
  const actualizar = useUpdatePsicologo();
  const eliminar = useDeletePsicologo();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>('crear');
  const [seleccionado, setSeleccionado] = useState<Psicologo | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (p: Psicologo) => { setModo('editar'); setSeleccionado(p); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  const handleSubmit = (data: RegistroPsicologoDto | ActualizarPsicologoDto) => {
    if (modo === 'crear') {
      crear.mutate(data as RegistroPsicologoDto, { onSuccess: cerrarModal });
    } else if (seleccionado) {
      actualizar.mutate({ id: seleccionado.id, data: data as ActualizarPsicologoDto }, { onSuccess: cerrarModal });
    }
  };

  const handleEliminar = () => {
    if (idEliminar !== null) {
      eliminar.mutate(idEliminar, { onSuccess: () => setIdEliminar(null) });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{(error as Error).message}</div>;

  return (
    <Container className="py-4">
      <Row className="align-items-center g-2 mb-4">
        <Col xs={12} md={4} className="d-flex justify-content-start">
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-auto float-none px-3"
            onClick={() => navigate(rutaVolver)}
          >
            Volver
          </Button>
        </Col>

        <Col xs={12} md={4} className="text-center">
          <h2 className="mb-0">Psicólogos</h2>
        </Col>

        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
          {esAdministrador && (
            <Button variant="primary" className="w-auto float-none" onClick={abrirCrear}>
              <Plus size={16} className="me-2" />
              Nuevo psicólogo
            </Button>
          )}
        </Col>
      </Row>

      {!psicologos?.length ? (
        <EmptyState mensaje="No hay psicólogos registrados." />
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0 align-middle">
                <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Especialidad</th>
                <th>Experiencia</th>
                <th>Horario</th>
                {esAdministrador && <th>Acciones</th>}
              </tr>
                </thead>
                <tbody>
              {psicologos.map((p) => (
                <tr key={p.id}>
                  <td className="fw-semibold">#{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.correoElectronico}</td>
                  <td>{p.especialidad}</td>
                  <td>{p.anosDeExperiencia} años</td>
                  <td>{p.horarioDeAtencion}</td>
                  {esAdministrador && (
                    <td>
                      <Button variant="outline-warning" size="sm" className="me-2" onClick={() => abrirEditar(p)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => setIdEliminar(p.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {esAdministrador && (
        <>
          <Modal show={modalAbierto} onHide={cerrarModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{modo === 'crear' ? 'Nuevo psicólogo' : 'Editar psicólogo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PsicologoForm
                modo={modo}
                valores={seleccionado ?? undefined}
                onSubmit={handleSubmit}
                cargando={crear.isPending || actualizar.isPending}
                onCancelar={cerrarModal}
              />
            </Modal.Body>
          </Modal>

          <ConfirmModal
            show={idEliminar !== null}
            mensaje={`¿Desea eliminar al psicólogo con ID ${idEliminar}?`}
            onConfirmar={handleEliminar}
            onCancelar={() => setIdEliminar(null)}
            cargando={eliminar.isPending}
          />
        </>
      )}
    </Container>
  );
};

export default PsicologosPage;
