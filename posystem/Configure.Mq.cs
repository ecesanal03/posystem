using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack;
using ServiceStack.Messaging;
using ServiceStack.Redis;
using ServiceStack.Messaging.Redis;

[assembly: HostingStartup(typeof(posystem.ConfigureMq))]

namespace posystem;
/**
    Register Services you want available via MQ in your AppHost, e.g:
    var mqServer = appHost.Resolve<IMessageService>();
    mqServer.RegisterHandler<MyRequest>(ExecuteMessage);
*/
public class ConfigureMq : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IMessageService>(c =>
                new RedisMqServer(c.GetRequiredService<IRedisClientsManager>()));
        })
        .ConfigureAppHost(afterAppHostInit: appHost => {
            appHost.Resolve<IMessageService>().Start();
        });
}
