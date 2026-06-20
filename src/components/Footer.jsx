function Footer() {
  return (
    <div className="bg-dark">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between text-white py-4 text-start">
          <div>
            <p className="mb-1 fw-bold">雪旅選場</p>
            <p className="mb-0 small text-white-50">
              © 2026 雪旅選場. 專注整理值得安排進雪季行程的日本雪場。
            </p>
          </div>
          <ul className="d-flex list-unstyled mb-0 h4">
            <li>
              <a href="https://www.facebook.com/" className="text-white mx-3" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/" className="text-white mx-3" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://mail.google.com/" className="text-white ms-3" aria-label="Mail">
                <i className="bi bi-envelope"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
