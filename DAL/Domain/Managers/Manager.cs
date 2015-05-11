using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Managers
{
    public class Manager:BaseEntity
    {
        public int ManagerID { get; set; }
        public string ManagerName { get; set; }
        public string ManagerHP { get; set; }
        public string ManagerPhone { get; set; }

    }
}
