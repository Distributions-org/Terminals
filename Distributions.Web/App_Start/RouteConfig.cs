using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Distributions.Web.Infrastructures;

namespace Distributions.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
               name: "Customer",
               url: "Customer",
               defaults: new { controller = "CustomerAccount", action = "Login" }
           );
            routes.MapRoute(
               name: "CustomerCreateRound",
               url: "CustomerCreateRound",
               defaults: new { controller = "CustomerAccount", action = "CreateRound" }
           );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

           
            //RouteTable.Routes.MapHttpRoute(
            //      name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //     defaults: new { id = RouteParameter.Optional }
            //).RouteHandler = new SessionStateRouteHandler();
        }
    }
}
