using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Enums;

namespace Core.Domain.CustomerProduct
{
    public class CustomerProduct:BaseEntity
    {
        public int productid { get; set; }
        public int customerid { get; set; }
        public DaysType.DayType daytype { get; set; }
        public double Cost { get; set; }
    }
}
