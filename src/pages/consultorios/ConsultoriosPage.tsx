import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col, Badge } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  useConsultorios,
  useCreateConsultorio,
  useUpdateConsultorio,
  useDeleteConsultorio,
} from '../../hooks/useConsultorios';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormField from '../../components/ui/FormField';
import type { Consultorio, ConsultorioDto } from '../../types';

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  ubicacion: z.string().min(1, 'Requerido'),
  tipo: z.string().min(1, 'Requerido'),
  capacidad: z.number({ error: 'Debe ser un número' }).min(1, 'Mínimo 1'),
  horarioDeApertura: z.string().min(1, 'Requerido'),
  horarioDeCierre: z.string().min(1, 'Requerido'),
  activo: z.boolean(),
});

type ConsultorioFormValues = z.infer<typeof schema>;
type Modo = 'crear' | 'editar';

interface ConsultorioFormProps {
  valores?: Consultorio;
  onSubmit: (data: ConsultorioDto) => void;
  cargando: boolean;
  onCancelar: () => void;
}

const ConsultorioForm = ({ valores, onSubmit, cargando, onCancelar }: ConsultorioFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultorioFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores ?? { activo: true },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Row>
        <Col md={6}>
          <FormField label="Nombre" error={errors.nombre}>
            <Form.Control isInvalid={!!errors.nombre} {...register('nombre')} />
          </FormField>
        </Col>
        <Col md={6}>
          <FormField label="Tipo" error={errors.tipo}>
            <Form.Control isInvalid={!!errors.tipo} {...register('tipo')} />
          </FormField>
        </Col>
      </Row>
      <FormField label="Ubicación" error={errors.ubicacion}>
        <Form.Control isInvalid={!!errors.ubicacion} {...register('ubicacion')} />
      </FormField>
      <Row>
        <Col md={4}>
          <FormField label="Capacidad" error={errors.capacidad}>
            <Form.Control type="number" isInvalid={!!errors.capacidad} {...register('capacidad', { valueAsNumber: true })} />
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Apertura" error={errors.horarioDeApertura}>
            <Form.Control type="time" isInvalid={!!errors.horarioDeApertura} {...register('horarioDeApertura')} />
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Cierre" error={errors.horarioDeCierre}>
            <Form.Control type="time" isInvalid={!!errors.horarioDeCierre} {...register('horarioDeCierre')} />
          </FormField>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check type="switch" label="Activo" {...register('activo')} />
      </Form.Group>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancelar} disabled={cargando}>Cancelar</Button>
        <Button type="submit" variant="primary" disabled={cargando}>
          {cargando ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : 'Guardar'}
        </Button>
      </div>
    </Form>
  );
};

const ConsultoriosPage = () => {
  const { data: consultorios, isLoading, isError, error } = useConsultorios();
  const crear = useCreateConsultorio();
  const actualizar = useUpdateConsultorio();
  const eliminar = useDeleteConsultorio();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<Modo>('crear');
  const [seleccionado, setSeleccionado] = useState<Consultorio | null>(null);
  const [idEliminar, setIdEliminar] = useState<number | null>(null);

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (c: Consultorio) => { setModo('editar'); setSeleccionado(c); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  const handleSubmit = (data: ConsultorioDto) => {
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

  if (isLoading) return <Spinner />;
  if (isError) return <div className="alert alert-danger m-4">{(error as Error).message}</div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Consultorios</h2>
        <Button variant="primary" onClick={abrirCrear}>
          <Plus size={16} className="me-2" />
          Nuevo consultorio
        </Button>
      </div>

      {!consultorios?.length ? (
        <EmptyState mensaje="No hay consultorios registrados." />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultorios.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.tipo}</td>
                  <td>{c.ubicacion}</td>
                  <td>{c.capacidad}</td>
                  <td>{c.horarioDeApertura}</td>
                  <td>{c.horarioDeCierre}</td>
                  <td>
                    <Badge bg={c.activo ? 'success' : 'secondary'}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => abrirEditar(c)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setIdEliminar(c.id)}>
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
          <Modal.Title>{modo === 'crear' ? 'Nuevo consultorio' : 'Editar consultorio'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConsultorioForm
            valores={seleccionado ?? undefined}
            onSubmit={handleSubmit}
            cargando={crear.isPending || actualizar.isPending}
            onCancelar={cerrarModal}
          />
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={idEliminar !== null}
        mensaje={`¿Desea eliminar el consultorio con ID ${idEliminar}?`}
        onConfirmar={handleEliminar}
        onCancelar={() => setIdEliminar(null)}
        cargando={eliminar.isPending}
      />
    </Container>
  );
};

export default ConsultoriosPage;
