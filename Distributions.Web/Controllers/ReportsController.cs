using System.Net;
using System.Net.Http;
using System.Web.Http;
using Distributions.Web.Authorize;
using Distributions.Web.Models;
using Services;

namespace Distributions.Web.Controllers
{
    [AuthorizeUser(AccessRole = "Admin")]
    public class ReportsController : BaseApiController
    {
         private readonly IReportsService _reportsService;

         public ReportsController(IReportsService reportsService)
         {
             _reportsService = reportsService;
         }

         [Route("ManageReport")]
         [HttpPost]
         public HttpResponseMessage ManageReport(ReportModel model)
         {
             var result = _reportsService.GetCustomerProductsReports(model.ProductIDs, model.CustomerId, model.Year, model.Month, model.EndYear, model.EndMonth);
             if (result.Count>0)
             {
                 return Request.CreateResponse(HttpStatusCode.OK, result);
             }
             return Request.CreateResponse(HttpStatusCode.ExpectationFailed, result);
         }
    }
}
