using System.Collections.Generic;
using System.Linq;
using Core.Data;
using Core.Domain.Persons;
using Core.Domain.Users;
using Data;
using Core.MD5;
using Core.Enums;
using Core.Domain;
using AutoMapper;
using Core.Domain.ProductTocustomer;
using Core.Domain;
using Core.Domain.Rounds;
using Core.Domain.Customers;
using Core.Domain.Reports;
using System;

namespace Services
{
    public class ReportsService : IReportsService
    {
        private readonly IRepository<Data.RoundsTbl> _RoundsRepository;
        private readonly IRepository<Data.Product> _ProductsRepository;
        private readonly IRepository<Data.Customers> _CustomersRepository;
        private readonly IRepository<ProductCustomerTbl> _ProductCustomerRepository;
        private readonly IRepository<RoundsUserTbl> _RoundsUserRepository;
        private readonly IRepository<RoundsCustomerTbl> _RoundsCustomerRepository;
        private readonly IRepository<RoundsCustomerProductTbl> _RoundsCustomerProductRepository;

        public ReportsService(IRepository<Data.RoundsTbl> RoundsRepository, IRepository<Data.Customers> CustomersRepository,
            IRepository<ProductCustomerTbl> ProductCustomerRepository, IRepository<Data.Product> ProductsRepository
            , IRepository<Data.RoundsUserTbl> RoundsUserRepository,
            IRepository<Data.RoundsCustomerTbl> RoundsCustomerRepository, IRepository<RoundsCustomerProductTbl> RoundsCustomerProductRepository)
        {
            _RoundsRepository = RoundsRepository;
            _CustomersRepository = CustomersRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductsRepository = ProductsRepository;
            _RoundsUserRepository = RoundsUserRepository;
            _RoundsCustomerRepository = RoundsCustomerRepository;
            _RoundsCustomerProductRepository = RoundsCustomerProductRepository;
        }

        public List<CustmerReports> GetCustomerProductsReports(List<int> ProductIDs, int CustomerID, int year, int month, int endYear, int endMonth)
        {
            if (month == endMonth && endMonth < 12)
            {
                endMonth++;
            }
            DateTime startOftheMonth = new DateTime(year, month, 1);
            DateTime endOfthMonth = new DateTime(endYear, endMonth, 1);
            List<Data.Product> AllProducts = _ProductsRepository.GetAll().ToList();
            string CustomerName = _CustomersRepository.FindBy(x => x.CustomerID == CustomerID).FirstOrDefault().CustomerName;
            List<int> MonthRoundIds = _RoundsRepository.FindBy(x => x.RoundDate >= startOftheMonth && x.RoundDate < endOfthMonth).Select(x => x.RoundsID).ToList();
            List<int> RoundCustomerIds = _RoundsCustomerRepository.FindBy(x => x.CustomerID == CustomerID && MonthRoundIds.Any(z => z == x.RoundsID)).Select(x => x.RoundsCustomersID).ToList();
            List<RoundsCustomerProductTbl> roundcustomerProducts = _RoundsCustomerProductRepository.FindBy(x => RoundCustomerIds.Any(z => z == x.RoundsCustomersID)).Where(x=>x.Amount>0||x.DelieveredAmount>0).OrderBy(x => x.ProductID).ToList();
            List<ProductCustomerTbl> allProductcustomer = _ProductCustomerRepository.GetAll().ToList();
            List<CustmerReports> customerReports = new List<CustmerReports>();
            foreach (var roundcustomerproduct in roundcustomerProducts)
            {
                if (customerReports.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID) == null)
                {
                    CustmerReports customerReport = new CustmerReports();
                    customerReport.CustomerName = CustomerName;
                    customerReport.ProductID = roundcustomerproduct.ProductID.Value;
                    customerReport.ProductName = AllProducts.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID).ProductName;
                    customerReport.CustomerID = CustomerID;
                    customerReport.CustomerName = CustomerName;
                    customerReport.Cost = allProductcustomer.FirstOrDefault(x => x.CustomerID == CustomerID && x.ProductID == roundcustomerproduct.ProductID).Cost.Value;
                    ProductCustomerReport newproductCustomerReport = new ProductCustomerReport();
                    int RoundID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundcustomerproduct.RoundsCustomersID).FirstOrDefault().RoundsID.Value;
                    newproductCustomerReport.currentDate = _RoundsRepository.FindBy(x => x.RoundsID == RoundID).FirstOrDefault().RoundDate.Value;

