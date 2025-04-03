import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

type LoginProps = {
  onLoginSuccess?: () => void;
};

export function Login({ onLoginSuccess }: LoginProps) {
  const [login, setLogin] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await authService.login(login, contrasena);
      onLoginSuccess?.();
      navigate("/polizas");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center bg-light"
      style={{ height: "100vh" }}
    >
      <div className="card shadow-lg border-0 p-5" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
            alt="Logo"
            style={{ width: "60px", marginBottom: "10px" }}
          />
          <h3 className="fw-bold mb-1 text-dark">Bienvenido al Sistema Mantenimiento de Polizas Popular</h3>
          <small className="text-muted">Ingrese con su usuario y contraseña</small>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <div className="form-group mb-3">
          <label className="form-label fw-semibold">Usuario</label>
          <input
            className="form-control shadow-sm"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Ingrese su usuario"
            disabled={loading}
            style={{ padding: "10px", fontSize: "1rem" }}
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label fw-semibold">Contraseña</label>
          <input
            type="password"
            className="form-control shadow-sm"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Ingrese su contraseña"
            disabled={loading}
            style={{ padding: "10px", fontSize: "1rem" }}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={loading}
          style={{ fontSize: "1rem", fontWeight: "500" }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Validando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </div>
    </div>
  );
}