import { Container, Row, Col, Card } from 'react-bootstrap';
import { Target, Eye, Shield, Leaf } from 'lucide-react';

const valores = [
  {
    icon: <Shield size={32} className="text-primary" />,
    titulo: 'Confidencialidad',
    descripcion:
      'Protegemos cada historia con los más altos estándares de privacidad clínica y ética profesional.',
  },
  {
    icon: <Leaf size={32} className="text-success" />,
    titulo: 'Bienestar integral',
    descripcion:
      'Entendemos la salud mental como parte de un todo: emocional, social, físico y espiritual.',
  },
  {
    icon: <Target size={32} className="text-warning" />,
    titulo: 'Personalización',
    descripcion:
      'Cada persona es única. Nuestros tratamientos se diseñan a la medida de tu historia y objetivos.',
  },
  {
    icon: <Eye size={32} className="text-info" />,
    titulo: 'Transparencia',
    descripcion:
      'Claridad en procesos, honorarios y métodos. Tú siempre sabes qué esperar de cada etapa.',
  },
];

const MisionPage = () => {
  return (
    <Container className="py-5">

      {/* Hero */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 72, height: 72, background: '#e3f2fd' }}
        >
          <Target size={36} className="text-primary" />
        </div>
        <h1 className="fw-bold mb-2">Nuestra Misión</h1>
        <p className="text-muted fs-5" style={{ maxWidth: 640, margin: '0 auto' }}>
          Construir un espacio de acceso real y humano a la salud mental, donde cada
          persona encuentre acompañamiento desde el respeto y la evidencia clínica.
        </p>
      </div>

      {/* Misión y Visión */}
      <Row className="g-4 mb-5">
        <Col md={6}>
          <div className="h-100 p-4 rounded-3 border border-primary border-opacity-25">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Target size={22} className="text-primary" />
              <h4 className="fw-bold mb-0 text-primary">Misión</h4>
            </div>
            <p className="text-muted mb-0">
              Brindar servicios de salud mental de alta calidad, accesibles y
              centrados en la persona. Nos comprometemos a acompañar a cada paciente
              en su proceso de autodescubrimiento y bienestar emocional mediante
              un equipo clínico multidisciplinario, ético y en constante formación.
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="h-100 p-4 rounded-3 border border-success border-opacity-25">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Eye size={22} className="text-success" />
              <h4 className="fw-bold mb-0 text-success">Visión</h4>
            </div>
            <p className="text-muted mb-0">
              Ser un referente regional en atención psicológica humanizada, donde la
              tecnología y la empatía se unan para eliminar las barreras de acceso
              al cuidado mental. Imaginamos una sociedad en la que pedir ayuda sea
              un acto de fortaleza, no de estigma.
            </p>
          </div>
        </Col>
      </Row>

      {/* Historia */}
      <div className="mb-5 mx-auto text-center" style={{ maxWidth: 720 }}>
        <h3 className="fw-bold mb-3">¿Cómo nació SafeHaven?</h3>
        <p className="text-muted">
          SafeHaven surgió de la necesidad de crear un lugar donde las personas pudieran
          encontrar apoyo psicológico sin barreras de tiempo, distancia ni estigma. Un
          grupo de psicólogos clínicos decidió que la tecnología podía ser aliada del
          bienestar mental, no su opuesto.
        </p>
        <p className="text-muted mb-0">
          Desde nuestros inicios hemos atendido a cientos de pacientes con la misma
          convicción: que cada historia merece ser escuchada con respeto, y que el
          cambio es posible cuando se tiene el acompañamiento correcto.
        </p>
      </div>
      {/* Valores */}
      <h3 className="fw-bold text-center mb-4">Nuestros valores</h3>
      <Row className="g-4 mb-5">
        {valores.map((v) => (
          <Col md={6} lg={3} key={v.titulo}>
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="p-4">
                <div className="mb-3">{v.icon}</div>
                <h6 className="fw-semibold mb-2">{v.titulo}</h6>
                <p className="text-muted small mb-0">{v.descripcion}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


    </Container>
  );
};

export default MisionPage;
