/**
 * Application Routing Layer
 * Standardizes on official battle-tested 'react-router-dom'.
 * Re-exports common routing primitives for clean component consumption.
 */

export {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';

export default {
  // Re-export default container if any module uses default import
};
