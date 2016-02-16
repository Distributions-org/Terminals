using System;
using Core.Data;
using Core.Domain.Persons;
using Data;
using Ninject;
using Services.Users;
using Core.Domain.Users;
using Services;
using System.Collections.Generic;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;

namespace Console.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            var kernal = new StandardKernel();
            RegisterServices(kernal);

            var reportService = kernal.Get<IReportsService>();
            List<int> ProductIds = new List<int>();
            ProductIds.Add(10);
            ProductIds.Add(11);
            ProductIds.Add(12);
            ProductIds.Add(13);
            ProductIds.Add(14);
            ProductIds.Add(15);
            ProductIds.Add(16);
            //reportService.GetCustomerProductsReports(ProductIds, 7, 2015, 4, 2015, 5);
            double vit = reportService.GetVit((DateTime.Now.AddYears(-1)));

            reportService.SetNewVit(19.0);
            //var userService = kernal.Get<IUserService>();

            //User NewUser = new User{FirstName = "Oren",LastName = "Naftaly", Email = "Naftalywork@gmail.com",Password = "orenn1",RoleID = Core.Enums.UserRoles.userRoles.admin};
            //userService.AddNewUser(NewUser);

            //User currentUser = userService.LoginUser("Naftalywork@gmail.com", "orenn1");

            var customerService = kernal.Get<ICustomerService>();
            //Core.Domain.Customers.Customers newcustomer = new Core.Domain.Customers.Customers { CustomerName = "test2", CustomerHP = "test2", custStatus = Core.Enums.CustomerStatus.customerStatus.Active };
            //List<Core.Domain.Customers.Customers> validcust = customerService.GetValidCustomers();
            //customerService.GetAllCustomerProducts(9);
            //customerService.AddNewCustomer("test", "test");

            //var productService = kernal.Get<IProductsService>();
            //Core.Domain.Product Producttoupdate = new Core.Domain.Product{ ProductID = 1,ProductName = "test2", productStatus = Core.Enums.ProductStatus.productStatus.NotActive};
            //productService.UpdateProduct(Producttoupdate);
            //productService.UpdateCustomerProductPrice(1, 30.5);
            //var RoundService = kernal.Get<IRoundsService>();
            //productService.AddProductTocustomer(RoundService.GetCustomerProducts(1, Core.Enums.DaysType.DayType.SunToWen)[0]);
            //productService.AddNewProduct("test",Core.Enums.ProductStatus.productStatus.Active);

            //var RoundService = kernal.Get<IRoundsService>();
            //List<Rounds> allRounds = RoundService.GetRoundsByDate(new DateTime(2014, 12, 20), DateTime.Now);
            ////RoundService.CreateNewRound(new Core.Domain.Rounds.Rounds { RoundDate = DateTime.Now, RoundName = "Test Round" });
            //User RoundUser = userService.GetUserById(7);
            //List<User> roundUsers = new List<User>();
            ////roundUsers.Add(RoundUser);
            ////RoundService.AddRoundUsersToRound(roundUsers, 1);
            //List<Core.Domain.Customers.Customers> allCust = customerService.GetValidCustomers();
            //List<CustomerRound> RoundCustomers = new List<CustomerRound>();
            //CustomerRound newcr = new CustomerRound();
            //newcr.customerRound = allCust[0];
            //RoundCustomers.Add(newcr);

            ////RoundService.AddCustomersToRound(RoundCustomers, 1);

            //List<ProductToCustomer> all = RoundService.GetCustomerProducts(1, Core.Enums.DaysType.DayType.SunToWen);
            //List<Core.Domain.Rounds.RoundProductCustomer> current = new List<Core.Domain.Rounds.RoundProductCustomer>();
            //RoundProductCustomer newcurrent = new RoundProductCustomer();
            //newcurrent.CustomerRoundProduct = all[0];
            //newcurrent.Amount = 5;
            //current.Add(newcurrent);
            ////RoundService.AddRoundProductCustomer(current, 1);
            //RoundService.GetRoundCustomerProducts(1, 1);

        }
        private static void RegisterServices(IKernel kernal)
        {
            //kernal.Bind<TestContext>().ToSelf().InSingletonScope();
            kernal.Bind(typeof(IRepository<>)).To(typeof(Repository<>));
            kernal.Bind<IUserService>().To<UsersService>();
            kernal.Bind<ICustomerService>().To<CustomerService>();
            kernal.Bind<IProductsService>().To<ProductsService>();
            kernal.Bind<IRoundsService>().To<RoundsService>();
            kernal.Bind<IReportsService>().To<ReportsService>();
        }
    }
}
