// App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './routes';
import LoginFooter from 'components/page-footer';

const App: React.FC = () => {
  return (
    <Router>
      <RoutesComponent />
      <LoginFooter/>  
    </Router>
  );
};

export default App;
