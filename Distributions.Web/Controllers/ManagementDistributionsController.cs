using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData.Extensions;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Microsoft.AspNet.Identity.Owin;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser(Roles = "Admin")]
    public class ManagementDistributionsController : BaseApiController
    {
        [Route("Distributors")]
        public HttpResponseMessage Get()
        {
            if (UserManager != null)
            {
                var users = UserManager.Users.ToList();
                var distributors = users.Where(x => x.Roles != null && x.Roles.First().RoleId == "2").ToList();
                if (distributors.Any())
                {
                      var viewModels = new List<ManagerUserViewModel>();
                    distributors.ForEach(user => viewModels.Add(new ManagerUserViewModel { UserId = user.Id, UserName = user.UserName, Role =  user.Roles.First().RoleId }));
                    return Request.CreateResponse(HttpStatusCode.OK, viewModels);
                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "distributors not found");
            }
            return Request.CreateErrorResponse(HttpStatusCode.Forbidden, new Exception("error"));
        }
    }
}
