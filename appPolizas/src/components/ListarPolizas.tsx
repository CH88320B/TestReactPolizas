import { useEffect, useState, useCallback } from "react";
import { appsettings } from "../settings/appsettings";
import { Table, Button, Container, Row, Col, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Ipoliza } from "../interfaces/Ipoliza";
import { authService } from "../services/authService";

interface TipoPoliza {
  tipoPolizaId: number;
  nombre: string;
}

export function ListarPolizas() {
  const [polizas, setPolizas] = useState<Ipoliza[]>([]);
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTipoId, setFiltroTipoId] = useState(0);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [tiposPoliza, setTiposPoliza] = useState<TipoPoliza[]>([]);
  const navigate = useNavigate();

  const obtenerPolizas = useCallback(async () => {
    try {
      const token = authService.getToken();

      const params = new URLSearchParams();
      if (filtroNumero) params.append("numeroPoliza", filtroNumero);
      if (filtroCedula) params.append("cedulaAsegurado", filtroCedula);
      if (filtroNombre) params.append("nombreApellido", filtroNombre);
      if (filtroTipoId > 0) params.append("tipoPolizaId", filtroTipoId.toString());
      if (fechaVencimiento) params.append("fechaVencimiento", fechaVencimiento);

      const url = `${appsettings.apiUrl}Poliza/Buscar?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPolizas(data);
      } else {
        Swal.fire("Error", "No se pudieron cargar las pólizas", "error");
      }
    } catch (error) {
      console.error("Error al obtener pólizas:", error);
      setPolizas([]);
    }
  }, [filtroNumero, filtroCedula, filtroNombre, filtroTipoId, fechaVencimiento]);

  const obtenerTiposPoliza = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${appsettings.apiUrl}TipoPoliza/Lista`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTiposPoliza(data);
      }
    } catch (error) {
      console.error("Error cargando tipos de póliza:", error);
    }
  };

  const eliminarPoliza = async (numeroPoliza: string) => {
    const confirmar = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar"
    });

    if (confirmar.isConfirmed) {
      const token = authService.getToken();
      const response = await fetch(`${appsettings.apiUrl}polizas/eliminar/${numeroPoliza}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        Swal.fire("Eliminado", "La póliza ha sido eliminada.", "success");
        obtenerPolizas();
      } else {
        Swal.fire("Error", "No se pudo eliminar la póliza", "error");
      }
    }
  };

  const cerrarSesion = () => {
    authService.logout();
    navigate("/login");
  };

  useEffect(() => {
    obtenerPolizas();
  }, [obtenerPolizas]);

  useEffect(() => {
    obtenerTiposPoliza();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-4">
        <Col><h2 className="fw-bold">Listado de Pólizas</h2></Col>
        <Col className="text-end">
          <Button color="dark" onClick={cerrarSesion}>Cerrar sesión</Button>
        </Col>
      </Row>

      <Row className="mb-3 g-2">
        <Col md={2}><Input placeholder="Número" value={filtroNumero} onChange={(e) => setFiltroNumero(e.target.value)} /></Col>
        <Col md={2}><Input placeholder="Cédula" value={filtroCedula} onChange={(e) => setFiltroCedula(e.target.value)} /></Col>
        <Col md={2}><Input placeholder="Nombre" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} /></Col>
        <Col md={2}>
          <Input type="select" value={filtroTipoId} onChange={(e) => setFiltroTipoId(parseInt(e.target.value))}>
            <option value={0}>Todos los tipos</option>
            {tiposPoliza.map((t) => (
              <option key={t.tipoPolizaId} value={t.tipoPolizaId}>{t.nombre}</option>
            ))}
          </Input>
        </Col>
        <Col md={2}>
          <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
        </Col>
        <Col md={2} className="text-end">
          <Button color="secondary" onClick={obtenerPolizas}>Buscar</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="text-end">
          <Link className="btn btn-success" to="/nuevaPoliza">Nueva Póliza</Link>
        </Col>
      </Row>

      <Table bordered hover responsive className="text-center align-middle border border-dark">
        <thead className="table-dark">
          <tr>
            <th>Número</th>
            <th>Tipo</th>
            <th>Cédula Asegurado</th>
            <th>Monto</th>
            <th>Prima</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {polizas.length === 0 ? (
            <tr><td colSpan={7}>No hay pólizas registradas</td></tr>
          ) : (
            polizas.map((p) => (
              <tr key={p.numeroPoliza}>
                <td>{p.numeroPoliza}</td>
                <td>{p.tipoPoliza?.nombre}</td>
                <td>{p.cedulaAsegurado}</td>
                <td>{p.montoAsegurado?.toLocaleString("es-CR", { style: "currency", currency: "CRC" })}</td>
                <td>{p.prima?.toLocaleString("es-CR", { style: "currency", currency: "CRC" })}</td>
                <td>{p.estadoPoliza?.nombre}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Link className="btn btn-outline-primary btn-sm" to={`/editarPoliza/${p.numeroPoliza}`}>
                      Editar
                    </Link>
                    <Button color="danger" size="sm" onClick={() => eliminarPoliza(p.numeroPoliza)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
