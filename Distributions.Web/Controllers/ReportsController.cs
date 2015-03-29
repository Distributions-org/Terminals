using System.Net;
using System.Net.Http;
using System.Web.Http;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Services;
using Services.Users;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser(AccessRole = "Admin")]
    public class ReportsController : BaseApiController
    {
         private readonly IReportsService _reportsService;
        private readonly IRoundsService _roundsService;
        private readonly ICustomerService _customerService;

        public ReportsController(IReportsService reportsService,IRoundsService roundsService,ICustomerService customerService)
         {
             _reportsService = reportsService;
             _roundsService = roundsService;
            _customerService = customerService;
         }

        [Route("ManageReport")]
         [HttpPost]
         public HttpResponseMessage ManageReport(ReportsModel model)
         {
             var result = _reportsService.GetCustomerProductsReports(model.ProductIDs, model.CustomerId,model.StartDate,model.EndDate);
             return Request.CreateResponse(result.Count>0 ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed, result);
         }

         [Route("CheckProductAmountPerRound")]
         [HttpPost]
         public HttpResponseMessage CheckProductAmountPerRound(ProductAmountPerRound model)
         {
             var result = _roundsService.CheckProductAmountPerRound(model.ProductId, model.RoundId, model.TotalAmount);
             return Request.CreateResponse(result.Count>0 ? HttpStatusCode.OK : HttpStatusCode.ExpectationFailed, result);
         }
         [Route("GetCustomerById")]
         [HttpGet]
         public HttpResponseMessage GetCustomerById(int id)
         {
             var result = _customerService.GetCustomersById(id);
             if (result != null)
             {
                 return Request.CreateResponse(HttpStatusCode.OK, result);
             }
             return Request.CreateResponse(HttpStatusCode.ExpectationFailed);
         }
        
    }
}
