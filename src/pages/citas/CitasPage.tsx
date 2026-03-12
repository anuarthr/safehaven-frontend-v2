import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';
import { useCitas, useCreateCita, useUpdateCita, useDeleteCita } from '../../hooks/useCitas';
import { usePacientes } from '../../hooks/usePacientes';
import { usePsicologos } from '../../hooks/usePsicologos';
import { useConsultorios } from '../../hooks/useConsultorios';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormField from '../../components/ui/FormField';
import type { Cita, CitaDto } from '../../types';

const schema = z.object({
  motivo: z.string().min(1, 'Requerido'),
  duracion: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato HH:mm:ss requerido'),
  tipoCita: z.string().min(1, 'Requerido'),
  insertBy: z.string().min(1, 'Requerido'),
  updateBy: z.string(),
  fecha: z.string().min(1, 'Requerido'),
  hora: z.string().min(1, 'Requerido'),
  paciente: z.number({ error: 'Seleccione un paciente' }).min(1, 'Requerido'),
  psicologo: z.number({ error: 'Seleccione un psicólogo' }).min(1, 'Requerido'),
  consultorio: z.number({ error: 'Seleccione un consultorio' }).min(1, 'Requerido'),
});

type CitaFormValues = z.infer<typeof schema>;
type Modo = 'crear' | 'editar';

interface CitaFormProps {
  valores?: Cita;
  onSubmit: (data: CitaDto) => void;
  cargando: boolean;
  onCancelar: () => void;
}

const CitaForm = ({ valores, onSubmit, cargando, onCancelar }: CitaFormProps) => {
  const { data: pacientes } = usePacientes();
  const { data: psicologos } = usePsicologos();
  const { data: consultorios } = useConsultorios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CitaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores
      ? { ...valores, fecha: valores.fecha?.split('T')[0] ?? '' }
      : { updateBy: '' },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Row>
        <Col md={8}>
          <FormField label="Motivo" error={errors.motivo}>
            <Form.Control isInvalid={!!errors.motivo} {...register('motivo')} />
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Duración (HH:mm:ss)" error={errors.duracion}>
            <Form.Control placeholder="01:00:00" isInvalid={!!errors.duracion} {...register('duracion')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormField label="Tipo de cita" error={errors.tipoCita}>
            <Form.Select isInvalid={!!errors.tipoCita} {...register('tipoCita')}>
              <option value="">Seleccione...</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
            </Form.Select>
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Fecha" error={errors.fecha}>
            <Form.Control type="date" isInvalid={!!errors.fecha} {...register('fecha')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormField label="Hora" error={errors.hora}>
            <Form.Control type="time" isInvalid={!!errors.hora} {...register('hora')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Insertado por" error={errors.insertBy}>
            <Form.Control isInvalid={!!errors.insertBy} {...register('insertBy')} />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <FormField label="Paciente" error={errors.paciente}>
            <Form.Select isInvalid={!!errors.paciente} {...register('paciente', { valueAsNumber: true })}>
              <option value="">Seleccione...</option>
              {pacientes?.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </Form.Select>
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Psicólogo" error={errors.psicologo}>
            <Form.Select isInvalid={!!errors.psicologo} {...register('psicologo', { valueAsNumber: true })}>
              <option value="">Seleccione...</option>
              {psicologos?.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </Form.Select>
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Consultorio" error={errors.consultorio}>
            <Form.Select isInvalid={!!errors.consultorio} {...register('consultorio', { valueAsNumber: true })}>
              <option value="">Seleccione...</option>
              {consultorios?.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </Form.Select>
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

const CitasPage = () => {
  const { data: todasLasCitas, isLoading, isError, error } = useCitas();
  const { data: pacientes } = usePacientes();
  const { data: psicologos } = usePsicologos();
  const { data: consultorios } = useConsultorios();
  const { usuario } = useAuth();
  const esPaciente = usuario?.rol === 4;

  const crear = useCreateCita();
  const actualizar = useUpdateCita();
  const eliminar = useDeleteCita();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>('crear');
  const [seleccionado, setSeleccionado] = useState<Cita | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  // Pacientes sólo ven sus propias citas
  const citas = esPaciente
    ? todasLasCitas?.filter((c) => c.paciente === usuario?.id)
    : todasLasCitas;

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (c: Cita) => { setModo('editar'); setSeleccionado(c); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  const handleSubmit = (data: CitaDto) => {
    if (modo === 'crear') {
      crear.mutate(data, { onSuccess: cerrarModal });
    } else if (seleccionado) {
      actualizar.mutate({ id: seleccionado.id, data }, { onSuccess: cerrarModal });
    }
  };

  const handleEliminar = () => {
    if (idEliminar !== null) {
      eliminar.mutate(idEliminar, { onSuccess: () => setIdEliminar(null) });
    }
  };

  const nombrePaciente = (id: number) => {
    const p = pacientes?.find((x) => x.id === id);
    return p ? `${p.nombre} ${p.apellido}` : `ID ${id}`;
  };
  const nombrePsicologo = (id: number) => {
    const p = psicologos?.find((x) => x.id === id);
    return p ? `${p.nombre} ${p.apellido}` : `ID ${id}`;
  };
  const nombreConsultorio = (id: number) =>
    consultorios?.find((x) => x.id === id)?.nombre ?? `ID ${id}`;

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{(error as Error).message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{esPaciente ? 'Mis Citas' : 'Citas'}</h2>
        {!esPaciente && (
          <Button variant="primary" onClick={abrirCrear}>
            <Plus size={16} className="me-2" />
            Nueva cita
          </Button>
        )}
      </div>

      {!citas?.length ? (
        <EmptyState mensaje={esPaciente ? 'No tienes citas programadas.' : 'No hay citas registradas.'} />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Motivo</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Duración</th>
                {!esPaciente && <th>Paciente</th>}
                <th>Psicólogo</th>
                <th>Consultorio</th>
                {!esPaciente && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.motivo}</td>
                  <td>{c.tipoCita}</td>
                  <td>{c.fecha}</td>
                  <td>{c.hora}</td>
                  <td>{c.duracion}</td>
                  {!esPaciente && <td>{nombrePaciente(c.paciente)}</td>}
                  <td>{nombrePsicologo(c.psicologo)}</td>
                  <td>{nombreConsultorio(c.consultorio)}</td>
                  {!esPaciente && (
                    <td>
                      <Button variant="outline-warning" size="sm" className="me-2" onClick={() => abrirEditar(c)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => setIdEliminar(c.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {!esPaciente && (
        <>
          <Modal show={modalAbierto} onHide={cerrarModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{modo === 'crear' ? 'Nueva cita' : 'Editar cita'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CitaForm
                valores={seleccionado ?? undefined}
                onSubmit={handleSubmit}
                cargando={crear.isPending || actualizar.isPending}
                onCancelar={cerrarModal}
              />
            </Modal.Body>
          </Modal>

          <ConfirmModal
            show={idEliminar !== null}
            mensaje={`¿Desea eliminar la cita con ID ${idEliminar}?`}
            onConfirmar={handleEliminar}
            onCancelar={() => setIdEliminar(null)}
            cargando={eliminar.isPending}
          />
        </>
      )}
    </Container>
  );
};

export default CitasPage;
