using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData.Extensions;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;
using Core.Domain.Users;
using Core.Enums;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity.Owin;
using Services;
using Services.SessionManager;
using Services.Users;
using WebGrease.Css.Extensions;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser(AccessRole = "Admin")]
    public class ManagementDistributionsController : BaseApiController
    {
        private readonly ICustomerService _customersService;
        private readonly IProductsService _productsService;
        private readonly IUserService _userService;
        private readonly IRoundsService _roundsService;
        private readonly IDataPersistance<User> _userStorage;

        public ManagementDistributionsController(ICustomerService customersService, IProductsService productsService,
            IUserService userService,
            IRoundsService roundsService, IDataPersistance<User> userStorage)
        {
            _customersService = customersService;
            _productsService = productsService;
            _userService = userService;
            _roundsService = roundsService;
            _userStorage = userStorage;
        }

        [Route("GetActiveCustomers")]
        public HttpResponseMessage Get(int id)
        {
            var customers = _customersService.GetValidCustomers(null, id);
            if (customers != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, customers);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Customers Not Founds");
        }


        [Route("GetRounds")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetRounds(RoundFilterModel model)
        {
            if (model.ManagerId == 0 && _userStorage.ObjectValue.ManagerId != null)
                model.ManagerId = _userStorage.ObjectValue.ManagerId.Value;

            if (!ChackManagerId(model.ManagerId))
                return Request.CreateResponse(HttpStatusCode.Forbidden, "User Not Founds");
            var rounds = await _roundsService.GetAllRounds(model.Today, model.StartDate, model.EndDate, model.Email, model.ManagerId);
            if (model.CustomerId.HasValue)
            {
                rounds = rounds.Select(x => x.custRound.Any(c => c.customerRound.CustomerID == model.CustomerId.Value) ? x : null).ToList();
            }
            if (rounds.Any())
            {
                return Request.CreateResponse(HttpStatusCode.OK, rounds);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Rounds Not Founds");
        }

        [Route("GetCustomerRounds")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetCustomerRounds(RoundFilterModel model)
        {
            var customerRounds = new List<CustomerRound>();
            if (model.ManagerId == 0 && _userStorage.ObjectValue.ManagerId != null)
                model.ManagerId = _userStorage.ObjectValue.ManagerId.Value;

            if (!ChackManagerId(model.ManagerId))
                return Request.CreateResponse(HttpStatusCode.Forbidden, "User Not Founds");
            var rounds = await _roundsService.GetAllRounds(model.Today, model.StartDate, model.EndDate, model.Email, model.ManagerId);
            if (model.CustomerId.HasValue && model.CustomerId.Value>0)
            {
                rounds.ForEach(x => x.custRound.ForEach(c =>
                {
                    if (c.customerRound.CustomerID == model.CustomerId.Value)
                    {
                        c.RoundDate = x.RoundDate;
                        c.RoundId = x.RoundID;
                        customerRounds.Add(c);
                    }
                }));
            }
            else
            {
                rounds.ForEach(x => x.custRound.ForEach(c =>
                {
                    c.RoundDate = x.RoundDate;
                    c.RoundId = x.RoundID;
                    customerRounds.Add(c);

                }));
            }
            if (customerRounds.Any())
            {
                return Request.CreateResponse(HttpStatusCode.OK, customerRounds);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Rounds Not Founds");
        }

        [Route("GetWorkers")]
        public HttpResponseMessage GetWorkers(int id)
        {
            var workers = _userService.GetAllUsers(id).Where(x => x.RoleID == UserRoles.userRoles.Worker).ToList();
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
            if (round.ManagerId == 0 && _userStorage.ObjectValue.ManagerId != null)
                round.ManagerId = _userStorage.ObjectValue.ManagerId.Value;

            if (!ChackManagerId(round.ManagerId))
                return Request.CreateResponse(HttpStatusCode.Forbidden, "User Not Founds");

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
            if (roundModel.RoundUser.Count > 0 && roundModel.RoundUser.First().ManagerId.HasValue && roundModel.RoundUser.First().ManagerId.Value == 0)
            {
                if (_userStorage.ObjectValue.ManagerId != null)
                {
                    roundModel.RoundUser.ForEach(x =>
                    {
                        x.ManagerId = _userStorage.ObjectValue.ManagerId.Value;
                    });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotAcceptable, "User Not Founds");
                }
            }
            var result = _roundsService.AddRoundUsersToRound(roundModel.RoundUser, roundModel.RoundId);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result);
        }

        [Route("AddCustomerRound")]
        [HttpPost]
        public HttpResponseMessage AddCustomerRound(List<CustomersToRoundModel> model)
        {
            var roundProductsResult = "";
            if (model.Any())
            {
                foreach (var customersToRoundModel in model)
                {
                    if (customersToRoundModel.RoundCustomers.First().customerRound != null)
                    {
                        var result = _roundsService.AddCustomersToRound(customersToRoundModel.RoundCustomers, customersToRoundModel.RoundId);
                        if (result.ToString() == "Success")
                        {
                            _roundsService.AddRoundProductCustomer(customersToRoundModel.RoundCustomers.First().roundcustomerProducts.ToList(), customersToRoundModel.RoundId);
                            roundProductsResult += customersToRoundModel.RoundCustomers.First().customerRound.CustomerName + ", ";
                        }
                    }
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, roundProductsResult);
        }

        [Route("ChangeRoundStatus")]
        [HttpPost]
        public HttpResponseMessage ChangeRoundStatus(Rounds round)
        {
            var result = _roundsService.UpdateRoundStatus(round.RoundID, (int)round.roundStatus);
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
            if (round.ManagerId == 0 && _userStorage.ObjectValue.ManagerId != null)
                round.ManagerId = _userStorage.ObjectValue.ManagerId.Value;

            if (!ChackManagerId(round.ManagerId))
                return Request.CreateResponse(HttpStatusCode.Forbidden, "User Not Founds");

            var result = _roundsService.UpdateRound(round);
            if (result.ToString() == "Success")
            {
                return Request.CreateResponse(HttpStatusCode.OK, round);
            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, result.ToString());
        }

        [Route("UpdateCustomerRound")]
        [HttpPost]
        public HttpResponseMessage UpdateCustomerRound(List<CustomersToRoundModel> model)
        {
            var result = "";
            if (model.Any())
            {
                foreach (var item in model)
                {
                    result = _roundsService.UpdateCustomersToRound(item.RoundCustomers, item.RoundId).ToString();
                }
                if (result.ToString() == "Success")
                {
                    result = "";
                    model.ForEach(z => z.RoundCustomers.ForEach(x =>
                    {
                        if (z.RoundCustomers.First().customerRound != null)
                        {
                            _roundsService.UpdateRoundProductCustomer(x.roundcustomerProducts.ToList(), model.First().RoundId);
                            result += z.RoundCustomers.First().customerRound.CustomerName + ", ";
                        }
                    })
                        );
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }
                return Request.CreateResponse(HttpStatusCode.NoContent, "empty round customer");

            }
            return Request.CreateResponse(HttpStatusCode.Forbidden, "Round Items Empty");

            //if (result.ToString() == "Success")
            //{
            //    if (model.RoundCustomers.Any())
            //    {
            //        foreach (var roundCustomer in model.RoundCustomers)
            //        {
            //            _roundsService.UpdateRoundProductCustomer(roundCustomer.roundcustomerProducts.ToList(), model.RoundId);
            //        }
            //        return Request.CreateResponse(HttpStatusCode.OK, model);
            //    }
            //    return Request.CreateResponse(HttpStatusCode.NoContent, "empty round customer");
            //}

            //return Request.CreateResponse(HttpStatusCode.InternalServerError, result.ToString());
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

        [Route("GetManagerDetails")]
        public HttpResponseMessage GetManagerDetails(int managerId)
        {
            if (managerId == 0 && _userStorage.ObjectValue.ManagerId != null)
                managerId = _userStorage.ObjectValue.ManagerId.Value;

            if (!ChackManagerId(managerId))
                return Request.CreateResponse(HttpStatusCode.Forbidden, "User Not Founds");

            var result = _roundsService.GetManagerDetails(managerId);

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

    }
}

