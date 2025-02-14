using ServiceStack;

[assembly: HostingStartup(typeof(posystem.ConfigureServerEvents))]

namespace posystem;

public class ConfigureServerEvents : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new ServerEventsFeature());
        });
}
