using WebApiPolizas.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PolizasDBContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ConnectSQL"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        )
    );
});


builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("NuevaPolitica", app =>
    {
        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "tu-app",
            ValidAudience = "tu-app",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Nsd258FP"))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ✅ Mostrar Swagger en todos los entornos (incluido Azure)
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("NuevaPolitica");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
