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
        public string Email { get; set; }
        public string Password { get; set; }
        public Core.Enums.CustomerStatus.customerStatus custStatus { get; set; }
        public bool RoundCustomerStatus { get; set; }
        public int ManagerId { get; set; }
    }
}
