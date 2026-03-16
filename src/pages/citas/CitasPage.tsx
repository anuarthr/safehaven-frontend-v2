import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Container, Modal, Table, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const extraerRangoHoras = (horario: string): { inicio: number; fin: number } | null => {
  const tokens = horario.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi);
  if (!tokens || tokens.length < 2) return null;

  const aMinutos = (valor: string): number | null => {
    const limpio = valor.trim().toLowerCase();
    const esAm = limpio.includes('am');
    const esPm = limpio.includes('pm');
    const base = limpio.replace(/am|pm/g, '').trim();
    const [hRaw, mRaw] = base.split(':');
    const h = Number(hRaw);
    const m = Number(mRaw ?? '0');
    if (Number.isNaN(h) || Number.isNaN(m)) return null;

    let horas = h;
    if (esAm || esPm) {
      if (horas === 12) horas = 0;
      if (esPm) horas += 12;
    }

    return horas * 60 + m;
  };

  const inicio = aMinutos(tokens[0]);
  const fin = aMinutos(tokens[1]);

  if (inicio === null || fin === null) return null;
  return { inicio, fin };
};

const extraerDiasDisponibles = (horario: string): Set<number> | null => {
  const texto = horario.toLowerCase();
  const dias = new Set<number>();

  // Rangos comunes
  if (/lunes\s*(a|-|al)\s*viernes/.test(texto)) {
    [1, 2, 3, 4, 5].forEach((d) => dias.add(d));
  }
  if (/lunes\s*(a|-|al)\s*s[aá]bado/.test(texto)) {
    [1, 2, 3, 4, 5, 6].forEach((d) => dias.add(d));
  }
  if (/fin de semana/.test(texto)) {
    [0, 6].forEach((d) => dias.add(d));
  }

  const mapa: Record<string, number> = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    sábado: 6,
  };

  Object.entries(mapa).forEach(([nombre, indice]) => {
    if (texto.includes(nombre)) dias.add(indice);
  });

  return dias.size ? dias : null;
};

