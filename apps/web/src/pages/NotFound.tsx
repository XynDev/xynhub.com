import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { SEO } from "../components/SEO"

export function NotFound() {
  return (
    <main className="pt-48 pb-20 px-6 md:px-8 min-h-screen flex items-center justify-center">
      <SEO title="Page Not Found" />
      <div className="text-center max-w-lg">
        <p className="text-label-sm text-on-surface-variant mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  )
}
