using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.Initializr.WebApi.Models;

namespace Steeltoe.InitializrWeb.Services
{
    public class ConfigurationRestService : IConfigurationService
    {
        private readonly HttpClient _httpClient;

        public ConfigurationRestService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Configuration> GetConfiguration()
        {
            return await _httpClient.GetJsonAsync<Configuration>("configuration");
        }
    }
}
