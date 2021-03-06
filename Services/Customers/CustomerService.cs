﻿using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using Core.Data;
using Core.Domain.Managers;
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
using Customers = Core.Domain.Customers.Customers;

namespace Services.Users
{
    public  class CustomerService : ICustomerService
    {
        private readonly IRepository<Data.Customer> _CustomersRepository;
        private readonly IRepository<Data.Product> _ProductsRepository;
        private readonly IRepository<RoundsCustomerTbl> _roundsCustomerRepository;
        private readonly IRepository<ProductCustomerTbl> _ProductCustomerRepository;
        private readonly IRepository<ProductCustomerPriceTbl> _ProductCustomerPriceRepository;

        public CustomerService(IRepository<Data.Customer> CustomersRepository,
            IRepository<ProductCustomerTbl> ProductCustomerRepository, IRepository<Data.Product> ProductsRepository, IRepository<RoundsCustomerTbl> roundsCustomerRepository, IRepository<ProductCustomerPriceTbl> ProductCustomerPriceRepository)
        {
            _CustomersRepository = CustomersRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductsRepository = ProductsRepository;
            _roundsCustomerRepository = roundsCustomerRepository;
            _ProductCustomerPriceRepository = ProductCustomerPriceRepository;
        }

        public FunctionReplay.functionReplay AddNewCustomer(Core.Domain.Customers.Customers NewCustomer)
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customer>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));

            Data.Customer newCustomers = Mapper.Map<Core.Domain.Customers.Customers, Data.Customer>(NewCustomer);

            return _CustomersRepository.Add(newCustomers);
        }

        public List<Customers> GetValidCustomers(int? roundsCustomerID, int? ManagerId)
        {
            Mapper.Reset();
            if (roundsCustomerID != null && roundsCustomerID.Value > 0)
            {
                Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
               .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status))
               .ForMember(a => a.RoundCustomerStatus, b => b.MapFrom(c => _roundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundsCustomerID).Single().RoundCustomerStatus));
            }
            else
            {
                Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
                    .ForMember(a => a.custStatus,
                        b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus) z.Status));
            }
            List<Data.Customer> FoundCustomer = _CustomersRepository.FindBy(x => x.Status == 1 && x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Customer>, List<Core.Domain.Customers.Customers>>(FoundCustomer);
        }

        public List<Customers> GetAllCustomers(int? roundsCustomerID, int? ManagerId)
        {
            Mapper.Reset();
            if (roundsCustomerID != null && roundsCustomerID.Value > 0)
            {
                Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
               .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status))
               .ForMember(a => a.RoundCustomerStatus, b => b.MapFrom(c => _roundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundsCustomerID).Single().RoundCustomerStatus));
            }
            else
            {
                Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
                    .ForMember(a => a.custStatus,
                        b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            }
            List<Data.Customer> FoundCustomer = _CustomersRepository.FindBy(x => x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Customer>, List<Core.Domain.Customers.Customers>>(FoundCustomer);
        }

        public Core.Domain.Customers.Customers GetCustomersById(int id)
        {
            Mapper.Reset();
            Mapper.CreateMap<Data.Customer, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            Data.Customer FoundCustomer = _CustomersRepository.FindBy(x => x.CustomerID==id).FirstOrDefault();
            var customer = _roundsCustomerRepository.FindBy(x => x.CustomerID == id);
            return Mapper.Map<Data.Customer, Core.Domain.Customers.Customers>(FoundCustomer);
        }

        public Customers LoginCustomer(string email, string password)
        {
            Mapper.CreateMap<Data.Customer,Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(c => (int)c.Status));

            return Mapper.Map<Data.Customer,Customers>(_CustomersRepository.FindBy(x => x.Email == email && x.Password == password).FirstOrDefault());
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
            foreach (var item in allcustomers)
            {
                int currentProductCustomerId = _ProductCustomerRepository.FindBy(x => x.ProductID == item.ProductID && x.CustomerID == item.CustomerID).OrderByDescending(x => x.ProductCustomerID).FirstOrDefault().ProductCustomerID;
                double Cost = _ProductCustomerPriceRepository.FindBy(x => x.ProductCustomerID == currentProductCustomerId).OrderByDescending(x => x.PriceDate).FirstOrDefault().Price.Value;
                item.Cost = Cost;
            }

            return allcustomers;
            
        }



        public FunctionReplay.functionReplay UpdateCustomer(int CustomerID,Core.Domain.Customers.Customers UpdateCustomer)
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customer>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));
            Data.Customer customerToUpdate = _CustomersRepository.FindBy(x => x.CustomerID == CustomerID).FirstOrDefault();
            customerToUpdate.CustomerName = UpdateCustomer.CustomerName;
            customerToUpdate.CustomerHP = UpdateCustomer.CustomerHP;
            customerToUpdate.Status = (int)UpdateCustomer.custStatus;
            customerToUpdate.ManagerId = UpdateCustomer.ManagerId;

            return _CustomersRepository.Update(customerToUpdate);
        }
    }
}
