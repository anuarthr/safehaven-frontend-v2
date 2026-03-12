interface EmptyStateProps {
  mensaje?: string;
}

const EmptyState = ({ mensaje = 'No hay registros para mostrar.' }: EmptyStateProps) => (
  <div className="text-center py-5">
    <p className="text-muted fs-5">{mensaje}</p>
  </div>
);

export default EmptyState;
