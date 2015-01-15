using System.Collections;
using System.Collections.Generic;
using Core.Domain.Users;
using Core.Enums;

namespace Services
{
    public interface IUserService
    {
        FunctionReplay.functionReplay AddNewUser(User addUser);
        User LoginUser(string email, string Password);
        FunctionReplay.functionReplay UpdateUser(User userToUpdate);
        List<User> GetAllUsers();
        User GetUserById(int UserID);
    }
}