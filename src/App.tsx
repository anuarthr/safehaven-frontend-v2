import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header';
import { Footer } from './components/footer';
import Spinner from './components/ui/Spinner';

// Pages — lazy loaded por ruta para reducir el bundle inicial
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DashboardPsychologistPage = lazy(() => import('./pages/DashboardPsychologistPage'));
const PacientesPage = lazy(() => import('./pages/pacientes/PacientesPage'));
const PerfilPacientePage = lazy(() => import('./pages/pacientes/PerfilPacientePage'));
const PsicologosPage = lazy(() => import('./pages/psicologos/PsicologosPage'));
const AdministradoresPage = lazy(() => import('./pages/administradores/AdministradoresPage'));
const CitasPage = lazy(() => import('./pages/citas/CitasPage'));
const ConsultoriosPage = lazy(() => import('./pages/consultorios/ConsultoriosPage'));
const CursosPage = lazy(() => import('./pages/public/CursosPage'));
const SesionesPage = lazy(() => import('./pages/public/SesionesPage'));
const AcompanamientoPage = lazy(() => import('./pages/public/AcompanamientoPage'));
const MisionPage = lazy(() => import('./pages/public/MisionPage'));
const ContactoPage = lazy(() => import('./pages/public/ContactoPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<SignUpPage />} />
              <Route path="/cursos" element={<CursosPage />} />
              <Route path="/sesiones" element={<SesionesPage />} />
              <Route path="/acompanamiento" element={<AcompanamientoPage />} />
              <Route path="/mision" element={<MisionPage />} />
              <Route path="/contacto" element={<ContactoPage />} />

              {/* Redirección raíz al login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Protegidas */}
              <Route path="/dashboard" element={<ProtectedRoute roles={[4]}><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard-psicologo" element={<ProtectedRoute roles={[1,2,3]}><DashboardPsychologistPage /></ProtectedRoute>} />
              {/* Perfil propio — sólo pacientes */}
              <Route path="/perfil" element={<ProtectedRoute roles={[4]}><PerfilPacientePage /></ProtectedRoute>} />
              {/* Lista CRUD de pacientes — sólo staff */}
              <Route path="/pacientes" element={<ProtectedRoute roles={[1,2,3]}><PacientesPage /></ProtectedRoute>} />
              <Route path="/psicologos" element={<ProtectedRoute><PsicologosPage /></ProtectedRoute>} />
              <Route path="/administradores" element={<ProtectedRoute roles={[1,2,3]}><AdministradoresPage /></ProtectedRoute>} />
              <Route path="/citas" element={<ProtectedRoute><CitasPage /></ProtectedRoute>} />
              <Route path="/consultorios" element={<ProtectedRoute roles={[1,2,3]}><ConsultoriosPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

