using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Rounds
{
    public class CustomerRound
    {
        public Customers.Customers customerRound { get; set; }
        public IEnumerable<RoundProductCustomer> roundcustomerProducts { get; set; }
    }
}
