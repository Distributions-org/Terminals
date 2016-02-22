using AutoMapper;
using Core.Domain.ProductTocustomer;

namespace Data.Maping.CustomerProduct
{
    public class CustomerProductMap
    {
        public CustomerProductMap()
        {
            Mapper.CreateMap<ProductCustomerTbl, ProductToCustomer>()
                .ForMember(p => p.dayType, b => b.MapFrom(z => (Core.Enums.DaysType.DayType)z.DayTypeID))
                .ForMember(a => a.CustomerName, b => b.MapFrom(z => new Data.Customer { CustomerID = z.CustomerID.Value }.CustomerName))
                .ForMember(a => a.ProductName, b => b.MapFrom(z => new Data.Product { ProductID = z.ProductID.Value }.ProductName));
        }
    }
}
