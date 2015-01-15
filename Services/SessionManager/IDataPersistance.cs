using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.SessionManager
{
    public interface IDataPersistance<T>
    {
        T ObjectValue { get; set; }
    }
}
