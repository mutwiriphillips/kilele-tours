import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import Vip from "./pages/Vip";
import Itinerary from "./pages/Itinerary";
import IzuruPreview from "./pages/IzuruPreview";
import RequestQuote from "./pages/RequestQuote";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { ItineraryProvider } from "./context/ItineraryContext";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    );
  }

  return (
    <ItineraryProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/vip" element={<Vip />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/izuru-preview/:siteId" element={<IzuruPreview />} />
            <Route path="/request-quote" element={<RequestQuote />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ItineraryProvider>
  );
}
