import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })))
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })))
const Process = lazy(() => import("./pages/Process").then(m => ({ default: m.Process })))
const Portofolio = lazy(() => import("./pages/Portofolio").then(m => ({ default: m.Portofolio })))
const PortofolioDetail = lazy(() => import("./pages/PortofolioDetail").then(m => ({ default: m.PortofolioDetail })))
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })))
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then(m => ({ default: m.ServiceDetail })))
const Blogs = lazy(() => import("./pages/Blogs").then(m => ({ default: m.Blogs })))
const BlogDetail = lazy(() => import("./pages/BlogDetail").then(m => ({ default: m.BlogDetail })))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })))
const TermsOfService = lazy(() => import("./pages/TermsOfService").then(m => ({ default: m.TermsOfService })))
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <Header />
      <Suspense fallback={<PageLoader />}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </Suspense>
      <Footer />
    </Router>
    </ErrorBoundary>
  )
}

export default App
