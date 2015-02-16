using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;
using System;

namespace Services
{
    public interface IRoundsService
    {
        int CreateNewRound(Rounds NewRound);
        FunctionReplay.functionReplay AddRoundUsersToRound(List<User> RoundUsers, int RoundID);
        FunctionReplay.functionReplay AddCustomersToRound(List<CustomerRound> RoundCustomers, int RoundID);
        List<ProductToCustomer> GetCustomerProducts(int CustomerID, DaysType.DayType currentDayType);
        FunctionReplay.functionReplay AddRoundProductCustomer(List<RoundProductCustomer> addedProductToCustomerRound, int RoundID);
        List<Rounds> GetRoundsByDate(DateTime startdate, DateTime enddate);
        List<RoundProductCustomer> GetRoundCustomerProducts(int CustomerID, int RoundID);

        FunctionReplay.functionReplay UpdateRoundProductCustomerDeliveredAmount(int RoundProductCustomerID, int DeliveredAmount);
        List<RoundProductCustomer> CheckProductAmountPerRound(int ProductID, int RoundID, int TotalAmount)
        bool CheckIfUserCanUseRound(int UserID);
    }
}