using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using posystem.ServiceInterface.Services;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

[assembly: HostingStartup(typeof(posystem.ConfigureDb))]

namespace posystem;

public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                context.Configuration.GetConnectionString("DefaultConnection")
                ?? "Server=cougarcatalogdb.co3uc2om093h.us-east-1.rds.amazonaws.com;User Id=admin;Password=Cougarcatalog2025$;Database=cougarcatalogdb;Pooling=true;MinPoolSize=0;MaxPoolSize=200",
                MySqlDialect.Provider));
        })
        .ConfigureAppHost(appHost => {
            // Retrieve the EmployeeService from DI and insert a role manager when the application starts
            var employeeService = appHost.Resolve<EmployeeService>();
            employeeService.InsertManager("Alex", "Orwell", "alex.orwell@gmail.com", "SecurePassword123!");
        });
}
