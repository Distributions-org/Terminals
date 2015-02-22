using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;

namespace Services.Users
{
    public interface ICustomerService
    {
        FunctionReplay.functionReplay AddNewCustomer(Core.Domain.Customers.Customers NewCustomer);
        List<Core.Domain.Customers.Customers> GetValidCustomers();
        List<ProductToCustomer> GetAllCustomerProducts(int CustomerID);
        FunctionReplay.functionReplay UpdateCustomer(int CustomerID, Core.Domain.Customers.Customers UpdateCustomer);
        Core.Domain.Customers.Customers GetCustomersById(int id);
    }
}