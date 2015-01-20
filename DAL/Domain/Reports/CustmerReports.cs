using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Reports
{
    public class CustmerReports
    {
        public List<ProductCustomerReport> AllCustomerProductReports { get; set; }
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public int SumOfProducts { get; set; }
        public double TotalSum { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public double Cost { get; set; }

        public CustmerReports()
        {
            AllCustomerProductReports = new List<ProductCustomerReport>();
        }
    }
}
