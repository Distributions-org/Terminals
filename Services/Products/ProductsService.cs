using System.Collections.Generic;
using System.Linq;
using Core.Data;
using Core.Domain.Persons;
using Core.Domain.Users;
using Data;
using Core.MD5;
using Core.Enums;
using Core.Domain;
using AutoMapper;
using Core.Domain.ProductTocustomer;
using Core.Domain;

namespace Services
{
    public  class ProductsService : IProductsService
    {
        private readonly IRepository<Data.Product> _productsRepository;
        private readonly IRepository<Data.ProductCustomerTbl> _ProductCustomerRepository;

        public ProductsService(IRepository<Data.Product> productsRepository, IRepository<ProductCustomerTbl> ProductCustomerRepository)
        {
            _productsRepository = productsRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
        }

        public FunctionReplay.functionReplay AddNewProduct(Core.Domain.Product newProduct)
        {
            Mapper.CreateMap<Core.Domain.Product, Data.Product>()
                .ForMember(a => a.ProductStatus,b => b.MapFrom(c => (ProductStatus.productStatus)c.productStatus));
            Data.Product productToInsert = Mapper.Map<Core.Domain.Product, Data.Product>(newProduct);
            return _productsRepository.Add(productToInsert);
        }

        public FunctionReplay.functionReplay UpdateProduct(Core.Domain.Product Producttoupdate)
        {
            Mapper.CreateMap<Core.Domain.Product, Data.Product>()
                .ForMember(a => a.ProductStatus, b => b.MapFrom(c => (int)c.productStatus));
            Data.Product currentProduct = Mapper.Map<Core.Domain.Product, Data.Product>(Producttoupdate);
            return _productsRepository.Update(currentProduct);
        }

        public FunctionReplay.functionReplay RemoveProductToCustomer(int ProductCustomerID)
        {
            return _ProductCustomerRepository.Delete(_ProductCustomerRepository.FindBy(x => x.ProductCustomerID == ProductCustomerID).FirstOrDefault());

        }

        public FunctionReplay.functionReplay AddProductTocustomer(ProductToCustomer addedProduct)
        {
            Mapper.CreateMap<ProductToCustomer, ProductCustomerTbl>()
                .ForMember(a => a.DayTypeID, b => b.MapFrom(c => (int)c.dayType));

            ProductCustomerTbl newProductToCustomer = Mapper.Map< ProductToCustomer,ProductCustomerTbl >(addedProduct);
            return _ProductCustomerRepository.Add(newProductToCustomer);
        }

        public FunctionReplay.functionReplay UpdateCustomerProductPrice(ProductToCustomer updateProduct)
        {
            Mapper.CreateMap<ProductToCustomer, ProductCustomerTbl>()
                .ForMember(a => a.DayTypeID, b => b.MapFrom(c => (int)c.dayType));

            ProductCustomerTbl current = Mapper.Map<ProductToCustomer, ProductCustomerTbl>(updateProduct);
            return _ProductCustomerRepository.Update(current);
        }

        public Core.Domain.Product GetProductById(int ProductID)
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.productStatus, b => b.MapFrom(c => (ProductStatus.productStatus)c.ProductStatus));
            Data.Product currentProduct = _productsRepository.FindBy(x => x.ProductID == ProductID).FirstOrDefault();
            return Mapper.Map<Data.Product, Core.Domain.Product>(currentProduct);
        }

        public List<Core.Domain.Product> GetProductByStatus(ProductStatus.productStatus pStatus)
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.productStatus, b => b.MapFrom(c => (ProductStatus.productStatus)c.ProductStatus));

            List<Data.Product> AllStatusProducts = _productsRepository.FindBy(x => x.ProductStatus == (int)pStatus).ToList();
            return Mapper.Map<List<Data.Product>, List<Core.Domain.Product>>(AllStatusProducts);
        }

        public List<Core.Domain.Product> GetProducts()
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.ProductID, b => b.MapFrom(c =>c.ProductID));

            List<Data.Product> allProducts = _productsRepository.GetAll().ToList();
            return Mapper.Map<List<Data.Product>, List<Core.Domain.Product>>(allProducts);
        }
    }
}
