using System.Net;
using System.Web;
using System.Web.Mvc;
using Core.Domain.Customers;
using Core.Domain.Users;
using Core.Enums;
using Services.SessionManager;

namespace Distributions.Web.Authorize
{
    public class AuthorizeCustomerAttribute : AuthorizeAttribute
    {
        private readonly IDataPersistance<Customers> _customerStorage;

        public AuthorizeCustomerAttribute()
        {
            _customerStorage = DependencyResolver.Current.GetService<IDataPersistance<Customers>>();
        }

        // Custom property
        public string AccessRole { get; set; }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var customer = _customerStorage.ObjectValue;
            if (customer == null)
            {
                httpContext.Response.Redirect("~/Customer");
                httpContext.Response.End();    
            }
            
            return customer != null;

            //var isAuthorized = base.AuthorizeCore(httpContext) || httpContext.Session != null && httpContext.Session["User"] != null;
            //if (isAuthorized && !string.IsNullOrWhiteSpace(AccessRole))
            //{
            //    isAuthorized = (httpContext.Session["User"] as User).RoleID.ToString() == AccessRole;
            //}
            //if (!isAuthorized)
            //{
            //    return false;
            //}
            //return true;
        }
    }
}