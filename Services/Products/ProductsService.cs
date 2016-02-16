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
using System;

namespace Services
{
    public  class ProductsService : IProductsService
    {
        private readonly IRepository<Data.Product> _productsRepository;
        private readonly IRepository<Data.ProductCustomerTbl> _ProductCustomerRepository;
        private readonly IRepository<Data.ProductCustomerPriceTbl> _ProductCustomerPriceRepository;

        public ProductsService(IRepository<Data.Product> productsRepository, IRepository<ProductCustomerTbl> ProductCustomerRepository,IRepository<ProductCustomerPriceTbl> ProductCustomerPriceRepository)
        {
            _productsRepository = productsRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductCustomerPriceRepository = ProductCustomerPriceRepository;
        }

        public  FunctionReplay.functionReplay AddNewProduct(Core.Domain.Product newProduct)
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

        public FunctionReplay.functionReplay RemoveProductToCustomer(int productCustomerId)
        {
            return _ProductCustomerRepository.Delete(_ProductCustomerRepository.FindBy(x => x.ProductCustomerID == productCustomerId).FirstOrDefault());

        }

        public FunctionReplay.functionReplay AddProductTocustomer(ProductToCustomer addedProduct)
        {
            Mapper.CreateMap<ProductToCustomer, ProductCustomerTbl>()
                .ForMember(a => a.DayTypeID, b => b.MapFrom(c => (int)c.dayType));

            ProductCustomerTbl newProductToCustomer = Mapper.Map< ProductToCustomer,ProductCustomerTbl >(addedProduct);
            _ProductCustomerRepository.Add(newProductToCustomer);

            int currentProductCustomerId = _ProductCustomerRepository.FindBy(x => x.ProductID == newProductToCustomer.ProductID).OrderByDescending(x => x.ProductCustomerID).FirstOrDefault().ProductCustomerID;
            ProductCustomerPriceTbl currentPrice = new ProductCustomerPriceTbl();
            currentPrice.ProductCustomerID = currentProductCustomerId;
            currentPrice.Price = addedProduct.Cost;
            currentPrice.PriceDate = DateTime.Now;
            return _ProductCustomerPriceRepository.Add(currentPrice);


        }

        public FunctionReplay.functionReplay UpdateCustomerProductPrice(ProductToCustomer updateProduct)
        {
            Mapper.CreateMap<ProductToCustomer, ProductCustomerTbl>()
                .ForMember(a => a.DayTypeID, b => b.MapFrom(c => (int)c.dayType));

            ProductCustomerTbl current = Mapper.Map<ProductToCustomer, ProductCustomerTbl>(updateProduct);
            _ProductCustomerRepository.Update(current);

            ProductCustomerPriceTbl currentPrice = new ProductCustomerPriceTbl();
            currentPrice.ProductCustomerID = current.ProductCustomerID;
            currentPrice.Price = updateProduct.Cost;
            return _ProductCustomerPriceRepository.Add(currentPrice);
        }

        public Core.Domain.Product GetProductById(int ProductID)
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.productStatus, b => b.MapFrom(c => (ProductStatus.productStatus)c.ProductStatus));
            Data.Product currentProduct = _productsRepository.FindBy(x => x.ProductID == ProductID).FirstOrDefault();
            return Mapper.Map<Data.Product, Core.Domain.Product>(currentProduct);
        }

        public List<Core.Domain.Product> GetProductByStatus(ProductStatus.productStatus pStatus,int ManagerId)
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.productStatus, b => b.MapFrom(c => (ProductStatus.productStatus)c.ProductStatus));

            List<Data.Product> AllStatusProducts = _productsRepository.FindBy(x => x.ProductStatus == (int)pStatus && x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Product>, List<Core.Domain.Product>>(AllStatusProducts);
        }

        public List<Core.Domain.Product> GetProducts(int ManagerId)
        {
            Mapper.CreateMap<Data.Product, Core.Domain.Product>()
                .ForMember(a => a.ProductID, b => b.MapFrom(c =>c.ProductID));

            List<Data.Product> allProducts = _productsRepository.FindBy(x => x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Product>, List<Core.Domain.Product>>(allProducts);
        }
    }
}
