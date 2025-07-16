import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div className="auth">
      <h1 className="script-text">Reset Password</h1>
      <div className="success-message">
        Check your emails — we’ve sent you a reset link!
      </div>
      <div className="link-container">
        <Link to="/" className="back-link">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
