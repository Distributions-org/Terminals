using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Core.Domain.Users;
using Microsoft.AspNet.Identity.Owin;
using Services.SessionManager;

namespace Distributions.Web.Controllers
{
    public class BaseApiController : ApiController
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

       
        private readonly IDataPersistance<User> _userStorage;
       
        protected BaseApiController()
        {
            _userStorage = DependencyResolver.Current.GetService<IDataPersistance<User>>();
            CheckIfLogin();
        }

        private  void CheckIfLogin()
        {
            if (_userStorage.ObjectValue == null)
            {
                _userStorage.ObjectValue = null;
                HttpContext.Current.Response.Redirect("/", false);
                HttpContext.Current.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                HttpContext.Current.Response.End(); 
               
            }
        }
        //public ApplicationUserManager UserManager
        //{
        //    get
        //    {
        //        return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
        //    }
        //    private set
        //    {
        //        _userManager = value;
        //    }
        //}
        //public ApplicationSignInManager SignInManager
        //{
        //    get
        //    {
        //        return _signInManager ?? Request.GetOwinContext().Get<ApplicationSignInManager>();
        //    }
        //    private set
        //    {
        //        _signInManager = value;
        //    }
        //}
    }
}