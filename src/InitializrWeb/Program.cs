using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Steeltoe.InitializrWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });


        /// <summary>
        /// Program "About" details, such as version.
        /// </summary>
        public class About
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="About"/> class.
            /// </summary>
            public About()
            {
                Name = typeof(Program).Namespace ?? "unknown";
                Vendor = "SteeltoeOSS/VMware";
                ProductUrl = "https://github.com/SteeltoeOSS/InitializrApi/";
                var versionAttr = typeof(Program).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();
                if (versionAttr != null)
                {
                    var fields = versionAttr.InformationalVersion.Split('+');
                    Version = fields[0];
                    Commit = fields.Length > 1 ? fields[1] : "unknown";
                }
            }

            /// <summary>
            /// Gets the program name.
            /// </summary>
            public string Name { get; }

            /// <summary>
            /// Gets the program vendor.
            /// </summary>
            public string Vendor { get; }

            /// <summary>
            /// Gets the program product URL.
            /// </summary>
            public string ProductUrl { get; }

            /// <summary>
            /// Gets the program version.
            /// </summary>
            public string Version { get; }

            /// <summary>
            /// Gets the program build source control commit ID.
            /// </summary>
            public string Commit { get; }
        }
    }
}
