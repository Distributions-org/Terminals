using System;
using Core.Enums;

namespace Core.Domain.Rounds
{
    public class RoundsDbModel
    {
        public int RoundsID { get; set; }
        public int? ManagerID { get; set; }
        public string RoundName { get; set; }
        public DateTime RoundDate { get; set; }
        public RoundStatus.roundStatus RoundStatus { get; set; }
        public int RoundsUserID { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public UserRoles.userRoles RoleID { get; set; }
        public int RoundsCustomersID { get; set; }
        public int CustomerID { get; set; }
        public bool RoundCustomerStatus { get; set; }
        public Core.Enums.CustomerStatus.customerStatus Status { get; set; }
        public string CustomerName { get; set; }
        public string CustomerHP { get; set; }
        public int RoundsCustomerProductID { get; set; }
        public int ProductID { get; set; }
        public int Amount { get; set; }
        public int DelieveredAmount { get; set; }
        public int ProductCustomerID { get; set; }
        public int DayTypeID { get; set; }
        public double Cost { get; set; }
        public string ProductName { get; set; }
        public ProductStatus.productStatus ProductStatus { get; set; }


    }
}
