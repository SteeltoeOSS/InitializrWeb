using System;
using System.Net.Http;
using System.Threading.Tasks;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Steeltoe.InitializrApi.Models;
using Steeltoe.InitializrWeb.Pages;
using Steeltoe.InitializrWeb.Services;
using Xunit;

namespace Steeltoe.InitializrWeb.Test
{
    public class ProjectSpecificationPageTest : TestContext
    {
        [Fact]
        public void ConnectionError()
        {
            // Arrange
            var metadataServiceMock = new Mock<IConfigurationService>();
            metadataServiceMock.Setup(svc => svc.GetConfiguration())
                .Throws(new HttpRequestException("Something weird is going on"));
            Services.AddSingleton(metadataServiceMock.Object);

            // Act
            var page = RenderComponent<ProjectSpecificationPage>();

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
            var metadataServiceMock = new Mock<IConfigurationService>();
            metadataServiceMock.Setup(svc => svc.GetConfiguration())
                .Returns(new TaskCompletionSource<Configuration>().Task);
            Services.AddSingleton(metadataServiceMock.Object);

            // Act
            var page = RenderComponent<ProjectSpecificationPage>();

            // Assert
            var expectedHtml = @"<h1>Steeltoe Initializr</h1>
                                 <div class=""spinner""></div>";
            page.MarkupMatches(expectedHtml);
        }
    }
}
