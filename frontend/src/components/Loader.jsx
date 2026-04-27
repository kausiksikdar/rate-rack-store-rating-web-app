export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <div className="loader-text">{message}</div>
    </div>
  );
}