                    if (roundcustomerproduct.Amount < 0)
                    {
                        newproductCustomerReport.DelieveryTaken = roundcustomerproduct.DelieveredAmount.Value;
                        newproductCustomerReport.DelieverySent = roundcustomerproduct.Amount.Value;
                        customerReport.TotalSum -= roundcustomerproduct.Amount.Value * customerReport.Cost;
                        customerReport.SumOfProducts -= roundcustomerproduct.Amount.Value;
                    }
                    else
                    {
                        newproductCustomerReport.DelieverySent = roundcustomerproduct.Amount.Value;
                        newproductCustomerReport.DelieveryTaken = roundcustomerproduct.DelieveredAmount.Value;
                        customerReport.TotalSum += roundcustomerproduct.Amount.Value * customerReport.Cost;
                        customerReport.SumOfProducts += roundcustomerproduct.Amount.Value;
                    }

                    customerReport.AllCustomerProductReports.Add(newproductCustomerReport);
                    customerReports.Add(customerReport);
                }
                else
                {
                    int RoundID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundcustomerproduct.RoundsCustomersID).FirstOrDefault().RoundsID.Value;
                    DateTime currentDate = _RoundsRepository.FindBy(x => x.RoundsID == RoundID).FirstOrDefault().RoundDate.Value;
                    if (customerReports.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID && x.AllCustomerProductReports.Any(z => z.currentDate == currentDate)) == null)
                    {
                        CustmerReports customerReport = new CustmerReports();
                        customerReport.CustomerName = CustomerName;
                        customerReport.ProductID = roundcustomerproduct.ProductID.Value;
                        customerReport.ProductName = AllProducts.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID).ProductName;
                        customerReport.CustomerID = CustomerID;
                        customerReport.CustomerName = CustomerName;
                        customerReport.Cost = allProductcustomer.FirstOrDefault(x => x.CustomerID == CustomerID && x.ProductID == roundcustomerproduct.ProductID).Cost.Value;
                        ProductCustomerReport newproductCustomerReport = new ProductCustomerReport();
                        int CurrentRoundID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundcustomerproduct.RoundsCustomersID).FirstOrDefault().RoundsID.Value;
                        newproductCustomerReport.currentDate = _RoundsRepository.FindBy(x => x.RoundsID == CurrentRoundID).FirstOrDefault().RoundDate.Value;
                        if (roundcustomerproduct.Amount < 0)
                        {
                            newproductCustomerReport.DelieveryTaken = roundcustomerproduct.DelieveredAmount.Value;
                            newproductCustomerReport.DelieverySent = roundcustomerproduct.Amount.Value;
                            customerReport.TotalSum -= roundcustomerproduct.Amount.Value * customerReport.Cost;
                            customerReport.SumOfProducts -= roundcustomerproduct.Amount.Value;
                        }
                        else
                        {
                            newproductCustomerReport.DelieverySent = roundcustomerproduct.Amount.Value;
                            newproductCustomerReport.DelieveryTaken = roundcustomerproduct.DelieveredAmount.Value;
                            customerReport.TotalSum += roundcustomerproduct.Amount.Value * customerReport.Cost;
                            customerReport.SumOfProducts += roundcustomerproduct.Amount.Value;
                        }
                        customerReports.Add(customerReport);
                    }
                    else
                    {
                        CustmerReports CurrentCustomerReport = customerReports.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID && x.AllCustomerProductReports.Any(z => z.currentDate == currentDate));
                        ProductCustomerReport currentProductCustomerReport = CurrentCustomerReport.AllCustomerProductReports.FirstOrDefault(x => x.currentDate == currentDate);
                        if (roundcustomerproduct.Amount < 0)
                        {
                            currentProductCustomerReport.DelieverySent += roundcustomerproduct.Amount.Value;
                            currentProductCustomerReport.DelieveryTaken += roundcustomerproduct.DelieveredAmount.Value;
                            CurrentCustomerReport.TotalSum -= roundcustomerproduct.Amount.Value * CurrentCustomerReport.Cost;
                            CurrentCustomerReport.SumOfProducts -= roundcustomerproduct.Amount.Value;
                        }
                        else
                        {
                            currentProductCustomerReport.DelieverySent -= roundcustomerproduct.Amount.Value;
                            currentProductCustomerReport.DelieveryTaken -= roundcustomerproduct.DelieveredAmount.Value;
                            CurrentCustomerReport.TotalSum += roundcustomerproduct.Amount.Value * CurrentCustomerReport.Cost;
                            CurrentCustomerReport.SumOfProducts += roundcustomerproduct.Amount.Value;
                        }
                        CurrentCustomerReport.AllCustomerProductReports.Add(currentProductCustomerReport);
                    }

                }
            }

            return customerReports.Where(x=>x.AllCustomerProductReports.Count>0).ToList();
        }
    }
}