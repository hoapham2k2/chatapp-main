using mysignalR.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



//th�m signalR
builder.Services.AddSignalR();

//th�m cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder => builder
                    .WithOrigins("http://localhost:3000", "https://hoapham-chatapp.vercel.app/")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chatHub");
});
app.MapControllers();

app.Run();
