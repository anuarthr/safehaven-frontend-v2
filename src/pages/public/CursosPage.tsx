import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { BookOpen, Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';

const cursos = [
  {
    titulo: 'Manejo del estrés y la ansiedad',
    descripcion:
      'Aprende técnicas basadas en mindfulness y terapia cognitivo-conductual para identificar y reducir el estrés cotidiano.',
    duracion: '4 semanas',
    nivel: 'Principiante',
    plazas: 20,
    color: 'primary',
  },
  {
    titulo: 'Inteligencia emocional en el trabajo',
    descripcion:
      'Desarrolla habilidades para reconocer, comprender y gestionar tus emociones en entornos laborales exigentes.',
    duracion: '6 semanas',
    nivel: 'Intermedio',
    plazas: 15,
    color: 'success',
  },
  {
    titulo: 'Autocuidado y bienestar personal',
    descripcion:
      'Un recorrido práctico por hábitos saludables, límites emocionales y rutinas de recuperación mental.',
    duracion: '3 semanas',
    nivel: 'Principiante',
    plazas: 25,
    color: 'warning',
  },
  {
    titulo: 'Relaciones saludables y comunicación asertiva',
    descripcion:
      'Técnicas para mejorar la comunicación interpersonal, resolver conflictos y construir vínculos positivos.',
    duracion: '5 semanas',
    nivel: 'Intermedio',
    plazas: 18,
    color: 'info',
  },
  {
    titulo: 'Duelo y resiliencia',
    descripcion:
      'Espacio de acompañamiento psicoeducativo para atravesar pérdidas y fortalecer la capacidad de recuperación.',
    duracion: '4 semanas',
    nivel: 'Todos los niveles',
    plazas: 12,
    color: 'secondary',
  },
  {
    titulo: 'Sueño y salud mental',
    descripcion:
      'Comprende la relación entre el descanso y el bienestar psicológico, con guías prácticas de higiene del sueño.',
    duracion: '2 semanas',
    nivel: 'Principiante',
    plazas: 30,
    color: 'danger',
  },
];

const CursosPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleInscripcion = (curso: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/citas?crear=1&tipo=Virtual&motivo=${encodeURIComponent(`Curso: ${curso}`)}`);
  };

  return (
    <Container className="py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 72, height: 72, background: '#e8f0fe' }}
        >
          <BookOpen size={36} className="text-primary" />
        </div>
        <h1 className="fw-bold mb-2">Cursos de Salud Mental</h1>
        <p className="text-muted fs-5" style={{ maxWidth: 600, margin: '0 auto' }}>
          Programas psicoeducativos diseñados por nuestro equipo clínico para
          acompañarte en el cuidado de tu bienestar emocional.
        </p>
      </div>

      {/* Grid cursos */}
      <Row className="g-4">
        {cursos.map((curso) => (
          <Col md={6} lg={4} key={curso.titulo}>
            <Card className="h-100 border-0 shadow-sm">
              <div
                style={{ height: 6 }}
                className={`rounded-top bg-${curso.color}`}
              />
              <Card.Body className="p-4 d-flex flex-column">
                <Card.Title className="fw-semibold mb-2">{curso.titulo}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">
                  {curso.descripcion}
                </Card.Text>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="d-flex align-items-center gap-1 text-muted small">
                    <Clock size={14} /> {curso.duracion}
                  </span>
                  <span className="d-flex align-items-center gap-1 text-muted small">
                    <Users size={14} /> {curso.plazas} plazas
                  </span>
                  <Badge bg={curso.color} className="align-self-center">
                    {curso.nivel}
                  </Badge>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0 px-4 pb-4">
                <Button
                  variant={`outline-${curso.color}`}
                  size="sm"
                  className="w-100"
                  onClick={() => handleInscripcion(curso.titulo)}
                >
                  Inscribirme
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA */}
      <div className="text-center mt-5 p-5 rounded-3" style={{ background: '#f0f7ff' }}>
        <Star size={32} className="text-primary mb-3" />
        <h4 className="fw-bold mb-2">¿Listo para comenzar?</h4>
        <p className="text-muted mb-4">
          Regístrate y accede a todos nuestros programas desde una sola plataforma.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/registro')}>
          Crear cuenta gratuita
        </Button>
      </div>
    </Container>
  );
};

export default CursosPage;
