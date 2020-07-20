using System;

namespace Steeltoe.InitializrWeb
{
    public class InitializrApiOptions
    {
        public const string InitializrApi = "Initializr:Api";

        public string Uri { get; set; }

        public override string ToString()
        {
            return $"InitializrApiOptions[Uri={Uri}]";
        }
    }
}
