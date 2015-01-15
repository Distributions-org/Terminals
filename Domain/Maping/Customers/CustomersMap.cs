using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Customers;
using AutoMapper;

namespace Data.Maping.Customers
{
    public class CustomersMap : EntityTypeConfiguration<Core.Domain.Customers.Customers>
    {
        public CustomersMap()
        {
            Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
        }
    }
}
