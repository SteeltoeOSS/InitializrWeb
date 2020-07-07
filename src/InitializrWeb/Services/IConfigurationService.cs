using System.Threading.Tasks;
using Steeltoe.Initializr.WebApi.Models;

namespace Steeltoe.InitializrWeb.Services
{
    public interface IConfigurationService
    {
        Task<Configuration> GetConfiguration();
    }
}
