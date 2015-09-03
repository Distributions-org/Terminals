using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Core.Domain.Customers;
using Core.Domain.Users;
using Microsoft.AspNet.Identity.Owin;
using Services.SessionManager;

namespace Distributions.Web.Controllers
{
    public abstract class BaseCustomerApiController : ApiController
    {


        private readonly IDataPersistance<Customers> _customerStorage;

        protected BaseCustomerApiController()
        {
            _customerStorage = DependencyResolver.Current.GetService<IDataPersistance<Customers>>();
            CheckIfLogin();
        }

        private  void CheckIfLogin()
        {
            if (_customerStorage.ObjectValue == null)
            {
                _customerStorage.ObjectValue = null;
                HttpContext.Current.Response.Redirect("/Customer", false);
                HttpContext.Current.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                HttpContext.Current.Response.End(); 
               
            }
        }

        protected bool ChackManagerId(int id)
        {
            return id == _customerStorage.ObjectValue.ManagerId;
        }
        
    }
}