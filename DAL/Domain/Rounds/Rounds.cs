using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Users;
using Core.Enums;


namespace Core.Domain.Rounds
{
    public class Rounds:BaseEntity
    {
        public int RoundID { get; set; }
        public string RoundName { get; set; }
        public DateTime RoundDate { get; set; }
        public IEnumerable<User> RoundUser { get; set; }
        public IEnumerable<CustomerRound> custRound { get; set; }
        public RoundStatus.roundStatus roundStatus { get; set; }
        public int ManagerId { get; set; }

        public Rounds()
        {
            roundStatus = RoundStatus.roundStatus.Open;
        }
    }
}
