using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Core.Domain.Customers;
using Distributions.Web.Authorize;
using Services;
using Services.SessionManager;
using Services.Users;

namespace Distributions.Web.Controllers
{
    [AuthorizeCustomer]
    public class CustomerApiController : BaseCustomerApiController
    {
        private readonly ICustomerService _customerService;
        private readonly IRoundsService _roundsService;
        private readonly IDataPersistance<Customers> _customerStorage;
        public CustomerApiController(ICustomerService customerService, IDataPersistance<Customers> customerStorage, IRoundsService roundsService)
        {
            _customerService = customerService;
            _customerStorage = customerStorage;
            _roundsService = roundsService;
        }

        
        [Route("Customer/GetCustomer")]
        public HttpResponseMessage Get()
        {
            var customer = _customerStorage.ObjectValue;
            return customer == null ? Request.CreateErrorResponse(HttpStatusCode.NoContent, "לקוח לא קיים") : Request.CreateResponse(HttpStatusCode.OK, customer);
        }

         [Route("Customer/GetRoundsByDate")]
        public HttpResponseMessage Get(DateTime date)
        {
             if (_customerStorage.ObjectValue == null)
                 return Request.CreateErrorResponse(HttpStatusCode.NoContent, "לקוח לא קיים");

             var rounds = _roundsService.GetRoundsByDate(date, date.AddDays(1), _customerStorage.ObjectValue.ManagerId);
             return Request.CreateResponse(HttpStatusCode.OK, rounds);
        }

        // POST: api/CustomerApi
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/CustomerApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/CustomerApi/5
        public void Delete(int id)
        {
        }
    }
}
