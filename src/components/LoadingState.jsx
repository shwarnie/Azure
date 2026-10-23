function LoadingState() {
  return (
    <main className="state-page" aria-live="polite" aria-busy="true">
      <span className="loading-spinner" aria-hidden="true" />
      <h1>Getting your questions ready…</h1>
      <p>This should only take a moment.</p>
    </main>
  )
}

export default LoadingState
