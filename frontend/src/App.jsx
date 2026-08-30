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
import Policy from "./pages/Policy";
import Feedback from "./pages/Feedback";
import Receipt from "./pages/Receipt";
import Admin from "./pages/Admin";
import { ItineraryProvider } from "./context/ItineraryContext";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isReceipt = location.pathname.startsWith("/receipt");

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    );
  }

  // Receipts render standalone (no public nav) since they're meant to be
  // printed or saved as a PDF, and are often opened from a WhatsApp/email
  // link rather than by browsing the site.
  if (isReceipt) {
    return (
      <div className="min-h-screen">
        <Routes>
          <Route path="/receipt/:receiptNumber" element={<Receipt />} />
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
            <Route path="/policy" element={<Policy />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ItineraryProvider>
  );
}
