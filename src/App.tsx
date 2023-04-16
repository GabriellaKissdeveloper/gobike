import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Stations from './pages/Stations';

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/stations">
            <Stations />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
