﻿using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Core.Domain.Users;
using Core.Enums;
using Distributions.Web.Authorize;
using Distributions.Web.Extensions;
using Distributions.Web.Models;
using Distributions.Web.Utility;
using Newtonsoft.Json.Schema;
using Services;
using Services.SessionManager;
using HttpContextExtensions = Distributions.Web.Extensions.HttpContextExtensions;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser]
    public class AdminController : ApiController
    {
        private readonly IUserService _userService;
        private readonly IDataPersistance<User> _userStorage;
        
        public AdminController(IUserService  userService, IDataPersistance<User> userStorage)
        {
            this._userService = userService;
            _userStorage = userStorage;
        }


        // GET: api/Admin
         [AuthorizeUser(AccessRole = "Admin")]
        [Route("Admin")]
        public List<ManagerUserViewModel> Get()
         {
             var allUsers = _userService.GetAllUsers();
             var roles = allUsers.Select(x => x.RoleID.ToString()).ToArray();

            var viewModels = new List<ManagerUserViewModel>();

            foreach (var user in allUsers)
            {
                viewModels.Add(new ManagerUserViewModel
                {
                    UserId = user.UserID.ToString(),
                    UserName = user.FirstName +" "+ user.LastName,
                    Role = user.RoleID.ToString()
                });
            }

            return viewModels;
        }

        
        [Route("SignIn")]
        [HttpGet]
        public HttpResponseMessage SignIn()
        {
            var user = _userStorage.ObjectValue;
            if (user != null)
                return Request.CreateResponse(HttpStatusCode.OK, new {
                    userName = user.FirstName +" "+ user.LastName,
                    isAdmin = user.RoleID.ToString() == "Admin" });

            return null;
        }

        // GET: api/Admin/5
        public string Get(int id)
        {
            return "value";
        }

        
        [Route("GetRoles")]
        [HttpGet]
        [AuthorizeUser(AccessRole = "Admin")]
        public HttpResponseMessage GetRoles()
        {
            var roles = new Dictionary<int, string>() { { 1, "Admin" }, { 2, "Worker" } }; //_identityDbContext.Roles.Where(x=>x.Name!="Admin").ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { Roles = roles });
        }

        //// POST: api/Admin
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/Admin/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/Admin/5
        //public void Delete(int id)
        //{
        //}


        [Route("Register")]
        [AuthorizeUser(Roles = "Admin")]
        public HttpResponseMessage Register(RegisterViewModel model)
        {
            var errors = new List<string>();
            errors = ModelErrorChecker.Check(ModelState);
            if (errors.Count == 0 && model.Role!=0)
            {
                if (ModelState.IsValid)
                {
                    if (_userService.GetAllUsers().Any(x=>x.Email==model.Email)==false)
                    {
                        var  result = _userService.AddNewUser(new User
                        {
                            Email = model.Email,
                            FirstName = model.FirstName,
                            LastName = model.LastName,
                            Password = model.Password,
                            RoleID = (UserRoles.userRoles)model.Role
                        });
                        //var result = await UserManager.CreateAsync(user, model.Password);
                        if (result.ToString()=="Success")
                        {
                            //var newUser = UserManager.FindByEmail(model.Email);
                            //await UserManager.AddToRoleAsync(newUser.Id, model.Role);
                            //await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                        return Request.CreateResponse(HttpStatusCode.NotAcceptable, result.ToString());
                    }
                    return Request.CreateResponse(HttpStatusCode.NotAcceptable, "Email address is already in use.");
                }
            }
            else
                return Request.CreateResponse(HttpStatusCode.NotAcceptable, errors);
            return Request.CreateResponse(HttpStatusCode.OK);
        }


    }
}
