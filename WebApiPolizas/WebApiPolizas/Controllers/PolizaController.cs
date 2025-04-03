using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using WebApiPolizas.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApiPolizas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PolizaController : Controller
    {
        private readonly PolizasDBContext dbContext;
        public PolizaController(PolizasDBContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
       [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listapoliza = await dbContext.Polizas
                .Include(p => p.Cliente)
                .Include(p => p.TipoPoliza)
                .Include(p => p.Cobertura)
                 .Include(p => p.EstadoPoliza)
                .Include(p => p.Aseguradora)
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, listapoliza);
        }

        [HttpGet("Buscar")]
        public async Task<IActionResult> Buscar(
             [FromQuery] string? numeroPoliza,
             [FromQuery] int? tipoPolizaId,
             [FromQuery] DateTime? fechaVencimiento,
             [FromQuery] string? cedulaAsegurado,
             [FromQuery] string? nombreApellido
)
        {
            var query = dbContext.Polizas
                .Include(p => p.Cliente)
                .Include(p => p.TipoPoliza)
                .Include(p => p.Cobertura)
                .Include(p => p.EstadoPoliza)
                .Include(p => p.Aseguradora)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(numeroPoliza))
                query = query.Where(p => p.NumeroPoliza.Contains(numeroPoliza));

            if (tipoPolizaId.HasValue)
                query = query.Where(p => p.TipoPolizaId == tipoPolizaId.Value);

            if (fechaVencimiento.HasValue)
                query = query.Where(p => p.FechaVencimiento == fechaVencimiento.Value);

            if (!string.IsNullOrWhiteSpace(cedulaAsegurado))
                query = query.Where(p => p.CedulaAsegurado == cedulaAsegurado);

            if (!string.IsNullOrWhiteSpace(nombreApellido))
                query = query.Where(p =>
                    (p.Cliente.Nombre + " " + p.Cliente.PrimerApellido + " " + p.Cliente.SegundoApellido)
                    .Contains(nombreApellido));

            var resultados = await query.ToListAsync();

            return Ok(resultados);
        }



        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] Poliza objeto)
        {
            await dbContext.Polizas.AddAsync(objeto);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }


        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Poliza objeto)
        {
            dbContext.Polizas.Update(objeto);
            await dbContext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }


        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> Eliminar(string id)
        {
            var poliza = await dbContext.Polizas.FirstOrDefaultAsync(e => e.NumeroPoliza == id);

            if (poliza == null)
            {
                return NotFound(new { mensaje = "No se encontró la póliza" });
            }

            dbContext.Polizas.Remove(poliza);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
        }



    }
}
