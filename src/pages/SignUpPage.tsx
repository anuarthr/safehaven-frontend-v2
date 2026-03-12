import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPaciente } from '../api/pacientes';
import FormField from '../components/ui/FormField';
import logoExtendido from '../assets/images/logo-extendido.png';
import doctor from '../assets/images/doctor.png';

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  correoElectronico: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  fechaDeNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  sexo: z.string().min(1, 'El sexo es requerido'),
  aseguradora: z.string().min(1, 'La aseguradora es requerida'),
});

type SignUpFormValues = z.infer<typeof schema>;

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SignUpFormValues) => {
      const edad = calcularEdad(values.fechaDeNacimiento);
      const fechaDeRegistro = new Date().toISOString().split('T')[0];
      return createPaciente({
        ...values,
        edad,
        fechaDeRegistro,
        estadoDeSalud: 'Saludable',
        rol: 4,
      });
    },
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente. Inicia sesión.');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = (values: SignUpFormValues) => mutate(values);

  return (
    <div id="loginMenu">
      <div id="doctorContainer">
        <img src={logoExtendido} style={{ width: '60%' }} alt="SafeHaven" />
        <img src={doctor} style={{ width: '100%' }} alt="Doctor" />
      </div>
      <div id="loginContainer">
        <h5 className="mb-4">Crear cuenta</h5>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Row>
            <Col md={6}>
              <FormField label="Nombre" error={errors.nombre}>
                <Form.Control
                  placeholder="Nombre"
                  isInvalid={!!errors.nombre}
                  {...register('nombre')}
                />
              </FormField>
            </Col>
            <Col md={6}>
              <FormField label="Apellido" error={errors.apellido}>
                <Form.Control
                  placeholder="Apellido"
                  isInvalid={!!errors.apellido}
                  {...register('apellido')}
                />
              </FormField>
            </Col>
          </Row>
          <FormField label="Correo electrónico" error={errors.correoElectronico}>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              isInvalid={!!errors.correoElectronico}
              {...register('correoElectronico')}
            />
          </FormField>
          <FormField label="Contraseña" error={errors.password}>
            <Form.Control
              type="password"
              placeholder="Mínimo 6 caracteres"
              isInvalid={!!errors.password}
              {...register('password')}
            />
          </FormField>
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
              <FormField label="Sexo" error={errors.sexo}>
                <Form.Select isInvalid={!!errors.sexo} {...register('sexo')}>
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </FormField>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormField label="Teléfono" error={errors.telefono}>
                <Form.Control
                  placeholder="Teléfono"
                  isInvalid={!!errors.telefono}
                  {...register('telefono')}
                />
              </FormField>
            </Col>
            <Col md={6}>
              <FormField label="Aseguradora" error={errors.aseguradora}>
                <Form.Control
                  placeholder="Aseguradora"
                  isInvalid={!!errors.aseguradora}
                  {...register('aseguradora')}
                />
              </FormField>
            </Col>
          </Row>
          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" id="loginBtn" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Registrando...
                </>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </div>
        </Form>
        <div className="text-center mt-3">
          <span>¿Ya tienes cuenta? </span>
          <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
