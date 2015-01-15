using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Enums;

namespace Core.Domain
{
    public class Product:BaseEntity
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public ProductStatus.productStatus productStatus { get; set; }
    }
}
