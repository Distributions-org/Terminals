using System.Web;
using System.Web.Mvc;
using Core.Domain.Users;
using Core.Enums;
using Services.SessionManager;

namespace Distributions.Web.Authorize
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {
        private readonly IDataPersistance<User> _userStorage;

        public AuthorizeUserAttribute()
        {
            _userStorage = DependencyResolver.Current.GetService<IDataPersistance<User>>();
        }

        // Custom property
        public string AccessRole { get; set; }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var user = _userStorage.ObjectValue;
            return user != null;

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