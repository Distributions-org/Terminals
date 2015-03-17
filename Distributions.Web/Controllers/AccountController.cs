using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Security;
using Core.Domain.Users;
using Core.Enums;
using Distributions.Web.Models;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using Services;
using Services.SessionManager;

namespace Distributions.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly IUserService _userService;
        private readonly IDataPersistance<User> _userStorage;

        public AccountController(IUserService userService, IDataPersistance<User> userStorage)
        {
            _userService = userService;
            _userStorage = userStorage;
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
            var model = _userService.LoginUser(login.Email, login.Password);
            if (ModelState.IsValid)
            {
                if (model != null)
                {
                    _userStorage.ObjectValue = model;
                    if (model.RoleID == UserRoles.userRoles.Worker)
                    {
                        return RedirectToLocal("/#/worker");
                    }
                 return RedirectToLocal(returnUrl);
                }
            }
            ModelState.AddModelError("", "דואל או סיסמה לא תקניים");
            return View(login);
        }

        public bool IsAuthenticated()
        {
            return _userStorage.ObjectValue != null;
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
            _userStorage.ObjectValue = null;
            return RedirectToAction("Index", "Home");
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }
    }
}
