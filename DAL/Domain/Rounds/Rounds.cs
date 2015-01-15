using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Users;


namespace Core.Domain.Rounds
{
    public class Rounds:BaseEntity
    {
        public int RoundID { get; set; }
        public string RoundName { get; set; }
        public DateTime RoundDate { get; set; }
        public List<User> RoundUser { get; set; }
        public List<CustomerRound> custRound { get; set; }
    }
}
