// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information.

namespace Steeltoe.Initializr.WebApi.Models
{
    /// <summary>
    /// A model of the specification used to generate a project.
    /// </summary>
    public sealed class ProjectSpecification
    {
        public string ProjectName { get; set; }

        public string ProjectDescription { get; set; }

        public string SteeltoeReleaseId { get; set; }

        public string DotnetFrameworkTargetId { get; set; }

        public string DotnetTemplateId { get; set; }

        public string DotnetLanguageId { get; set; }
    }
}
