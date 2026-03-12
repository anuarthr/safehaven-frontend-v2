interface SpinnerProps {
  mensaje?: string;
}

const Spinner = ({ mensaje = 'Cargando...' }: SpinnerProps) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5">
    <div className="spinner-border text-primary mb-3" role="status">
      <span className="visually-hidden">{mensaje}</span>
    </div>
    <p className="text-muted">{mensaje}</p>
  </div>
);

export default Spinner;
