using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.InitializrApi.Models;
using Steeltoe.InitializrWeb.Services;

namespace Steeltoe.InitializrWeb.Pages
{
    public partial class ProjectSpecificationPage
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
