using System;
using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;
using Core.Domain.Reports;

namespace Services
{
    public interface IReportsService
    {
        List<CustmerReports> GetCustomerProductsReports(List<int> ProductIDs, int CustomerID, int year, int month, int endYear, int endMonth);
        List<CustmerReports> GetCustomerProductsReports(List<int> ProductIDs, int CustomerID, DateTime startDate,DateTime endDate);
        double GetVit(DateTime Vitdate);
        FunctionReplay.functionReplay SetNewVit(double NewVit);
    }
}