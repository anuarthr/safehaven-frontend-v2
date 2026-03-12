import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header';
import { Footer } from './components/footer';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import DashboardPsychologistPage from './pages/DashboardPsychologistPage';
import PacientesPage from './pages/pacientes/PacientesPage';
import PerfilPacientePage from './pages/pacientes/PerfilPacientePage';
import PsicologosPage from './pages/psicologos/PsicologosPage';
import AdministradoresPage from './pages/administradores/AdministradoresPage';
import CitasPage from './pages/citas/CitasPage';
import ConsultoriosPage from './pages/consultorios/ConsultoriosPage';
import CursosPage from './pages/public/CursosPage';
import SesionesPage from './pages/public/SesionesPage';
import AcompanamientoPage from './pages/public/AcompanamientoPage';
import MisionPage from './pages/public/MisionPage';
import ContactoPage from './pages/public/ContactoPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

