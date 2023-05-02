import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import Home from './pages/Home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Stations from './pages/Stations';
import Journeys from './pages/Journeys';
import SingleStation from './pages/SingleStation';

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/journeys">
            <Journeys pageNo={0} limit={20} />
          </Route>
          <Route exact path="/stations">
            <Stations pageNo={0} limit={20} />
          </Route>
          <Route exact path="/stations/station/:id">
            <SingleStation />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
