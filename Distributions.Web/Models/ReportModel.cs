using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Distributions.Web.Models
{
    public class ReportModel
    {
        public List<int> ProductIDs { get; set; }
        public int CustomerId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int EndYear { get; set; }
        public int EndMonth { get; set; }

        public ReportModel()
        {
            ProductIDs=new List<int>();
        }
    }
}