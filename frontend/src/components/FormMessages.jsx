/**
 * Renders success/error messages for forms and action pages.
 * Eliminates repeated conditional rendering of .success-msg / .error-msg.
 */
function FormMessages({ message, error }) {
  return (
    <>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </>
  );
}

export default FormMessages;
