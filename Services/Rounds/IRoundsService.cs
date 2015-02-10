using System;
using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;
using Data;
using Core.Domain.ProductTocustomer;
using Core.Domain.Rounds;

namespace Services
{
    public interface IRoundsService
    {
        int CreateNewRound(Rounds NewRound);
        FunctionReplay.functionReplay AddRoundUsersToRound(List<User> RoundUsers, int RoundID);
        FunctionReplay.functionReplay AddCustomersToRound(List<CustomerRound> RoundCustomers, int RoundID);
        List<ProductToCustomer> GetCustomerProducts(int CustomerID, DaysType.DayType currentDayType);
        FunctionReplay.functionReplay AddRoundProductCustomer(List<RoundProductCustomer> addedProductToCustomerRound, int RoundID);

        List<RoundProductCustomer> GetRoundCustomerProducts(int CustomerID, int RoundID);

        FunctionReplay.functionReplay UpdateRoundProductCustomerDeliveredAmount(int RoundProductCustomerID, int DeliveredAmount);

        FunctionReplay.functionReplay UpdateRoundStatus(int roundId, int roundStatus);
        FunctionReplay.functionReplay UpdateRound(Rounds round);

        FunctionReplay.functionReplay UpdateCustomersToRound(List<CustomerRound> roundCustomers, int roundId);
        FunctionReplay.functionReplay UpdateRoundProductCustomer(List<RoundProductCustomer> updateProductToCustomerRound, int roundId);
        
        

        bool CheckIfUserCanUseRound(int UserID);

        List<Rounds> GetAllRounds(bool today, DateTime? startDate, DateTime? endDate);
    }
}