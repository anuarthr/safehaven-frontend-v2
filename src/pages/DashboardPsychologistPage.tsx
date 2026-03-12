import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/authcontext';

const DashboardPsychologistPage = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Panel de gestión — {usuario?.nombre} {usuario?.apellido}</h2>
          <p className="text-muted mb-0">{usuario?.correoElectronico}</p>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <Row className="g-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-4">
              <Users size={40} className="text-primary mb-3" />
              <Card.Title>Pacientes</Card.Title>
              <Button variant="primary" size="sm" onClick={() => navigate('/pacientes')}>
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-4">
              <Users size={40} className="text-success mb-3" />
              <Card.Title>Psicólogos</Card.Title>
              <Button variant="success" size="sm" onClick={() => navigate('/psicologos')}>
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-4">
              <Calendar size={40} className="text-warning mb-3" />
              <Card.Title>Citas</Card.Title>
              <Button variant="warning" size="sm" onClick={() => navigate('/citas')}>
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center py-4">
              <Building2 size={40} className="text-info mb-3" />
              <Card.Title>Consultorios</Card.Title>
              <Button variant="info" size="sm" onClick={() => navigate('/consultorios')}>
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPsychologistPage;
