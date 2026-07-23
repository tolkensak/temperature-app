// pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h2>🚫 404</h2>
      <h4 className="space-top-2">Oops! Page Not Found</h4>
      <div className="space-top-1">The page you are looking for does not exist or has been moved.</div>
      <div className="space-top-1"><Link to="/" className="link-a">🏠 Go Back Home</Link></div>
    </div>
  );
}
