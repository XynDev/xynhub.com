import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "./ui/Button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="pt-48 pb-20 px-6 md:px-8 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-lg">
            <p className="text-label-sm text-on-surface-variant mb-4">Error</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-primary mb-4">
              Something went wrong
            </h1>
            <p className="text-on-surface-variant text-lg mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Refresh Page
            </Button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
