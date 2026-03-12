import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Heart, ShieldCheck, Phone, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const caracteristicas = [
  {
    icon: <Phone size={28} className="text-primary" />,
    titulo: 'Disponibilidad continua',
    descripcion:
      'Un profesional asignado disponible para contacto durante la semana mediante mensajería segura dentro de la plataforma.',
  },
  {
    icon: <Heart size={28} className="text-danger" />,
    titulo: 'Seguimiento personalizado',
    descripcion:
      'Tu psicólogo de acompañamiento conoce tu historia y mantiene una comunicación constante entre sesiones formales.',
  },
  {
    icon: <ShieldCheck size={28} className="text-success" />,
    titulo: 'Confidencialidad garantizada',
    descripcion:
      'Toda la comunicación está cifrada y protegida bajo nuestro protocolo de privacidad clínica.',
  },
  {
    icon: <Zap size={28} className="text-warning" />,
    titulo: 'Respuesta en crisis',
    descripcion:
      'Protocolo de intervención rápida ante situaciones de urgencia emocional con derivación inmediata si es necesario.',
  },
];

const paraQuien = [
  'Personas en proceso de duelo o pérdida reciente',
  'Pacientes en transición entre etapas de vida (universidad, trabajo, maternidad)',
  'Quienes viven solos y buscan un apoyo emocional constante',
  'Personas con ansiedad social que prefieren el contacto gradual',
  'Pacientes en pausa entre ciclos de terapia formal',
  'Quienes desean mantener su bienestar tras finalizar un proceso terapéutico',
];

const AcompanamientoPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 72, height: 72, background: '#fce4ec' }}
        >
          <Heart size={36} className="text-danger" />
        </div>
        <h1 className="fw-bold mb-2">Servicio de Acompañamiento</h1>
        <p className="text-muted fs-5" style={{ maxWidth: 620, margin: '0 auto' }}>
          Un soporte emocional continuo entre sesiones, diseñado para que nunca
          te sientas solo en tu proceso de bienestar.
        </p>
      </div>

      {/* Descripción principal */}
      <Row className="align-items-center mb-5 g-4">
        <Col md={6}>
          <h3 className="fw-bold mb-3">¿Qué es el acompañamiento psicológico?</h3>
          <p className="text-muted">
            El acompañamiento no es terapia formal, pero complementa y potencia cualquier
            proceso clínico. Es la presencia de un profesional que te escucha, orienta y
            contiene en los momentos cotidianos que surgen entre una sesión y otra.
          </p>
          <p className="text-muted">
            En SafeHaven lo entendemos como un puente entre la consulta y la vida real:
            un espacio de sostén donde puedes compartir tus avances, dificultades y
            dudas sin esperar a la próxima cita.
          </p>
          <Button variant="primary" onClick={() => navigate('/registro')}>
            Solicitar acompañamiento
          </Button>
        </Col>
        <Col md={6}>
          <div className="rounded-3 p-4" style={{ background: '#fff3e0' }}>
            <h5 className="fw-semibold mb-3">¿Para quién es este servicio?</h5>
            <ListGroup variant="flush">
              {paraQuien.map((item) => (
                <ListGroup.Item key={item} className="bg-transparent px-0 py-2 border-0 small text-muted">
                  <span className="text-warning fw-bold me-2">→</span>
                  {item}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>

      {/* Características */}
      <h3 className="fw-bold text-center mb-4">¿Qué incluye?</h3>
      <Row className="g-4 mb-5">
        {caracteristicas.map((c) => (
          <Col md={6} key={c.titulo}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4 d-flex gap-3">
                <div className="flex-shrink-0">{c.icon}</div>
                <div>
                  <h6 className="fw-semibold mb-1">{c.titulo}</h6>
                  <p className="text-muted small mb-0">{c.descripcion}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Diferencia con terapia */}
      <div className="rounded-3 p-5" style={{ background: '#f0f7ff' }}>
        <Row className="g-4 text-center">
          <Col md={6}>
            <h5 className="fw-bold text-primary mb-3">Acompañamiento</h5>
            <ul className="list-unstyled text-muted small text-start d-inline-block">
              <li className="mb-2">✓ Contacto frecuente y flexible</li>
              <li className="mb-2">✓ Orientación emocional cotidiana</li>
              <li className="mb-2">✓ Seguimiento entre sesiones</li>
              <li className="mb-2">✓ Ideal como complemento</li>
            </ul>
          </Col>
          <Col md={6}>
            <h5 className="fw-bold text-success mb-3">Terapia formal</h5>
            <ul className="list-unstyled text-muted small text-start d-inline-block">
              <li className="mb-2">✓ Proceso clínico estructurado</li>
              <li className="mb-2">✓ Diagnóstico y plan de tratamiento</li>
              <li className="mb-2">✓ Sesiones de 50 minutos</li>
              <li className="mb-2">✓ Abordaje de trastornos específicos</li>
            </ul>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={() => navigate('/registro')}>
            Quiero comenzar
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default AcompanamientoPage;
