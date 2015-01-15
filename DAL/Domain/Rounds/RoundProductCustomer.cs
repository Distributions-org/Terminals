using Core.Domain.ProductTocustomer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Rounds
{
    public class RoundProductCustomer
    {
        public ProductToCustomer CustomerRoundProduct { get; set; }
        public int Amount { get; set; }

        public int DeliveredAmount { get; set; }
    }
}
