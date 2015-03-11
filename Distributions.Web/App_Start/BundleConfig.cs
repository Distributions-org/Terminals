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
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include("~/scripts/angular.js", "~/scripts/angular-messages.js", "~/scripts/angular-animate.js", "~/scripts/angular-route.js"
              , "~/scripts/angular-sanitize.js", "~/scripts/angular-locale_he-il.js", "~/Scripts/bootstrap-timepicker.min.js", "~/scripts/ui-bootstrap-tpls-0.10.0.js"));

            bundles.Add(new ScriptBundle("~/bundles/ui-grid").Include("~/Scripts/ui-grid-unstable.min.js", "~/scripts/csv.js", "~/scripts/pdfmake.js",
                "~/scripts/vfs_fonts.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js", "~/Scripts/respond.js",
                "~/scripts/spin.js", "~/scripts/toastr.js", "~/scripts/moment.js", "~/Scripts/underscore.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/app").Include("~/app/app.js", "~/app/config.js", "~/app/config.exceptionHandler.js", "~/app/config.interceptor.js",
                "~/app/config.route.js", "~/app/services/entityManagerFactory.js", "~/app/common/common.js", "~/app/common/logger.js", "~/app/common/spinner.js",
                "~/app/common/print.js", "~/app/common/bootstrap/bootstrap.dialog.js", "~/app/admin/admin.js", "~/app/dashboard/dashboard.js", "~/app/layout/shell.js"
                , "~/app/layout/sidebar.js", "~/app/managementDistributions/managementDistributions.js", "~/app/reports/reports.js", "~/app/worker/worker.js",
                "~/app/admin/adminService.js", "~/app/services/datacontext.js", "~/app/services/directives.js", "~/app/managementDistributions/managementDistributionsService.js",
                "~/app/reports/reportsService.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css"));
        }
    }
}
