using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Reports
{
    public class ProductCustomerReport
    {
        public DateTime currentDate { get; set; }        
        public int DelieverySent { get; set; }
        public int DelieveryTaken { get; set; }
    }
}
