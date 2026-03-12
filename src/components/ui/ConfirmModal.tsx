import { Button, Modal } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  titulo?: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  cargando?: boolean;
}

const ConfirmModal = ({
  show,
  titulo = 'Confirmar eliminación',
  mensaje,
  onConfirmar,
  onCancelar,
  cargando = false,
}: ConfirmModalProps) => (
  <Modal show={show} onHide={onCancelar} centered>
    <Modal.Header closeButton>
      <Modal.Title>{titulo}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancelar} disabled={cargando}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirmar} disabled={cargando}>
        {cargando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Eliminando...
          </>
        ) : (
          'Eliminar'
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
