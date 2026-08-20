import React, { useState, useEffect, createContext, useContext } from 'react';

const RouterContext = createContext({
  path: window.location.pathname,
  navigate: () => {},
  params: {}
});

export const BrowserRouter = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, options = {}) => {
    if (to.startsWith('http://') || to.startsWith('https://')) {
      window.location.href = to;
      return;
    }
    if (options.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setPath(window.location.pathname);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

export const useParams = () => {
  const { path } = useContext(RouterContext);
  const segments = path.split('/').filter(Boolean);

  // Match /g/:slug
  if (segments[0] === 'g' && segments[1]) {
    return { slug: segments[1] };
  }

  // Match /admin/gifts/:id
  if (segments[0] === 'admin' && segments[1] === 'gifts' && segments[2]) {
    return { id: segments[2] };
  }

  return {};
};

function matchRoute(routePath, currentPath) {
  if (routePath === currentPath) return true;
  if (routePath === '*') return true;

  if (routePath === '/g/:slug') {
    const segments = currentPath.split('/').filter(Boolean);
    return segments[0] === 'g' && segments.length === 2;
  }

  if (routePath.endsWith('/*')) {
    const base = routePath.replace('/*', '');
    return currentPath === base || currentPath.startsWith(base + '/');
  }

  return false;
}

export const Routes = ({ children }) => {
  const { path } = useContext(RouterContext);
  const routes = React.Children.toArray(children);

  for (const route of routes) {
    if (React.isValidElement(route) && matchRoute(route.props.path, path)) {
      return route.props.element;
    }
  }

  return null;
};

export const Route = ({ path, element }) => {
  return element;
};

export const Link = ({ to, children, className = '', target, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (target === '_blank' || to.startsWith('http') || to.startsWith('#')) {
      return;
    }
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} target={target} {...props}>
      {children}
    </a>
  );
};

export const Navigate = ({ to, replace = true }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);

  return null;
};

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate
};
