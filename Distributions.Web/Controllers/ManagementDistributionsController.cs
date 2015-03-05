﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData.Extensions;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;
using Core.Domain.Users;
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
        private readonly IUserService _userService;
        private readonly IRoundsService _roundsService;

        public ManagementDistributionsController(ICustomerService customersService, IProductsService productsService,
            IUserService userService,
            IRoundsService roundsService)
        {
            _customersService = customersService;
            _productsService = productsService;
            _userService = userService;
            _roundsService = roundsService;
        }

        [Route("GetActiveCustomers")]
        public HttpResponseMessage Get()
        {
            var customers = _customersService.GetValidCustomers(null);
            if (customers != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, customers);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Customers Not Founds");
        }


        [Route("GetRounds")]
        [HttpPost]
        public HttpResponseMessage GetRounds(RoundFilterModel model)
        {
            var rounds = _roundsService.GetAllRounds(model.Today, model.StartDate, model.EndDate,model.Email);
            if (rounds != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, rounds);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Rounds Not Founds");
        }

        [Route("GetWorkers")]
        public HttpResponseMessage GetWorkers()
        {
            var workers = _userService.GetAllUsers().Where(x => x.RoleID == UserRoles.userRoles.Worker).ToList();
            if (workers.Any())
            {
                return Request.CreateResponse(HttpStatusCode.OK, workers);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Workers Not Founds");
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
            if (result.ToString() == "Success")
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

        [Route("NewRound")]
        [HttpPost]
        public HttpResponseMessage NewRound(Rounds round)
        {
            var result = _roundsService.CreateNewRound(round);
            if (result != 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Error");
        }

        [Route("AddUserToRound")]
        [HttpPost]
        public HttpResponseMessage AddUserToRound(UsersToRoundModel roundModel)
        {
            var result = _roundsService.AddRoundUsersToRound(roundModel.RoundUser, roundModel.RoundId);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result);
        }

        [Route("AddCustomerRound")]
        [HttpPost]
        public HttpResponseMessage AddCustomerRound(CustomersToRoundModel model)
        {
            var roundProductsResult = "";
            var result = _roundsService.AddCustomersToRound(model.RoundCustomers, model.RoundId);
            if (result.ToString() == "Success")
            {
                if (model.RoundCustomers.Any())
                {
                    foreach (var roundCustomer in model.RoundCustomers)
                    {
                        _roundsService.AddRoundProductCustomer(roundCustomer.roundcustomerProducts, model.RoundId);
                    }

                    // model.RoundCustomers.ForEach(roundProducts =>  _roundsService.AddRoundProductCustomer(roundProducts.roundcustomerProducts, model.RoundId));
                }
            }
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result);
        }

        [Route("ChangeRoundStatus")]
        [HttpPost]
        public HttpResponseMessage ChangeRoundStatus(Rounds round)
        {
            var result = _roundsService.UpdateRoundStatus(round.RoundID, (int) round.roundStatus);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, round);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result.ToString());
        }

        [Route("UpdateRound")]
        [HttpPost]
        public HttpResponseMessage UpdateRound(Rounds round)
        {
            var result = _roundsService.UpdateRound(round);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, round);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result.ToString());
        }

        [Route("UpdateCustomerRound")]
        [HttpPost]
        public HttpResponseMessage UpdateCustomerRound(CustomersToRoundModel model)
        {
            var result = _roundsService.UpdateCustomersToRound(model.RoundCustomers, model.RoundId);

            if (result.ToString() == "Success")
            {
                if (model.RoundCustomers.Any())
                {
                    foreach (var roundCustomer in model.RoundCustomers)
                    {
                        _roundsService.UpdateRoundProductCustomer(roundCustomer.roundcustomerProducts, model.RoundId);
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, model);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, "empty round customer");
            }

            return Request.CreateResponse(HttpStatusCode.InternalServerError, result.ToString());
        }

         [Route("RemoveProductToCustomer")]
        [HttpPost]
        public HttpResponseMessage RemoveProductToCustomer(int productCustomerId)
        {
            var result = _productsService.RemoveProductToCustomer(productCustomerId);

            if (result.ToString() == "Success")
            {
              return Request.CreateResponse(HttpStatusCode.OK, result.ToString());
            }

            return Request.CreateResponse(HttpStatusCode.Forbidden, result.ToString());
        }
         [Route("DeleteProductFromRound")]
        [HttpPost]
         public HttpResponseMessage DeleteProductFromRound(ProductToCustomer product, int roundId)
         {
             var result = _roundsService.DeleteProductFromRound(product, roundId);

            if (result.ToString() == "Success")
            {
              return Request.CreateResponse(HttpStatusCode.OK, result.ToString());
            }

            return Request.CreateResponse(HttpStatusCode.Forbidden, result.ToString());
        }
        
    }
}

