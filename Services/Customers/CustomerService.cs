using System.Collections.Generic;
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
        private readonly IRepository<Data.Customers> _CustomersRepository;
        private readonly IRepository<Data.Product> _ProductsRepository;
        private readonly IRepository<RoundsCustomerTbl> _roundsCustomerRepository;
        private readonly IRepository<ProductCustomerTbl> _ProductCustomerRepository;

        public CustomerService(IRepository<Data.Customers> CustomersRepository,
            IRepository<ProductCustomerTbl> ProductCustomerRepository, IRepository<Data.Product> ProductsRepository, IRepository<RoundsCustomerTbl> roundsCustomerRepository)
        {
            _CustomersRepository = CustomersRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductsRepository = ProductsRepository;
            _roundsCustomerRepository = roundsCustomerRepository;
        }

        public FunctionReplay.functionReplay AddNewCustomer(Core.Domain.Customers.Customers NewCustomer)
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customers>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));

            Data.Customers newCustomers = Mapper.Map<Core.Domain.Customers.Customers, Data.Customers>(NewCustomer);

            return _CustomersRepository.Add(newCustomers);
        }

        public List<Customers> GetValidCustomers(int? roundsCustomerID, int? ManagerId)
        {
            Mapper.Reset();
            if (roundsCustomerID != null && roundsCustomerID.Value > 0)
            {
                Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
               .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status))
               .ForMember(a => a.RoundCustomerStatus, b => b.MapFrom(c => _roundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundsCustomerID).Single().RoundCustomerStatus));
            }
            else
            {
                Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                    .ForMember(a => a.custStatus,
                        b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus) z.Status));
            }
            List<Data.Customers> FoundCustomer = _CustomersRepository.FindBy(x => x.Status == 1 && x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Customers>, List<Core.Domain.Customers.Customers>>(FoundCustomer);
        }

        public List<Customers> GetAllCustomers(int? roundsCustomerID, int? ManagerId)
        {
            Mapper.Reset();
            if (roundsCustomerID != null && roundsCustomerID.Value > 0)
            {
                Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
               .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status))
               .ForMember(a => a.RoundCustomerStatus, b => b.MapFrom(c => _roundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundsCustomerID).Single().RoundCustomerStatus));
            }
            else
            {
                Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                    .ForMember(a => a.custStatus,
                        b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            }
            List<Data.Customers> FoundCustomer = _CustomersRepository.FindBy(x => x.ManagerId == ManagerId).ToList();
            return Mapper.Map<List<Data.Customers>, List<Core.Domain.Customers.Customers>>(FoundCustomer);
        }

        public Core.Domain.Customers.Customers GetCustomersById(int id)
        {
            Mapper.Reset();
            Mapper.CreateMap<Data.Customers, Core.Domain.Customers.Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(z => (Core.Enums.CustomerStatus.customerStatus)z.Status));
            Data.Customers FoundCustomer = _CustomersRepository.FindBy(x => x.CustomerID==id).FirstOrDefault();
            var customer = _roundsCustomerRepository.FindBy(x => x.CustomerID == id);
            return Mapper.Map<Data.Customers, Core.Domain.Customers.Customers>(FoundCustomer);
        }

        public Customers LoginCustomer(string email, string password)
        {
            Mapper.CreateMap<Data.Customers,Customers>()
                .ForMember(a => a.custStatus, b => b.MapFrom(c => (int)c.Status));

            return Mapper.Map<Data.Customers,Customers>(_CustomersRepository.FindBy(x => x.Email == email && x.Password == password).FirstOrDefault());
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
            customerToUpdate.ManagerId = UpdateCustomer.ManagerId;

            return _CustomersRepository.Update(customerToUpdate);
        }
    }
}
