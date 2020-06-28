using System.Net.Http;
using System.Threading.Tasks;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Steeltoe.Initializr.Starter.Pages;
using Steeltoe.Initializr.Starter.Services;
using Steeltoe.Initializr.WebApi.Models.Metadata;
using Xunit;

namespace Steeltoe.Initializr.Starter.Test
{
    public class IndexTest : TestContext
    {
        [Fact]
        public void ConnectionError()
        {
            // Arrange
            var metadataServiceMock = new Mock<IMetadataService>();
            metadataServiceMock.Setup(svc => svc.GetConfiguration())
                .Throws(new HttpRequestException("Something weird is going on"));
            Services.AddSingleton(metadataServiceMock.Object);

            // Act
            var page = RenderComponent<Index>();

            // Assert
            var expectedHtml = @"<h1>Steeltoe Initializr</h1>
                                 <div class=""error"">
                                     Cannot connect to Web API: Something weird is going on
                                 </div>";
            page.MarkupMatches(expectedHtml);
        }

        [Fact]
        public void PageLoading()
        {
            // Arrange
            var metadataServiceMock = new Mock<IMetadataService>();
            metadataServiceMock.Setup(svc => svc.GetConfiguration())
                .Returns(new TaskCompletionSource<Configuration>().Task);
            Services.AddSingleton(metadataServiceMock.Object);

            // Act
            var page = RenderComponent<Index>();

            // Assert
            var expectedHtml = @"<h1>Steeltoe Initializr</h1>
                                 <div class=""spinner""></div>";
            page.MarkupMatches(expectedHtml);
        }
    }
}
