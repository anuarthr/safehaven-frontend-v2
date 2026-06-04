import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/authcontext';
import FormField from '../components/ui/FormField';
import logoExtendido from '../assets/images/logo-extendido.png';
import doctor from '../assets/images/doctor.png';

const schema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof schema>;

const ROL_PACIENTE = 4;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, usuario } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && usuario) {
      navigate(usuario.rol.id === ROL_PACIENTE ? '/dashboard' : '/dashboard-psicologo');
    }
  }, [isLoading, isAuthenticated, usuario, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data);
      toast.success(`Bienvenido, ${data.nombre}`);
      navigate(data.rol.id === ROL_PACIENTE ? '/dashboard' : '/dashboard-psicologo');
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSubmit = (values: LoginFormValues) => mutate(values);

  return (
    <div id="loginMenu">
      <div id="doctorContainer">
        <img src={logoExtendido} style={{ width: '60%' }} alt="SafeHaven" />
        <img src={doctor} style={{ width: '100%' }} alt="Doctor" />
      </div>
      <div id="loginContainer">
        <h5 className="mb-4">Iniciar sesión</h5>
        <Form onSubmit={handleSubmit(onSubmit)} id="formAuth" noValidate>
          <FormField label="Correo electrónico" error={errors.email}>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              isInvalid={!!errors.email}
              {...register('email')}
            />
          </FormField>
          <FormField label="Contraseña" error={errors.password}>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              isInvalid={!!errors.password}
              {...register('password')}
            />
          </FormField>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="submit"
              id="loginBtn"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </div>
        </Form>
        <div className="text-center mt-3">
          <span>¿No tienes cuenta? </span>
          <Button variant="link" className="p-0" onClick={() => navigate('/registro')}>
            Regístrate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
