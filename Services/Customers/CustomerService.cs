﻿using System.Collections.Generic;
using System.Linq;
using Core.Data;
using Core.Domain.Persons;
using Core.Domain.Users;
using Data;
using Core.MD5;
using Core.Enums;
using Core.Domain.ProductTocustomer;
using Data.Maping.CustomerProduct;
using AutoMapper;
using Core.Domain;
using Core.Domain.Customers;

namespace Services.Users
{
    public  class CustomerService : ICustomerService
    {
        private readonly IRepository<Data.Customers> _CustomersRepository;
        private readonly IRepository<Data.Product> _ProductsRepository;
        private readonly IRepository<ProductCustomerTbl> _ProductCustomerRepository;

        public CustomerService(IRepository<Data.Customers> CustomersRepository,
            IRepository<ProductCustomerTbl> ProductCustomerRepository, IRepository<Data.Product> ProductsRepository)
        {
            _CustomersRepository = CustomersRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductsRepository = ProductsRepository;
        }

        public FunctionReplay.functionReplay AddNewCustomer(Core.Domain.Customers.Customers NewCustomer)
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customers>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));

            Data.Customers newCustomers = Mapper.Map<Core.Domain.Customers.Customers, Data.Customers>(NewCustomer);

            return _CustomersRepository.Add(newCustomers);
        }

        public List<Core.Domain.Customers.Customers> GetValidCustomers()
        {
            Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            List<Data.Customers> FoundCustomer = _CustomersRepository.FindBy(x => x.Status == 1).ToList();
            return Mapper.Map<List<Data.Customers>, List<Core.Domain.Customers.Customers>>(FoundCustomer);
        }

        public Core.Domain.Customers.Customers GetCustomersById(int id)
        {
            Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            Data.Customers FoundCustomer = _CustomersRepository.FindBy(x => x.CustomerID==id).FirstOrDefault();
            return Mapper.Map<Data.Customers, Core.Domain.Customers.Customers>(FoundCustomer);
        }

        public List<ProductToCustomer> GetAllCustomerProducts(int CustomerID)
        {
            Mapper.Reset();
            //Mapper.AssertConfigurationIsValid();
            var allCustomerProducts = _ProductCustomerRepository.FindBy(x => x.CustomerID == CustomerID).ToList();

            Mapper.CreateMap<ProductCustomerTbl, ProductToCustomer>()
                .ForMember(a => a.ProductName, b => b.MapFrom(z => _ProductsRepository.FindBy(x => x.ProductID == z.ProductID).FirstOrDefault().ProductName))
                .ForMember(p => p.dayType, b => b.MapFrom(z => (Core.Enums.DaysType.DayType)z.DayTypeID.Value))
                .ForMember(a => a.CustomerName, b => b.MapFrom(z => _CustomersRepository.FindBy(x => x.CustomerID == z.CustomerID).FirstOrDefault().CustomerName));

            
            var allcustomers = Mapper.Map<List<ProductCustomerTbl>, List<ProductToCustomer>>(allCustomerProducts);
            return allcustomers;
            
        }



        public FunctionReplay.functionReplay UpdateCustomer(int CustomerID,Core.Domain.Customers.Customers UpdateCustomer)
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customers>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));
            Data.Customers customerToUpdate = _CustomersRepository.FindBy(x => x.CustomerID == CustomerID).FirstOrDefault();
            customerToUpdate.CustomerName = UpdateCustomer.CustomerName;
            customerToUpdate.CustomerHP = UpdateCustomer.CustomerHP;
            customerToUpdate.Status = (int)UpdateCustomer.custStatus;

            return _CustomersRepository.Update(customerToUpdate);
        }
    }
}
