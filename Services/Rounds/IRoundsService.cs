using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Domain.Managers;
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
        List<Rounds> GetRoundsByDate(DateTime startdate, DateTime enddate, int ManagerId);
        IList<RoundProductCustomer> GetRoundCustomerProducts(int CustomerID, int RoundID);

        FunctionReplay.functionReplay UpdateRoundProductCustomerDeliveredAmount(int RoundProductCustomerID, int DeliveredAmount);

        FunctionReplay.functionReplay UpdateRoundStatus(int roundId, int roundStatus);
        FunctionReplay.functionReplay UpdateRound(Rounds round);

        FunctionReplay.functionReplay UpdateCustomersToRound(List<CustomerRound> roundCustomers, int roundId);
        FunctionReplay.functionReplay UpdateRoundProductCustomer(List<RoundProductCustomer> updateProductToCustomerRound, int roundId);

        List<RoundProductCustomer> CheckProductAmountPerRound(int ProductID, int RoundID, int TotalAmount);

        bool CheckIfUserCanUseRound(int UserID);

        Task<IList<Rounds>> GetAllRounds(bool today, DateTime? startDate, DateTime? endDate,string email,int managerId);

        FunctionReplay.functionReplay DeleteProductFromRound(ProductToCustomer product,int roundId);

        Manager GetManagerDetails(int ManagerID);
    }
}