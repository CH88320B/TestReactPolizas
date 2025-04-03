using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiPolizas.Models;

public class Poliza
{
    [Key]
    [StringLength(50)]
    public string NumeroPoliza { get; set; } = null!;

    public int TipoPolizaId { get; set; }

    [StringLength(20)]
    public string CedulaAsegurado { get; set; } = null!;

    [Column(TypeName = "decimal(18,2)")]
    public decimal MontoAsegurado { get; set; }

    [Column(TypeName = "date")]
    public DateTime FechaVencimiento { get; set; }

    [Column(TypeName = "date")]
    public DateTime FechaEmision { get; set; }

    public int CoberturaId { get; set; }
    public int EstadoPolizaId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Prima { get; set; }

    [Column(TypeName = "date")]
    public DateTime Periodo { get; set; }

    [Column(TypeName = "date")]
    public DateTime FechaInclusion { get; set; }

    public int AseguradoraId { get; set; }

    // Relaciones eliminadas temporalmente para prueba sin
    // 
    [ForeignKey(nameof(TipoPolizaId))]
    public virtual TipoPoliza TipoPoliza { get; set; } = null!;

    [ForeignKey(nameof(CedulaAsegurado))]
    public virtual Cliente Cliente { get; set; } = null!;
   
    
    [ForeignKey(nameof(CoberturaId))]
    public virtual Cobertura Cobertura { get; set; } = null!;
   [ForeignKey(nameof(EstadoPolizaId))]
    public virtual EstadoPoliza EstadoPoliza { get; set; } = null!;
    [ForeignKey(nameof(AseguradoraId))]
    public virtual Aseguradora Aseguradora { get; set; } = null!;
}
