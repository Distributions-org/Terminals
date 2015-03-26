using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Diagnostics;
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

        //public List<CustmerReports> GetCustomerProductsReport(List<int> ProductIDs, int CustomerID, int year, int month,int endYear, int endMonth)
        //{
        //    var customerReports = new List<CustmerReports>();
        //    if (month == endMonth && endMonth < 12)
        //    {
        //        endMonth++;
        //    }
        //    var startOftheMonth = new DateTime(year, month, 1);
        //    var endOfthMonth = new DateTime(endYear, endMonth, 1);
        //    var customerName = _CustomersRepository.FindBy(x => x.CustomerID == CustomerID).First().CustomerName;
        //    var monthRoundIds = _RoundsRepository.FindBy(x => x.RoundDate >= startOftheMonth && x.RoundDate < endOfthMonth).Select(x => x.RoundsID).ToList();
        //    var roundCustomerIds = _RoundsCustomerRepository.FindBy(f => f.CustomerID == CustomerID && monthRoundIds.Any(z => z == f.RoundsID)).Select(z => z.RoundsCustomersID).ToList();


        //    var roundcustomerProducts = _RoundsCustomerProductRepository.FindBy(x => roundCustomerIds.Contains(x.RoundsCustomersID.Value)).Where(x=>x.Amount>0||x.DelieveredAmount>0).OrderBy(x=>x.ProductID).ToList();
        //    roundcustomerProducts.Each(x =>
        //    {
        //        int RoundID = _RoundsCustomerRepository.FindBy(r => r.RoundsCustomersID == x.RoundsCustomersID).FirstOrDefault().RoundsID.Value;

        //        customerReports.Add(new CustmerReports
        //        {
        //            AllCustomerProductReports =roundcustomerProducts.Select(c=>new ProductCustomerReport
        //            {
        //                DelieverySent = c.Amount.Value,
        //                DelieveryTaken = c.DelieveredAmount.Value,
        //                currentDate = _RoundsRepository.FindBy(r => r.RoundsID == RoundID).FirstOrDefault(d=>d.RoundDate==c).FirstOrDefault().RoundDate.Value
        //            }).Where(b => b.currentDate == _RoundsRepository.FindBy(r => r.RoundsID == RoundID).FirstOrDefault().RoundDate.Value).ToList(),
        //            Cost =(double) _ProductCustomerRepository.FindBy(p=>p.ProductID==x.ProductID).First().Cost,
        //            CustomerID = CustomerID,
        //            CustomerName = customerName,
        //            ProductID = x.ProductID.Value,
        //            ProductName = _ProductsRepository.FindBy(p => p.ProductID == x.ProductID).First().ProductName,
        //            SumOfProducts = x.Amount.Value,
        //            TotalSum = x.Amount.Value * (double)_ProductCustomerRepository.FindBy(p => p.ProductID == x.ProductID).First().Cost

        //        }
        //            );
        //    });
                
            

        //    return customerReports;
        //}


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
            List<RoundsCustomerProductTbl> roundcustomerProducts = _RoundsCustomerProductRepository.FindBy(x => RoundCustomerIds.Any(z => z == x.RoundsCustomersID)).OrderBy(x => x.ProductID).ToList();
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
                    if (newproductCustomerReport.DelieverySent != 0 || newproductCustomerReport.DelieveryTaken != 0)
                    {
                        customerReport.AllCustomerProductReports.Add(newproductCustomerReport);
                        customerReports.Add(customerReport);
                    }
                   
                }
                else
                {
                    int RoundID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == roundcustomerproduct.RoundsCustomersID).FirstOrDefault().RoundsID.Value;
                    DateTime currentDate = _RoundsRepository.FindBy(x => x.RoundsID == RoundID).FirstOrDefault().RoundDate.Value;
                    if (customerReports.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID && x.AllCustomerProductReports.Any(z => z.currentDate.ToShortDateString() == currentDate.ToShortDateString())) == null)
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
                        var cr = customerReports.First(x => x.ProductID == roundcustomerproduct.ProductID).AllCustomerProductReports.Find(p => p.currentDate.ToShortDateString() == newproductCustomerReport.currentDate.ToShortDateString());
                        if(cr!=null)
                        { 
                             cr.DelieverySent =  newproductCustomerReport.DelieverySent;
                        if (newproductCustomerReport.DelieveryTaken > 0)
                        {
                            cr.DelieveryTaken =  newproductCustomerReport.DelieveryTaken;
                        }
                        else
                        {
                            cr.DelieveryTaken =  newproductCustomerReport.DelieveryTaken;
                        }
                        }
                        else
                        {
                            if (newproductCustomerReport.DelieverySent != 0 ||
                                newproductCustomerReport.DelieveryTaken != 0)
                            {
                                customerReport.AllCustomerProductReports.Add(newproductCustomerReport);
                                customerReports.First(x => x.ProductID == roundcustomerproduct.ProductID)
                                    .AllCustomerProductReports.Add(newproductCustomerReport);
                            }
                        }
                        //customerReports.Add(customerReport);
                    }
                    else
                    {
                        CustmerReports CurrentCustomerReport = customerReports.FirstOrDefault(x => x.ProductID == roundcustomerproduct.ProductID && x.AllCustomerProductReports.Any(z => z.currentDate.ToShortDateString() == currentDate.ToShortDateString()));
                        ProductCustomerReport currentProductCustomerReport = CurrentCustomerReport.AllCustomerProductReports.FirstOrDefault(x => x.currentDate.ToShortDateString() == currentDate.ToShortDateString());
                        if (roundcustomerproduct.Amount < 0)
                        {
                            currentProductCustomerReport.DelieverySent -= roundcustomerproduct.Amount.Value;
                            currentProductCustomerReport.DelieveryTaken -= roundcustomerproduct.DelieveredAmount.Value;
                            CurrentCustomerReport.TotalSum -= roundcustomerproduct.Amount.Value * CurrentCustomerReport.Cost;
                            CurrentCustomerReport.SumOfProducts -= roundcustomerproduct.Amount.Value;
                        }
                        else
                        {
                            currentProductCustomerReport.DelieverySent += roundcustomerproduct.Amount.Value;
                            currentProductCustomerReport.DelieveryTaken += roundcustomerproduct.DelieveredAmount.Value;
                            CurrentCustomerReport.TotalSum += roundcustomerproduct.Amount.Value * CurrentCustomerReport.Cost;
                            CurrentCustomerReport.SumOfProducts += roundcustomerproduct.Amount.Value;
                        }
                        if (
                            CurrentCustomerReport.AllCustomerProductReports.Exists(
                                x =>
                                    x.currentDate.ToShortDateString() ==
                                    currentProductCustomerReport.currentDate.ToShortDateString()))
                        {
                            var cr = CurrentCustomerReport.AllCustomerProductReports.Find(x => x.currentDate.ToShortDateString() == currentProductCustomerReport.currentDate.ToShortDateString());
                            if (cr != null)
                            {
                                cr.DelieverySent = currentProductCustomerReport.DelieverySent;
                                if (currentProductCustomerReport.DelieveryTaken > 0)
                                {
                                    cr.DelieveryTaken =  currentProductCustomerReport.DelieveryTaken;
                                }
                                else
                                {
                                    cr.DelieveryTaken= currentProductCustomerReport.DelieveryTaken;
                                } 
                            }
                            
                        }
                        else
                        {
                            if (currentProductCustomerReport.DelieverySent != 0 ||
                                currentProductCustomerReport.DelieveryTaken != 0)
                            {
                                CurrentCustomerReport.AllCustomerProductReports.Add(currentProductCustomerReport);
                            }
                        }
                           
                    }

                }
            }

            customerReports.ForEach(x =>
            {
                x.SumOfProducts = x.AllCustomerProductReports.Sum(d => d.DelieverySent+d.DelieveryTaken);
                x.SumOfProductsSent = x.AllCustomerProductReports.Sum(d => d.DelieverySent);
                x.SumOfProductsTakens = x.AllCustomerProductReports.Sum(d => d.DelieveryTaken);
                x.TotalSum = x.Cost * (x.SumOfProductsSent-x.SumOfProductsTakens);

            });

            return customerReports.ToList();
        }
    }
}