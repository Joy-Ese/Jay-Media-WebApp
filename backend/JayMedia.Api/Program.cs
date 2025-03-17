global using Microsoft.EntityFrameworkCore;
using System.Text;
using JayMedia.Data.Data;
using JayMedia.Services.Interfaces;
using JayMedia.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NLog;
using NLog.Web;
using Swashbuckle.AspNetCore.Filters;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");
try 
{
  var builder = WebApplication.CreateBuilder(args);

  // Add CORS policy
  builder.Services.AddCors(options => {
    options.AddPolicy("_myAllowSpecificOrigins",
    new CorsPolicyBuilder()
    .WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials()
    .Build());
  });

  var policyName = "_myAllowSpecificOrigins";
  builder.Services.AddCors(options =>
    {
      options.AddPolicy(name: policyName,
        policy =>
        {
          policy.WithOrigins("http://localhost:4200")
          .WithMethods("GET", "POST", "PUT", "DELETE")
          .AllowAnyHeader();
        }
      );
    }
  );

  // NLog: Setup NLog for Dependency injection
  builder.Logging.ClearProviders();
  builder.Host.UseNLog();

  // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
  // builder.Services.AddOpenApi();
  builder.Services.AddControllers();

  // Add DBContext For EntityFramework
  builder.Services.AddDbContext<DataContext>(options =>
  options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

  // Load app settings
  var jwtSettings = builder.Configuration.GetSection("JwtSettings");
  var key = Encoding.UTF8.GetBytes(jwtSettings["Token"] ?? throw new ArgumentNullException("JWT Key is missing"));

  builder.Services.AddAuthentication(options => 
  {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(options => 
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
  });

  builder.Services.AddEndpointsApiExplorer();

  // Add Swagger Configuration for testing Authentication from Swagger UI
  builder.Services.AddSwaggerGen(options => 
  {
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
      Description = "Enter '{your token}' in the text box below. Example: Bearer eyJhbGciOiJIUz...",
      Name = "Authorization",
      In = ParameterLocation.Header,
      Type = SecuritySchemeType.Http,
      Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
      {
        new OpenApiSecurityScheme
        {
          Reference = new OpenApiReference
          {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
          }
        },
        new List<string>()
      }
    });
  });
  // -------------------------------------------- //

  // Services are injected here to be available app wide
  builder.Services.AddScoped<IAuth, AuthService>();
  builder.Services.AddScoped<IUser, UserService>();

  builder.Services.AddAuthorization();

  var app = builder.Build();

  // Configure the HTTP request pipeline.
  // if (app.Environment.IsDevelopment())
  // {
  //     app.MapOpenApi();
  // }
  if (app.Environment.IsDevelopment())
  {
    // Migrate latest database changes during startup
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dbContext.Database.Migrate();
  }

  app.UseSwagger();
  app.UseSwaggerUI();

  app.UseCors(policyName);

  app.UseHttpsRedirection();

  app.UseRouting();

  app.UseAuthentication();

  app.UseAuthorization();

  app.MapControllers();

  app.Run();
}
catch (Exception ex)
{
  // NLog: catch setup errors
  logger.Error(ex, "Stopped program because of exception");
  throw;
}
finally 
{
  // Ensure to flush and stop internal timers/ threads before application-exit (Avoid segmentation fault on Linux)
  NLog.LogManager.Shutdown();
}
