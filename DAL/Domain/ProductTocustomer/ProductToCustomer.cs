using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Enums;

namespace Core.Domain.ProductTocustomer
{
    public class ProductToCustomer
    {
        public int ProductCustomerID { get; set; }
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public DaysType.DayType dayType { get; set; }
        public double Cost { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }

    }   
}