const hhmmAMinutos = (hora: string): number | null => {
  const [h, m] = hora.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const normalizarDuracion = (valor: string): string | null => {
  const input = valor.trim().toLowerCase();
  if (!input) return null;

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(input)) {
    const [h, m, s] = input.split(':').map(Number);
    if (m > 59 || s > 59) return null;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  if (/^\d{1,2}:\d{2}$/.test(input)) {
    const [h, m] = input.split(':').map(Number);
    if (m > 59) return null;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  if (/^\d+\s*h$/.test(input)) {
    const horas = Number(input.replace('h', '').trim());
    return `${String(horas).padStart(2, '0')}:00:00`;
  }

  if (/^\d+\s*m$/.test(input)) {
    const totalMin = Number(input.replace('m', '').trim());
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  if (/^\d+$/.test(input)) {
    const horas = Number(input);
    return `${String(horas).padStart(2, '0')}:00:00`;
  }

  return null;
};

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

const schema = z.object({
  motivo: z.string().min(1, 'Requerido'),
  duracion: z.string().min(1, 'La duración es requerida'),
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
  esPaciente: boolean;
  pacienteId?: number;
  insertByDefault?: string;
  tipoPrefill?: string;
  motivoPrefill?: string;
}

const CitaForm = ({
  valores,
  onSubmit,
  cargando,
  onCancelar,
  esPaciente,
  pacienteId,
  insertByDefault,
  tipoPrefill,
  motivoPrefill,
}: CitaFormProps) => {
  const { data: pacientes } = usePacientes();
  const { data: psicologos } = usePsicologos();
  const { data: consultorios } = useConsultorios();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CitaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: valores
      ? { ...valores, fecha: valores.fecha?.split('T')[0] ?? '' }
      : {
          updateBy: '',
          paciente: esPaciente && pacienteId ? pacienteId : undefined,
          insertBy: insertByDefault ?? '',
          tipoCita: tipoPrefill ?? '',
          motivo: motivoPrefill ?? '',
        },
  });

  const handleFormSubmit = (values: CitaFormValues) => {
    const duracionNormalizada = normalizarDuracion(values.duracion);
    if (!duracionNormalizada) {
      setError('duracion', {
        type: 'manual',
        message: 'Usa formatos como 2h, 90m, 1:30 o 01:30:00',
      });
      return;
    }

    const payload: CitaDto = {
      ...values,
      duracion: duracionNormalizada,
      paciente: esPaciente && pacienteId ? pacienteId : values.paciente,
      insertBy: values.insertBy || insertByDefault || '',
      updateBy: values.updateBy || '',
    };
    onSubmit(payload);
  };

  const psicologoIdSeleccionado = watch('psicologo');
  const fechaSeleccionada = watch('fecha');
  const horaSeleccionada = watch('hora');

  const psicologoSeleccionado = useMemo(
    () => psicologos?.find((p) => p.id === psicologoIdSeleccionado),
    [psicologos, psicologoIdSeleccionado],
  );

  useEffect(() => {
    if (!psicologoSeleccionado) return;

    clearErrors(['fecha', 'hora']);

    if (fechaSeleccionada) {
      const dias = extraerDiasDisponibles(psicologoSeleccionado.horarioDeAtencion);
      if (dias) {
        const diaSeleccionado = new Date(`${fechaSeleccionada}T00:00:00`).getDay();
        if (!dias.has(diaSeleccionado)) {
          setError('fecha', {
            type: 'manual',
            message: `El psicólogo atiende según: ${psicologoSeleccionado.horarioDeAtencion}`,
          });
        }
      }
    }

    if (horaSeleccionada) {
      const rango = extraerRangoHoras(psicologoSeleccionado.horarioDeAtencion);
      const horaMin = hhmmAMinutos(horaSeleccionada);
      if (rango && horaMin !== null && (horaMin < rango.inicio || horaMin > rango.fin)) {
        setError('hora', {
          type: 'manual',
          message: `Horario fuera de disponibilidad (${psicologoSeleccionado.horarioDeAtencion})`,
        });
      }
    }
  }, [
    psicologoSeleccionado,
    fechaSeleccionada,
    horaSeleccionada,
    setError,
    clearErrors,
  ]);

  const esEdicion = !!valores;

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Row>
        <Col md={8}>
          <FormField label="Motivo" error={errors.motivo}>
            <Form.Control isInvalid={!!errors.motivo} {...register('motivo')} />
          </FormField>
        </Col>
        <Col md={4}>
          <FormField label="Duración" error={errors.duracion}>
            <Form.Control
              placeholder="Ej: 2h, 90m, 1:30 o 01:30:00"
              isInvalid={!!errors.duracion}
              {...register('duracion')}
            />
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
            <Controller
              control={control}
              name="fecha"
              render={({ field }) => (
                <Calendar
                  value={fromYMD(field.value)}
                  onChange={(e) => {
                    const date = e.value instanceof Date ? e.value : null;
                    field.onChange(date ? toYMD(date) : '');
                  }}
                  dateFormat="dd/mm/yy"
                  placeholder="Selecciona fecha"
                  minDate={new Date()}
                  className={errors.fecha ? 'p-invalid w-100' : 'w-100'}
                  inputClassName="form-control"
                  showIcon
                  showButtonBar
                />
              )}
            />
          </FormField>
        </Col>
      </Row>
      <Row>
        <Col md={esEdicion ? 6 : 12}>
          <FormField label="Hora" error={errors.hora}>
            <Form.Control type="time" isInvalid={!!errors.hora} {...register('hora')} />
          </FormField>
        </Col>
        {esEdicion && (
          <Col md={6}>
            <FormField label="Insertado por" error={errors.insertBy}>
              <Form.Control
                isInvalid={!!errors.insertBy}
                disabled
                {...register('insertBy')}
              />
            </FormField>
          </Col>
        )}
      </Row>
      <Row>
        {!esPaciente && (
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
        )}
        <Col md={esPaciente ? 6 : 4}>
          <FormField label="Psicólogo" error={errors.psicologo}>
            <Form.Select isInvalid={!!errors.psicologo} {...register('psicologo', { valueAsNumber: true })}>
              <option value="">Seleccione...</option>
              {psicologos?.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
              ))}
            </Form.Select>
            {psicologoSeleccionado && (
              <Form.Text className="text-muted">
                Disponibilidad: {psicologoSeleccionado.horarioDeAtencion}
              </Form.Text>
            )}
          </FormField>
        </Col>
        <Col md={esPaciente ? 6 : 4}>
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: todasLasCitas, isLoading, isError, error } = useCitas();
  const { data: pacientes } = usePacientes();
  const { data: psicologos } = usePsicologos();
  const { data: consultorios } = useConsultorios();
  const { usuario } = useAuth();
  const esPaciente = usuario?.rol === 4;
  const esPsicologo = usuario?.rol === 2;
  const esAdministrador = !esPaciente && !esPsicologo;
  const rutaVolver = esPaciente ? '/dashboard' : '/dashboard-psicologo';

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
    : esPsicologo
      ? todasLasCitas?.filter((c) => c.psicologo === usuario?.id)
      : todasLasCitas;

  const abrirCrear = () => { setModo('crear'); setSeleccionado(null); setModalAbierto(true); };
  const abrirEditar = (c: Cita) => { setModo('editar'); setSeleccionado(c); setModalAbierto(true); };
  const cerrarModal = () => setModalAbierto(false);

  useEffect(() => {
    const crearDesdeFlujo = searchParams.get('crear') === '1';
    if (crearDesdeFlujo) {
      setModo('crear');
      setSeleccionado(null);
      setModalAbierto(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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

  const formatearFecha = (fecha: string) => {
    const f = new Date(`${fecha}T00:00:00`);
    if (Number.isNaN(f.getTime())) return fecha;
    return f.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
          <h2 className="mb-0">{esPaciente ? 'Mis Citas' : 'Citas'}</h2>
        </Col>

        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
          {esPaciente ? (
            <Button variant="primary" className="w-auto float-none" onClick={abrirCrear}>
              <Plus size={16} className="me-2" />
              Agendar cita
            </Button>
          ) : esAdministrador ? (
            <Button variant="primary" className="w-auto float-none" onClick={abrirCrear}>
              <Plus size={16} className="me-2" />
              Nueva cita
            </Button>
          ) : null}
        </Col>
      </Row>

      {!citas?.length ? (
        <EmptyState mensaje={esPaciente ? 'No tienes citas programadas.' : 'No hay citas registradas.'} />
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0 align-middle">
                <thead className="table-light">
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
                    {esAdministrador && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {citas.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-semibold">#{c.id}</td>
                      <td>{c.motivo}</td>
                      <td>
                        <Badge bg={c.tipoCita === 'Virtual' ? 'info' : 'primary'}>
                          {c.tipoCita}
                        </Badge>
                      </td>
                      <td>{formatearFecha(c.fecha)}</td>
                      <td>{c.hora}</td>
                      <td>{c.duracion}</td>
                      {!esPaciente && <td>{nombrePaciente(c.paciente)}</td>}
                      <td>{nombrePsicologo(c.psicologo)}</td>
                      <td>{nombreConsultorio(c.consultorio)}</td>
                      {esAdministrador && (
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
          </Card.Body>
        </Card>
      )}

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
            esPaciente={esPaciente}
            pacienteId={usuario?.id}
            insertByDefault={usuario?.correoElectronico}
            tipoPrefill={searchParams.get('tipo') ?? undefined}
            motivoPrefill={searchParams.get('motivo') ?? undefined}
          />
        </Modal.Body>
      </Modal>

      {esAdministrador && (
        <ConfirmModal
          show={idEliminar !== null}
          mensaje={`¿Desea eliminar la cita con ID ${idEliminar}?`}
          onConfirmar={handleEliminar}
          onCancelar={() => setIdEliminar(null)}
          cargando={eliminar.isPending}
        />
      )}
    </Container>
  );
};

export default CitasPage;
