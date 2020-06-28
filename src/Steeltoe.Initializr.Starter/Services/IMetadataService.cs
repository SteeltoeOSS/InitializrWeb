using System.Threading.Tasks;
using Steeltoe.Initializr.WebApi.Models.Metadata;

namespace Steeltoe.Initializr.Starter.Services
{
    public interface IMetadataService
    {
        Task<Configuration> GetConfiguration();
    }
}
