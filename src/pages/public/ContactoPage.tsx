import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactoPage = () => {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
  };

  return (
    <Container className="py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 72, height: 72, background: '#e8f5e9' }}
        >
          <Mail size={36} className="text-success" />
        </div>
        <h1 className="fw-bold mb-2">Contacto</h1>
        <p className="text-muted fs-5" style={{ maxWidth: 560, margin: '0 auto' }}>
          ¿Tienes preguntas, dudas o quieres agendar una primera consulta? Estamos aquí para ayudarte.
        </p>
      </div>

      <Row className="g-5">
        {/* Formulario */}
        <Col lg={7}>
          <h4 className="fw-bold mb-4">Envíanos un mensaje</h4>

          {enviado && (
            <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
              <strong>¡Mensaje enviado!</strong> Nos pondremos en contacto contigo pronto.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Nombre completo</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold small">Asunto</Form.Label>
              <Form.Select name="asunto" value={form.asunto} onChange={handleChange} required>
                <option value="">Seleccione un asunto...</option>
                <option value="consulta">Consulta general</option>
                <option value="cita">Agendar una cita</option>
                <option value="acompanamiento">Servicio de acompañamiento</option>
                <option value="cursos">Información sobre cursos</option>
                <option value="otro">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold small">Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos en qué podemos ayudarte..."
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" className="mt-4 d-flex align-items-center gap-2">
              <Send size={18} />
              Enviar mensaje
            </Button>
          </Form>
        </Col>

        {/* Info de contacto */}
        <Col lg={5}>
          <h4 className="fw-bold mb-4">Información de contacto</h4>

          <div className="d-flex flex-column gap-3 mb-4">
            {[
              {
                icon: <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />,
                titulo: 'Dirección',
                detalle: 'Av. Bienestar 1234, Eje Salud Mental\nCiudad, País',
              },
              {
                icon: <Phone size={20} className="text-success flex-shrink-0 mt-1" />,
                titulo: 'Teléfono',
                detalle: '+1 (555) 234-5678\nLunas a Viernes, 8am – 7pm',
              },
              {
                icon: <Mail size={20} className="text-warning flex-shrink-0 mt-1" />,
                titulo: 'Correo',
                detalle: 'hola@safehaven.com\nRespuesta en menos de 24h',
              },
              {
                icon: <Clock size={20} className="text-info flex-shrink-0 mt-1" />,
                titulo: 'Horario de atención',
                detalle: 'Lunes a Viernes: 8:00 – 20:00\nSábados: 9:00 – 14:00',
              },
            ].map((item) => (
              <div key={item.titulo} className="d-flex gap-3">
                {item.icon}
                <div>
                  <div className="fw-semibold small">{item.titulo}</div>
                  <div className="text-muted small" style={{ whiteSpace: 'pre-line' }}>
                    {item.detalle}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-0 bg-primary text-white">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-2">¿Urgencia emocional?</h6>
              <p className="small mb-3 opacity-75">
                Si estás en una situación de crisis, no esperes. Contáctanos directamente.
              </p>
              <div className="fw-bold">📞 Línea de crisis: +1 (555) 999-0000</div>
              <div className="small opacity-75 mt-1">Disponible las 24 horas, los 7 días</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactoPage;
