using Microsoft.AspNetCore.HttpOverrides;
using posystem.ServiceInterface;
using posystem.ServiceInterface.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // If you don't know the exact IPs of Cloudflare, you can clear the default networks/proxies
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});


//builder.WebHost.UseUrls("http://0.0.0.0:8090"); //Comment this out for development

var services = builder.Services;

//services.AddServiceStack(typeof(MyServices).Assembly);
services.AddServiceStack(typeof(CustomerService).Assembly);
services.AddServiceStack(typeof(EmployeeService).Assembly);

// Registering the EmployeeService with Dependency Injection
//builder.Services.AddTransient<EmployeeService>();
//builder.Services.AddTransient<CustomerService>();

//test for deployment #2

var app = builder.Build();

app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

// Configure ServiceStack License
ServiceStack.LicenseUtils.RegisterLicense("TRIAL30WEB-e3JlZjpUUklBTDMwV0VCLG5hbWU6My8yNC8yMDI1IDIxMmYyMmEyYzc5NDRmZmQ4ZDIzOTZlZjcwNGYzZTBhLHR5cGU6VHJpYWwsbWV0YTowLGhhc2g6WGxLQmxRM2Q1V29EanVjUG1MTk9zd1RMemNWdjUwNXV0ODRVSjNKODBaaTdwWVpaRFRyQXJOWEZiV0NzN1Ivbkw1NUVXaERQbDZOLzIxUDhOY3ZIWWE5RjRkV3FVaEZla0MzbnJvR2FMTHgveEZZbnY3dHE0dHR5NkVyUE0xdG13b3IxYlFXOWE0Smp5MjJGMitUb3p3bnhxR0pXQWtJakRxYWhyRWNIZllnPSxleHBpcnk6MjAyNS0wNC0yM30=");

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});


app.Run();