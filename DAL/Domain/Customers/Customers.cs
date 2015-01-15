using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Customers
{
    public class Customers:BaseEntity
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerHP { get; set; }
        public Core.Enums.CustomerStatus.customerStatus custStatus { get; set; }
    }
}
