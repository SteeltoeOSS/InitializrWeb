using System.Threading.Tasks;
using Steeltoe.InitializrApi.Models;

namespace Steeltoe.InitializrWeb.Services
{
    public interface IConfigurationService
    {
        Task<Configuration> GetConfiguration();
    }
}
