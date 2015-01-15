using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;

namespace Services
{
    public interface IProductsService
    {
        FunctionReplay.functionReplay AddNewProduct(Core.Domain.Product newProduct);
        FunctionReplay.functionReplay UpdateProduct(Core.Domain.Product Producttoupdate);
        FunctionReplay.functionReplay AddProductTocustomer(ProductToCustomer addedProduct);
        FunctionReplay.functionReplay UpdateCustomerProductPrice(ProductToCustomer updateProduct);
        Core.Domain.Product GetProductById(int ProductID);
        List<Core.Domain.Product> GetProductByStatus(ProductStatus.productStatus pStatus);
    }
}