using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.Initializr.Starter.Services;
using Steeltoe.Initializr.WebApi.Models.Metadata;
using Steeltoe.Initializr.WebApi.Models.Project;

namespace Steeltoe.Initializr.Starter.Pages
{
    public partial class Index
    {
        [Inject] public IMetadataService MetadataService { get; set; }

        public Configuration Configuration { get; set; }

        public Specification Specification { get; set; }

        public Exception Error { get; set; }

        protected override async Task OnInitializedAsync()
        {
            Error = null;
            try
            {
                Configuration = await MetadataService.GetConfiguration();
                Specification = new Specification();
            }
            catch (HttpRequestException e)
            {
                Error = e;
            }
        }
    }
}
