using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using posystem.ServiceInterface;
using posystem.ServiceInterface.Services;
using System.Text;

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
builder.Services.AddAuthentication("Bearer") 
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost",   
            ValidAudience = "https://localhost", 
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my-very-secure-secret-key-with-32-bytes-long"))
        };
    });
services.AddAuthorization();
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

app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();   


// Configure ServiceStack License
ServiceStack.LicenseUtils.RegisterLicense("TRIAL30WEB-e3JlZjpUUklBTDMwV0VCLG5hbWU6NC8yMC8yMDI1IGQwOTIyYThjMDlkYTRkYzZhMTBhM2IxYjk4Mzk3YjhmLHR5cGU6VHJpYWwsbWV0YTowLGhhc2g6UEdnWTk5bU5wVC9JTHMvV2Y5UlpDSktQemhOcmR6SUdXdk1kbDZZM29hN08xYUdNQUZHWUYzVVVhWmhSVnNzTUZxbU5WbUZpR3E0d2Zjbm5CblFXc2k4UmloZnFNc2lUeU0rUUh1a29PWXRFdzExNXJWRGdaSnRuUmk3NFVEdVVxdmlrT1NjbmFRakt6cGZVVElraUo4REY5QlpLR0lpcGtYNlNueGJBZ01rPSxleHBpcnk6MjAyNS0wNS0yMH0=");

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});


app.Run();