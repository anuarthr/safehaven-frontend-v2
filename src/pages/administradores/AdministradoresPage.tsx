import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  useAdministradores,
  useCreateAdministrador,
  useUpdateAdministrador,
  useDeleteAdministrador,
} from '../../hooks/useAdministradores';
import { useRoles } from '../../hooks/useRoles';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormField from '../../components/ui/FormField';
import type { Administrador, RegistroAdministradorDto, ActualizarAdministradorDto } from '../../types';

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  correoElectronico: z.string().email('Correo inválido'),
  password: z.string().optional(),
  edad: z.number({ error: 'Debe ser un número' }).min(0),
  telefono: z.string().min(7),
  sexo: z.string().min(1, 'Requerido'),
  fechaDeNacimiento: z.string().min(1, 'Requerido'),
  rol: z.number({ error: 'Seleccione un rol' }).min(1, 'Requerido'),
  cargo: z.string().min(1, 'Requerido'),
});

type FormValues = z.infer<typeof schema>;
type Modo = 'crear' | 'editar';

interface AdminFormProps {
  modo: Modo;
  valores?: Administrador;
  onSubmit: (data: RegistroAdministradorDto | ActualizarAdministradorDto) => void;
  cargando: boolean;
  onCancelar: () => void;
}

const AdminForm = ({ modo, valores, onSubmit, cargando, onCancelar }: AdminFormProps) => {
  const { data: roles } = useRoles();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores
      ? { ...valores, fechaDeNacimiento: valores.fechaDeNacimiento?.split('T')[0] ?? '' }
      : { rol: 1 },
  });

  const handleFormSubmit = (values: FormValues) => {
    if (modo === 'crear') {
      if (!values.password || values.password.length < 6) {
        setError('password', { type: 'manual', message: 'Mínimo 6 caracteres' });
        return;
      }
      const { password, ...rest } = values;
      onSubmit({ ...rest, password } as RegistroAdministradorDto);
    } else {
      const { password: _pw, ...rest } = values;
      onSubmit(rest as ActualizarAdministradorDto);
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
            <Form.Control type="date" isInvalid={!!e.fechaDeNacimiento} {...register('fechaDeNacimiento')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Cargo" error={e.cargo}>
            <Form.Control isInvalid={!!e.cargo} {...register('cargo')} />
          </FormField>
        </Col>
      </Row>
      <FormField label="Rol" error={e.rol}>
        <Form.Select isInvalid={!!e.rol} {...register('rol', { valueAsNumber: true })}>
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

const AdministradoresPage = () => {
  const { data: admins, isLoading, isError, error } = useAdministradores();
  const { data: roles } = useRoles();
  const crear = useCreateAdministrador();
  const actualizar = useUpdateAdministrador();
  const eliminar = useDeleteAdministrador();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>('crear');
  const [seleccionado, setSeleccionado] = useState<Administrador | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (a: Administrador) => { setModo('editar'); setSeleccionado(a); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  const handleSubmit = (data: RegistroAdministradorDto | ActualizarAdministradorDto) => {
    if (modo === 'crear') {
      crear.mutate(data as RegistroAdministradorDto, { onSuccess: cerrarModal });
    } else if (seleccionado) {
      actualizar.mutate({ id: seleccionado.id, data: data as ActualizarAdministradorDto }, { onSuccess: cerrarModal });
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
        <h2 className="mb-0">Administradores</h2>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus size={16} className="me-2" />
          Nuevo administrador
        </Button>
      </div>

      {!admins?.length ? (
        <EmptyState mensaje="No hay administradores registrados." />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nombre}</td>
                  <td>{a.apellido}</td>
                  <td>{a.correoElectronico}</td>
                  <td>{a.cargo}</td>
                  <td>{a.telefono}</td>
                  <td>{rolNombre(a.rol)}</td>
                  <td>
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => abrirEditar(a)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setIdEliminar(a.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={modalAbierto} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modo === 'crear' ? 'Nuevo administrador' : 'Editar administrador'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminForm
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
        mensaje={`¿Desea eliminar al administrador con ID ${idEliminar}?`}
        onConfirmar={handleEliminar}
        onCancelar={() => setIdEliminar(null)}
        cargando={eliminar.isPending}
      />
    </Container>
  );
};

export default AdministradoresPage;
