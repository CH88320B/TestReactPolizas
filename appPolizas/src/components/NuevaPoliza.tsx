import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { authService } from "../services/authService";

// Tipos de datos
type TipoPoliza = { tipoPolizaId: number; nombre: string };
type Cobertura = { coberturaId: number; nombre: string };
type Aseguradora = { aseguradoraId: number; nombre: string };

export function NuevaPoliza() {
  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [cedula, setCedula] = useState("");
  const [monto, setMonto] = useState("");
  const [prima, setPrima] = useState("");
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split("T")[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const [tipoPolizaId, setTipoPolizaId] = useState(0);
  const [coberturaId, setCoberturaId] = useState(0);
  const [aseguradoraId, setAseguradoraId] = useState(0);

  const [tiposPoliza, setTiposPoliza] = useState<TipoPoliza[]>([]);
  const [coberturas, setCoberturas] = useState<Cobertura[]>([]);
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);

  const navigate = useNavigate();

  const cargarListas = async () => {
    const token = authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const endpoints = [
      { url: "TipoPoliza/Lista", setter: setTiposPoliza },
      { url: "Cobertura/Lista", setter: setCoberturas },
      { url: "Aseguradora/Lista", setter: setAseguradoras }
    ];

    for (const { url, setter } of endpoints) {
      try {
        const res = await fetch(`${appsettings.apiUrl}${url}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setter(data);
        } else {
          console.warn(`❌ No se pudo cargar ${url}`);
        }
      } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
      }
    }
  };

  const guardarPoliza = async () => {
    if (!numeroPoliza || !cedula || !monto || !prima || !fechaEmision || !fechaVencimiento || !tipoPolizaId || !coberturaId || !aseguradoraId) {
      Swal.fire("Validación", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const token = authService.getToken();
      const res = await fetch(`${appsettings.apiUrl}Poliza/Nuevo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          numeroPoliza,
          cedulaAsegurado: cedula,
          montoAsegurado: parseFloat(monto),
          prima: parseFloat(prima),
          fechaEmision: `${fechaEmision}T00:00:00`,
          fechaVencimiento: `${fechaVencimiento}T00:00:00`,
          periodo: `${fechaVencimiento}T00:00:00`,
          fechaInclusion: new Date().toISOString(),
          tipoPolizaId,
          coberturaId,
          aseguradoraId,
          estadoPolizaId: 1 // Vigente
        })
      });

      if (res.ok) {
        Swal.fire("¡Guardado!", "Póliza registrada correctamente", "success");
        navigate("/polizas");
      } else {
        Swal.fire("Error", "No se pudo guardar la póliza", "error");
      }
    } catch (error) {
      console.error("Error al guardar póliza:", error);
      Swal.fire("Error", "Fallo en el servidor", "error");
    }
  };

  const limpiarFormulario = () => {
    setNumeroPoliza("");
    setCedula("");
    setMonto("");
    setPrima("");
    setFechaEmision(new Date().toISOString().split("T")[0]);
    setFechaVencimiento("");
    setTipoPolizaId(0);
    setCoberturaId(0);
    setAseguradoraId(0);
  };

  useEffect(() => {
    cargarListas();
  }, []);

  return (
    <Container className="mt-5">
      <Card className="shadow border-0">
        <CardBody>
          <h3 className="mb-4 text-center">Registrar Nueva Póliza</h3>
          <Form>
            <FormGroup>
              <Label>Número de Póliza</Label>
              <Input value={numeroPoliza} onChange={(e) => setNumeroPoliza(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Cédula del Asegurado</Label>
              <Input
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: Nacional: 00-0000-0000 | Extranjero: 00000000000"
              />
            </FormGroup>
            <FormGroup>
              <Label>Monto Asegurado</Label>
              <Input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Prima</Label>
              <Input type="number" value={prima} onChange={(e) => setPrima(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Fecha de Emisión</Label>
              <Input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Fecha de Vencimiento</Label>
              <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Tipo de Póliza</Label>
              <Input type="select" value={tipoPolizaId} onChange={(e) => setTipoPolizaId(parseInt(e.target.value))}>
                <option value={0}>Seleccione</option>
                {tiposPoliza.map(tp => (
                  <option key={tp.tipoPolizaId} value={tp.tipoPolizaId}>{tp.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Cobertura</Label>
              <Input type="select" value={coberturaId} onChange={(e) => setCoberturaId(parseInt(e.target.value))}>
                <option value={0}>Seleccione</option>
                {coberturas.map(c => (
                  <option key={c.coberturaId} value={c.coberturaId}>{c.nombre}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Aseguradora</Label>
              <Input type="select" value={aseguradoraId} onChange={(e) => setAseguradoraId(parseInt(e.target.value))}>
                <option value={0}>Seleccione</option>
                {aseguradoras.map(a => (
                  <option key={a.aseguradoraId} value={a.aseguradoraId}>{a.nombre}</option>
                ))}
              </Input>
            </FormGroup>

            <div className="text-center mt-4">
              <Button color="primary" className="me-3" onClick={guardarPoliza}>Guardar Póliza</Button>
              <Button color="secondary" className="me-3" onClick={limpiarFormulario}>Limpiar</Button>
              <Button color="dark" onClick={() => navigate("/polizas")}>Volver</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}
