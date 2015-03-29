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

    public class ReportsModel
    {
        public List<int> ProductIDs { get; set; }
        public int CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public ReportsModel()
        {
            ProductIDs = new List<int>();
        }
    }

    public class ProductAmountPerRound
    {
        public int ProductId { get; set; }
        public int RoundId { get; set; }
        public int TotalAmount { get; set; }
    }
}