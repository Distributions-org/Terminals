using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData.Extensions;
using Core.Domain.ProductTocustomer;
using Core.Enums;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Microsoft.AspNet.Identity.Owin;
using Services;
using Services.Users;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser(AccessRole = "Admin")]
    public class ManagementDistributionsController : BaseApiController
    {
        private readonly ICustomerService _customersService;
        private readonly IProductsService _productsService;

        public ManagementDistributionsController(ICustomerService customersService,IProductsService productsService)
        {
            _customersService = customersService;
            _productsService = productsService;
        }

        [Route("GetActiveCustomers")]
        public HttpResponseMessage Get()
        {
            var customers = _customersService.GetValidCustomers();
            if (customers != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, customers);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Customers Not Founds");
        }

        [Route("GetProductsCustomer")]
        [HttpGet]
        public HttpResponseMessage GetProductsCustomer(int customerId)
        {
            var customersProdusts = _customersService.GetAllCustomerProducts(customerId);
            if (customersProdusts != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, customersProdusts);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Customers Not Founds");
        }

        [Route("AddProductsCustomer")]
        [HttpPost]
        public HttpResponseMessage AddProductsCustomer(ProductToCustomer productToCustomer)
        {
            var result = _productsService.AddProductTocustomer(productToCustomer);
            if (result.ToString() =="Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result);
        }

        [Route("UpdateProductsCustomer")]
        [HttpPost]
        public HttpResponseMessage UpdateProductsCustomer(ProductToCustomer productToCustomer)
        {
            var result = _productsService.UpdateCustomerProductPrice(productToCustomer);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result);
        }
    }
}
