using posystem.ServiceInterface;
using posystem.ServiceInterface.Services;

var builder = WebApplication.CreateBuilder(args);

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

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});


app.Run();