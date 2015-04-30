using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;
using Customers = Core.Domain.Customers.Customers;

namespace Services.Users
{
    public interface ICustomerService
    {
        FunctionReplay.functionReplay AddNewCustomer(Core.Domain.Customers.Customers NewCustomer);
        List<Customers> GetValidCustomers(int? roundsCustomerID, int? ManagerId);
        List<ProductToCustomer> GetAllCustomerProducts(int CustomerID);
        FunctionReplay.functionReplay UpdateCustomer(int CustomerID, Core.Domain.Customers.Customers UpdateCustomer);
        Core.Domain.Customers.Customers GetCustomersById(int id);
    }
}