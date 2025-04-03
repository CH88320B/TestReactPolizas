import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
interface TipoPoliza { tipoPolizaId: number; nombre: string }
interface Cobertura { coberturaId: number; nombre: string }
interface Aseguradora { aseguradoraId: number; nombre: string }

export function EditarPoliza() {
  const { numeroPoliza } = useParams();
  const navigate = useNavigate();

  const [cedula, setCedula] = useState("");
  const [monto, setMonto] = useState("");
  const [prima, setPrima] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [tipoPolizaId, setTipoPolizaId] = useState(0);
  const [coberturaId, setCoberturaId] = useState(0);
  const [aseguradoraId, setAseguradoraId] = useState(0);

  const [tiposPoliza, setTiposPoliza] = useState<TipoPoliza[]>([]);
  const [coberturas, setCoberturas] = useState<Cobertura[]>([]);
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);

  const cargarCatalogos = async () => {
    const token = authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const endpoints = [
      { url: "TipoPoliza/Lista", setter: setTiposPoliza },
      { url: "Cobertura/Lista", setter: setCoberturas },
      { url: "Aseguradora/Lista", setter: setAseguradoras }
    ];
    for (const { url, setter } of endpoints) {
      const res = await fetch(`${appsettings.apiUrl}${url}`, { headers });
      if (res.ok) setter(await res.json());
    }
  };

  const cargarPoliza = async () => {
    const token = authService.getToken();
    const res = await fetch(`${appsettings.apiUrl}Poliza/Buscar?numeroPoliza=${numeroPoliza}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      const p = Array.isArray(data) ? data[0] : data;

      setCedula(p.cedulaAsegurado);
      setMonto(p.montoAsegurado);
      setPrima(p.prima);
      setFechaEmision(p.fechaEmision.split("T")[0]);
      setFechaVencimiento(p.fechaVencimiento.split("T")[0]);
      setTipoPolizaId(p.tipoPolizaId);
      setCoberturaId(p.coberturaId);
      setAseguradoraId(p.aseguradoraId);
    } else {
      Swal.fire("Error", "No se pudo cargar la póliza", "error");
    }
  };

  const actualizarPoliza = async () => {
    const token = authService.getToken();
    const res = await fetch(`${appsettings.apiUrl}Poliza/Editar/${numeroPoliza}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numeroPoliza,
        cedulaAsegurado: cedula,
        montoAsegurado: parseFloat(monto),
        prima: parseFloat(prima),
        fechaEmision,
        fechaVencimiento,
        tipoPolizaId,
        coberturaId,
        aseguradoraId
      })
    });

    if (res.ok) {
      Swal.fire("Actualizado", "La póliza fue actualizada", "success");
      navigate("/polizas");
    } else {
      Swal.fire("Error", "No se pudo actualizar la póliza", "error");
    }
  };

  useEffect(() => {
    cargarCatalogos();
    cargarPoliza();
  });

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <h3 className="text-center mb-4">Editar Póliza</h3>
          <Form>
            <FormGroup>
              <Label>Número de Póliza</Label>
              <Input value={numeroPoliza} disabled />
            </FormGroup>
            <FormGroup>
              <Label>Cédula</Label>
              <Input value={cedula} onChange={(e) => setCedula(e.target.value)} />
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
              <Label>Fecha Emisión</Label>
              <Input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Fecha Vencimiento</Label>
              <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Tipo de Póliza</Label>
              <Input type="select" value={tipoPolizaId} onChange={(e) => setTipoPolizaId(parseInt(e.target.value))}>
                <option value={0}>Seleccione</option>
                {tiposPoliza.map(t => (
                  <option key={t.tipoPolizaId} value={t.tipoPolizaId}>{t.nombre}</option>
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
              <Button color="primary" onClick={actualizarPoliza}>Actualizar</Button>
              <Button color="secondary" className="ms-3" onClick={() => navigate("/polizas")}>Volver</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}
