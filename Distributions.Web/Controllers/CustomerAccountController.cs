using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Security;
using Core.Domain.Customers;
using Core.Domain.Users;
using Core.Enums;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using Services;
using Services.SessionManager;
using Services.Users;

namespace Distributions.Web.Controllers
{
    public class CustomerAccountController : Controller
    {
        private readonly ICustomerService _customerService;
        private readonly IDataPersistance<Customers> _customerStorage;

        public CustomerAccountController(ICustomerService customerService, IDataPersistance<Customers> customerStorage)
        {
            _customerService = customerService;
            _customerStorage = customerStorage;
        }

        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel login, string returnUrl)
        {
            var model = _customerService.LoginCustomer(login.Email, login.Password);
            if (ModelState.IsValid)
            {
                if (model != null)
                {
                    _customerStorage.ObjectValue = model;
                   
                 return RedirectToLocal(returnUrl);
                }
            }
            ModelState.AddModelError("", "דואל או סיסמה לא תקניים");
            return View(login);
        }

        public bool IsAuthenticated()
        {
            return _customerStorage.ObjectValue != null;
            //return Request.IsAuthenticated;
        }

        public string GetAntiForgeryToken()
        {
            string cookieToken, formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            return JsonConvert.SerializeObject(new { antiForgeryToken = formToken });
        }
        
        // POST: /Account/LogOff
        [HttpPost]
        public ActionResult LogOff()
        {
            _customerStorage.ObjectValue = null;
            return RedirectToRoute("Customer");
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToRoute("CustomerCreateRound");
        }
        [AuthorizeCustomer]
        public ActionResult CreateRound()
        {
            return View();
        }
        
    }
}
