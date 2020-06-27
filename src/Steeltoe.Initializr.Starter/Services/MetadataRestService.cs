using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Steeltoe.Initializr.WebApi.Models.Metadata;

namespace Steeltoe.Initializr.Starter.Services
{
    public class MetadataRestService : IMetadataService
    {
        private readonly HttpClient _httpClient;

        public MetadataRestService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Configuration> GetConfiguration()
        {
            return await _httpClient.GetJsonAsync<Configuration>("metadata");
        }
    }
}
