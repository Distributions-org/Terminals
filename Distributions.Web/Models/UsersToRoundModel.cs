using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Core.Domain.Users;

namespace Distributions.Web.Models
{
    public class UsersToRoundModel
    {
        public int RoundId { get; set; }
        public List<User> RoundUser { get; set; }
    }
}