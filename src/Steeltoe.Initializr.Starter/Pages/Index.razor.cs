using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.Initializr.Starter.Services;
using Steeltoe.Initializr.WebApi.Models;

namespace Steeltoe.Initializr.Starter.Pages
{
    public partial class Index
    {
        [Inject] public IConfigurationService ConfigurationService { get; set; }

        public Configuration Configuration { get; set; }

        public ProjectSpecification ProjectSpecification { get; set; }

        public Exception Error { get; set; }

        protected override async Task OnInitializedAsync()
        {
            Error = null;
            try
            {
                Configuration = await ConfigurationService.GetConfiguration();
                ProjectSpecification = new ProjectSpecification();
            }
            catch (HttpRequestException e)
            {
                Error = e;
            }
        }
    }
}
