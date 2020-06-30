using System.Threading.Tasks;
using Steeltoe.Initializr.WebApi.Models;

namespace Steeltoe.Initializr.Starter.Services
{
    public interface IConfigurationService
    {
        Task<Configuration> GetConfiguration();
    }
}
