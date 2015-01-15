using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Distributions.Web.Startup))]
namespace Distributions.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
