global using Microsoft.EntityFrameworkCore;
using JayMedia.Data.Data;
using JayMedia.Services.Interfaces;
using JayMedia.Services.Services;
using NLog;
using NLog.Web;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");
try 
{
  var builder = WebApplication.CreateBuilder(args);

  // Add services to the container.

  // NLog: Setup NLog for Dependency injection
  builder.Logging.ClearProviders();
  builder.Host.UseNLog();

  // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
  // builder.Services.AddOpenApi();
  builder.Services.AddControllers();

  // Add DBContext For EntityFramework
  builder.Services.AddDbContext<DataContext>(options =>
  options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

  // Services are injected here to be available app wide
  builder.Services.AddScoped<IAuth, AuthService>();

  builder.Services.AddEndpointsApiExplorer();
  builder.Services.AddSwaggerGen();

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

  app.UseHttpsRedirection();

  var summaries = new[]
  {
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
  };

  app.MapGet("/weatherforecast", () =>
  {
    var forecast =  Enumerable.Range(1, 5).Select(index =>
      new WeatherForecast
      (
        DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        Random.Shared.Next(-20, 55),
        summaries[Random.Shared.Next(summaries.Length)]
      ))
      .ToArray();
    return forecast;
  }).WithName("GetWeatherForecast");

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


record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
  public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
