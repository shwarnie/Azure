const CONTACTS = [
  ['Mercylyne Ongach', 'mercylyneongach@gmail.com'],
  ['Kelvin Maina', 'km542754@gmail.com'],
  ['Mary Sharnice', 'sharniceotieno@gmail.com'],
  ['Bbossa Mukisa', 'bbossajm1@gmail.com'],
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <p className="footer-disclaimer">
          Unofficial AZ-900 practice tool. Not affiliated with or endorsed by
          Microsoft.
        </p>
        <div className="footer-links">
          <details className="footer-disclosure">
            <summary>Contact us</summary>
            <ul>
              {CONTACTS.map(([name, email]) => (
                <li key={email}>
                  <span>{name}</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
          </details>
          <details className="footer-disclosure privacy-policy">
            <summary>Privacy policy</summary>
            <div className="privacy-copy">
              <h2>Privacy at a glance</h2>
              <p>
                AZORA does not require an account. Quiz progress and
                missed-question IDs are stored in this browser’s local storage.
              </p>
              <p>
                If you choose “Explain it simpler,” the current question, answer
                options, your selected answer, and its explanation are sent
                through the app’s explanation service to the Claude API. Do not
                include personal or sensitive information in learning content.
              </p>
              <p>
                Source document uploads are not available in this version; files
                are not accepted, uploaded, or processed. Clearing this
                browser’s site data removes locally stored quiz progress.
              </p>
            </div>
          </details>
        </div>
        <p className="footer-copyright">© 2026 AZORA</p>
      </div>
    </footer>
  )
}

export default SiteFooter
