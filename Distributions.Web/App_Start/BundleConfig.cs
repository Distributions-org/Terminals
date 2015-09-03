using System.Web;
using System.Web.Optimization;

namespace Distributions.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js","~/Scripts/printThis.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include("~/scripts/angular.js", "~/scripts/angular-messages.js", "~/scripts/angular-animate.js", "~/scripts/angular-route.js"
              , "~/scripts/angular-sanitize.js", "~/scripts/angular-locale_he-il.js", "~/Scripts/bootstrap-timepicker.min.js", "~/scripts/ui-bootstrap-tpls-0.12.1.js"));

            bundles.Add(new ScriptBundle("~/bundles/ui-grid").Include("~/Scripts/ui-grid-unstable.min.js", "~/scripts/csv.js", "~/scripts/pdfmake.js",
                "~/scripts/vfs_fonts.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js", "~/Scripts/respond.js",
                "~/scripts/spin.js", "~/scripts/toastr.js", "~/scripts/moment.js", "~/Scripts/underscore.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/app").Include("~/app/app.js", "~/app/config.js", "~/app/config.exceptionHandler.js", "~/app/config.interceptor.js",
                "~/app/config.route.js", "~/app/services/entityManagerFactory.js", "~/app/common/common.js", "~/app/common/logger.js", "~/app/common/spinner.js",
                "~/app/common/cache.js", "~/app/common/localStorage.js", "~/app/common/print.js", "~/app/common/bootstrap/bootstrap.dialog.js", "~/app/admin/admin.js", "~/app/dashboard/dashboard.js", "~/app/layout/shell.js"
                , "~/app/layout/sidebar.js", "~/app/managementDistributions/managementDistributions.js", "~/app/reports/reports.js", "~/app/worker/worker.js",
                "~/app/admin/adminService.js", "~/app/services/datacontext.js", "~/app/services/directives.js", "~/app/managementDistributions/managementDistributionsService.js",
                "~/app/reports/reportsService.js"));

            bundles.Add(new ScriptBundle("~/bundles/customerApp").Include("~/customersApp/app.js", "~/customersApp/config.js", "~/customersApp/config.exceptionHandler.js", "~/customersApp/config.interceptor.js",
                "~/customersApp/config.route.js", "~/customersApp/services/entityManagerFactory.js", "~/customersApp/common/common.js", "~/customersApp/common/logger.js", "~/customersApp/common/spinner.js",
                "~/customersApp/common/cache.js", "~/customersApp/common/localStorage.js", "~/customersApp/common/print.js", "~/customersApp/common/bootstrap/bootstrap.dialog.js"
                , "~/customersApp/dashboard/dashboard.js", "~/customersApp/dashboard/dashboardService.js", "~/customersApp/layout/shell.js"
                , "~/customersApp/layout/sidebar.js", "~/customersApp/services/datacontext.js", "~/customersApp/services/directives.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/content/ie10mobile.css","~/content/bootstrap.min.css","~/Content/bootstrap-rtl.css","~/Content/ui-grid-unstable.min.css"
                ,"~/content/font-awesome.min.css","~/content/toastr.css","~/content/customtheme.css","~/content/styles.css","~/content/breeze.directives.css","~/Content/bootstrap-timepicker.min.css"
                ,"~/Content/StyleSheet.min.css","~/Content/site.css"));
        }
    }
}
