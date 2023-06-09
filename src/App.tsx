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
import AddNew from './pages/AddNew';
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <>
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
          <Route exact path="/new">
            <AddNew />
          </Route>
          <Route exact path="/*">
            <PageNotFound />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
