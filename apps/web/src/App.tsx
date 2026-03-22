import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Process } from "./pages/Process"
import { Portofolio } from "./pages/Portofolio"
import { PortofolioDetail } from "./pages/PortofolioDetail"
import { Services } from "./pages/Services"
import { ServiceDetail } from "./pages/ServiceDetail"
import { Blogs } from "./pages/Blogs"
import { BlogDetail } from "./pages/BlogDetail"
import { PrivacyPolicy } from "./pages/PrivacyPolicy"
import { TermsOfService } from "./pages/TermsOfService"

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/process" element={<Process />} />
          <Route path="/portofolio" element={<Portofolio />} />
          <Route path="/portofolio/:slug" element={<PortofolioDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
