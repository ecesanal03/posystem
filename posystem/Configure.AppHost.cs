using posystem.ServiceInterface;

[assembly: HostingStartup(typeof(posystem.AppHost))]

namespace posystem;

public class AppHost() : AppHostBase("posystem"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig
            {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "http://localhost:5173/"
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "http://localhost:5001/"
                    : null,
            });
        });

    public override void Configure()
    {
        // Configure ServiceStack, Run custom logic after ASP.NET Core Startup
        SetConfig(new HostConfig {
        });
    }

    public static void RegisterKey() => Licensing.RegisterLicense("...");
}