import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateTrip from "./pages/CreateTripPage";
import TripsPage from "./pages/TripsPage";
import NavBar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage"; 
import ProtectedRoute from "./services/ProtectedRoute"; 
import TripDetailsPage from "./pages/TripDetailsPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/create-trip" 
          element={<ProtectedRoute element={<CreateTrip />} />} 
        />
        <Route 
          path="/trips" 
          element={<ProtectedRoute element={<TripsPage />} />} 
        />
        <Route path="/trip/:id" element={<TripDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
