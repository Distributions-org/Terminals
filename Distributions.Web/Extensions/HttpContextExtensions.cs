using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.SessionState;
using Core.Domain.Users;

namespace Distributions.Web.Extensions
{
    public static class HttpContextExtensions
    {
        public static User GetUser(this HttpSessionState session)
        {
            return session["User"] as User;
            
        }
    }
}