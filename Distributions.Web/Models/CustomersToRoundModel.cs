using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Core.Domain.Rounds;

namespace Distributions.Web.Models
{
    public class CustomersToRoundModel
    {
        public int RoundId  { get; set; }
        public List<CustomerRound> RoundCustomers { get; set; }

        public CustomersToRoundModel()
        {
            RoundCustomers=new List<CustomerRound>();
        }
    }
}