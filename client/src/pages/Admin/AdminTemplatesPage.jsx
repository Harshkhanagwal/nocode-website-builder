import { Link } from "react-router-dom";
import "./AdminTemplatesPage.css";

function AdminTemplatesPage() {
  return (
    <main className="admin-template-page">
      <header>
        <div>
          <p>Workspace administration</p>
          <h1>Templates</h1>
        </div>
        <Link to="/admin">Back to admin</Link>
      </header>
      <section aria-label="Template management workspace" />
    </main>
  );
}

export default AdminTemplatesPage;
