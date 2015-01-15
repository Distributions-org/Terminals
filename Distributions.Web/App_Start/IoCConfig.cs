using System.Data.Entity;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Core.Data;
using Data;
using Distributions.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Services;
using Services.SessionManager;
using Services.Users;

namespace Distributions.Web
{
    public class IoCConfig
    {
        public static void RegisterDependencies()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            
            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
           // builder.RegisterType<IdentityDbContext>().InstancePerRequest();
            builder.RegisterModule(new AutofacWebTypesModule());

            builder.RegisterType<TerminalsEntities>().InstancePerRequest();

            //builder.RegisterType<UserStore<ApplicationUser>>().As<IUserStore<ApplicationUser>>();

            //builder.RegisterType<UserManager<ApplicationUser>>();

            //Register Services
            builder.RegisterGeneric(typeof(Repository<>)).As(typeof(IRepository<>)).InstancePerRequest();
            builder.RegisterGeneric(typeof(SessionDataPersistance<>)).As(typeof(IDataPersistance<>)).InstancePerRequest();
            builder.RegisterType<UsersService>().As<IUserService>().InstancePerRequest();
            builder.RegisterType<CustomerService>().As<ICustomerService>().InstancePerRequest();
            builder.RegisterType<ProductsService>().As<IProductsService>().InstancePerRequest();
            builder.RegisterType<RoundsService>().As<IRoundsService>().InstancePerRequest();

            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;

            
        }
    }
}