using Microsoft.IdentityModel.Tokens;
using posystem.ServiceInterface;
using ServiceStack.Api.OpenApi;
using ServiceStack.Auth;
using System.Text;

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
        Plugins.Add(new OpenApiFeature());

        Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[]
        {
            new JwtAuthProvider(AppSettings)
            {
                AuthKey = Encoding.UTF8.GetBytes("my-very-secure-secret-key-with-32-bytes-long"),
                RequireSecureConnection = false,
                UseTokenCookie = false,
                PopulateSessionFilter = (session, payload, req) =>
                {
                    if (payload.TryGetValue("email", out var email))
                    {
                        session.Email = email.ToString();

                    }
                }
            }
        }));

        // Configure ServiceStack, Run custom logic after ASP.NET Core Startup
        SetConfig(new HostConfig {
            UseHttpsLinks = true,
        });
    }

    public static void RegisterKey() => Licensing.RegisterLicense("...");
}