export interface Ipoliza {
  numeroPoliza: string;
  tipoPolizaId: number;
  tipoPoliza?: { nombre: string }; 
  cedulaAsegurado: string;
  montoAsegurado: number;
  fechaVencimiento: string;
  fechaEmision: string;
  coberturaId?: { nombre: string };
  prima: number;
  periodo: string;
  fechaInclusion: string;
  aseguradoraId?: { nombre: string };
  estadoPoliza?: { nombre: string };
}
