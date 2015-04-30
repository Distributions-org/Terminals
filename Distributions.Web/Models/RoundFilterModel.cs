using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Distributions.Web.Models
{
    public class RoundFilterModel
    {
        public bool Today { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Email { get; set; }
        public int ManagerId { get; set; }
    }
}