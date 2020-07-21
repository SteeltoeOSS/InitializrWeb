using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.InitializrApi.Models;
using Steeltoe.InitializrWeb.Services;

namespace Steeltoe.InitializrWeb.Shared
{
    partial class NavMenu
    {
        [Inject] public IConfigurationService ConfigurationService { get; set; }

        public Configuration Configuration { get; set; }

        protected override async Task OnInitializedAsync()
        {
            Configuration = await ConfigurationService.GetConfiguration();
        }
    }
}
