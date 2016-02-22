using System.Data.Entity.ModelConfiguration;
using AutoMapper;

namespace Data.Maping.Customers
{
    public class CustomersMap : EntityTypeConfiguration<Core.Domain.Customers.Customers>
    {
        public CustomersMap()
        {
            Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
        }
    }
}
