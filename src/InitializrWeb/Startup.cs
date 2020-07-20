using System;
using Blazorise;
using Blazorise.Bootstrap;
using Blazorise.Icons.FontAwesome;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Steeltoe.InitializrWeb.Services;

namespace Steeltoe.InitializrWeb
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration
        {
            get;
        }

        private InitializrApiOptions _apiOptions;

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<InitializrApiOptions>(Configuration.GetSection(InitializrApiOptions.InitializrApi));
            services.AddBlazorise(options =>
                    {
                    options.ChangeTextOnKeyPress = true;
                    })
            .AddBootstrapProviders()
                .AddFontAwesomeIcons();
            services.AddRazorPages();
            services.AddServerSideBlazor();
            _apiOptions = Configuration.GetSection(InitializrApiOptions.InitializrApi).Get<InitializrApiOptions>();
            var apiUri = _apiOptions.Uri;
            if (!apiUri.EndsWith('/'))
            {
                apiUri += '/';
            }
            apiUri += "api/";
            services.AddHttpClient<IConfigurationService,
                ConfigurationRestService>(client => client.BaseAddress = new Uri(apiUri));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            logger.LogInformation(_apiOptions.ToString());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.ApplicationServices
                .UseBootstrapProviders()
                .UseFontAwesomeIcons();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapBlazorHub();
                endpoints.MapFallbackToPage("/_Host");
            });
        }
    }
}
