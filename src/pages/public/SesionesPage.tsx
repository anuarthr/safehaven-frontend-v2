import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Video, MapPin, Users, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tipos = [
  {
    icon: <Video size={40} className="text-primary mb-3" />,
    titulo: 'Sesión Individual Presencial',
    descripcion:
      'Sesiones de 50 minutos con tu psicólogo asignado en nuestras instalaciones. Un espacio seguro, privado y cómodo para trabajar en profundidad.',
    beneficios: ['Privacidad total', 'Sin interrupciones', 'Material de apoyo in situ'],
    color: 'primary',
  },
  {
    icon: <Video size={40} className="text-success mb-3" />,
    titulo: 'Sesión Individual Virtual',
    descripcion:
      'La misma calidad terapéutica desde la comodidad de tu hogar. Conexión segura y confidencial a través de nuestra plataforma.',
    beneficios: ['Desde cualquier lugar', 'Horarios flexibles', 'Grabación opcional'],
    color: 'success',
  },
  {
    icon: <Users size={40} className="text-warning mb-3" />,
    titulo: 'Terapia de Pareja',
    descripcion:
      'Sesiones guiadas para mejorar la comunicación, resolver conflictos y fortalecer el vínculo afectivo en pareja.',
    beneficios: ['Mediación profesional', 'Ejercicios prácticos', 'Plan personalizado'],
    color: 'warning',
  },
  {
    icon: <Users size={40} className="text-info mb-3" />,
    titulo: 'Terapia de Grupo',
    descripcion:
      'Grupos de máximo 8 personas facilitados por un terapeuta. Ideal para trabajar habilidades sociales, duelo o ansiedad social.',
    beneficios: ['Apoyo entre pares', 'Costo accesible', 'Red de contención'],
    color: 'info',
  },
  {
    icon: <MessageCircle size={40} className="text-secondary mb-3" />,
    titulo: 'Consulta de Orientación',
    descripcion:
      'Una sesión inicial de exploración para conocer tus necesidades, resolver dudas y encontrar el tipo de terapia más adecuado para ti.',
    beneficios: ['Sin compromiso', 'Evaluación inicial', 'Derivación especializada'],
    color: 'secondary',
  },
  {
    icon: <MapPin size={40} className="text-danger mb-3" />,
    titulo: 'Sesión de Urgencia',
    descripcion:
      'Disponible ante situaciones de crisis emocional. Atención prioritaria con psicólogos de guardia en horario extendido.',
    beneficios: ['Respuesta rápida', 'Protocolo de crisis', 'Seguimiento posterior'],
    color: 'danger',
  },
];

const SesionesPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 72, height: 72, background: '#e8f5e9' }}
        >
          <MessageCircle size={36} className="text-success" />
        </div>
        <h1 className="fw-bold mb-2">Nuestras Sesiones</h1>
        <p className="text-muted fs-5" style={{ maxWidth: 600, margin: '0 auto' }}>
          Diferentes modalidades de atención psicológica para que encuentres
          el espacio que mejor se adapte a tus necesidades.
        </p>
      </div>

      {/* Tarjetas */}
      <Row className="g-4 mb-5">
        {tipos.map((t) => (
          <Col md={6} lg={4} key={t.titulo}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body className="p-4 d-flex flex-column">
                {t.icon}
                <Card.Title className="fw-semibold mb-2">{t.titulo}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">{t.descripcion}</Card.Text>
                <ul className="list-unstyled mt-3 text-start">
                  {t.beneficios.map((b) => (
                    <li key={b} className="small text-muted mb-1">
                      <span className={`text-${t.color} fw-bold me-1`}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0 pb-4 px-4">
                <Button
                  variant={`outline-${t.color}`}
                  size="sm"
                  className="w-100"
                  onClick={() => navigate('/registro')}
                >
                  Agendar
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Proceso */}
      <div className="p-5 rounded-3 text-center" style={{ background: '#f8f9fa' }}>
        <h4 className="fw-bold mb-4">¿Cómo funciona?</h4>
        <Row className="g-4">
          {[
            { paso: '01', texto: 'Crea tu cuenta y completa tu perfil de paciente.' },
            { paso: '02', texto: 'Elige el tipo de sesión y el psicólogo de tu preferencia.' },
            { paso: '03', texto: 'Agenda tu cita en el horario que más te convenga.' },
            { paso: '04', texto: 'Asiste a tu sesión y empieza tu proceso de bienestar.' },
          ].map((item) => (
            <Col xs={6} md={3} key={item.paso}>
              <div
                className="rounded-circle bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: 48, height: 48, fontSize: 18 }}
              >
                {item.paso}
              </div>
              <p className="text-muted small mb-0">{item.texto}</p>
            </Col>
          ))}
        </Row>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/registro')}>
          Comenzar ahora
        </Button>
      </div>
    </Container>
  );
};

export default SesionesPage;
