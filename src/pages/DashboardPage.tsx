import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, User } from 'lucide-react';
import { useAuth } from '../contexts/authcontext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <Container className="py-4">
      <div className="mb-4">
        <div>
          <h2 className="mb-1">Bienvenido, {usuario?.nombre} {usuario?.apellido}</h2>
          <p className="text-muted mb-0">{usuario?.correoElectronico}</p>
        </div>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-5">
              <Calendar size={48} className="text-primary mb-3" />
              <Card.Title>Mis Citas</Card.Title>
              <Card.Text className="text-muted">Agenda y consulta tus citas programadas</Card.Text>
              <Button variant="primary" onClick={() => navigate('/citas')}>
                Ver citas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-5">
              <User size={48} className="text-success mb-3" />
              <Card.Title>Psicólogos</Card.Title>
              <Card.Text className="text-muted">Encuentra tu psicólogo ideal</Card.Text>
              <Button variant="success" onClick={() => navigate('/psicologos')}>
                Ver psicólogos
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-5">
              <FileText size={48} className="text-warning mb-3" />
              <Card.Title>Mi Perfil</Card.Title>
              <Card.Text className="text-muted">Consulta y actualiza tu información</Card.Text>
              <Button variant="warning" onClick={() => navigate('/perfil')}>
                Ver perfil
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
