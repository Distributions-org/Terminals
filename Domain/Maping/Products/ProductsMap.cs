using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using AutoMapper;
using System.Threading.Tasks;
using Core.Domain.ProductTocustomer;

namespace Data.Maping.Customers
{
    class ProductMap : EntityTypeConfiguration<Core.Domain.Product>
    {
        public ProductMap()
        {
            Mapper.CreateMap<Product, Product>();


        }
    }
}
