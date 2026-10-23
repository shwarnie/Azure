function ExplainButton({ onExplain, loading, explanationText }) {
  return (
    <div className="explain-slot">
      <button
        className="button button-quiet"
        type="button"
        onClick={onExplain}
        disabled={loading}
      >
        {loading ? 'Making it simpler…' : 'Explain it simpler'}
      </button>
      {explanationText && (
        <p className="simple-explanation" aria-live="polite">
          {explanationText}
        </p>
      )}
    </div>
  )
}

export default ExplainButton
