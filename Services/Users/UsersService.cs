using System.Collections.Generic;
using System.Linq;
using Core.Data;
using Core.Domain.Persons;
using Core.Domain.Users;
using Data;
using Core.MD5;
using Core.Enums;
using Core.Domain.Users;
using AutoMapper;

namespace Services
{
    public  class UsersService : IUserService
    {
        private readonly IRepository<UsersTbl> _usersRepository;

        public UsersService(IRepository<UsersTbl> usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public FunctionReplay.functionReplay AddNewUser(User addUser)
        {
            Mapper.CreateMap<User, UsersTbl>()
                .ForMember(a => a.RoleID, b => b.MapFrom(c => (int)c.RoleID));


            UsersTbl newUser = Mapper.Map<User, UsersTbl>(addUser);
            return _usersRepository.Add(newUser);
        }

        public User LoginUser(string email, string Password)
        {
            string decPassword = Password;
            UsersTbl user = _usersRepository.FindBy(x => x.Email == email && x.Password == decPassword).FirstOrDefault();
            if (user != null)
	        {
                User CurrentUser = new User();
                CurrentUser.Email = user.Email;
                CurrentUser.FirstName = user.FirstName;
                CurrentUser.LastName = user.LastName;
                CurrentUser.RoleID = (UserRoles.userRoles)user.RoleID;
                CurrentUser.ManagerId = user.ManagerID;
                return CurrentUser;
	        }
            return null;
        }

        public FunctionReplay.functionReplay UpdateUser(User userToUpdate)
        {
            Mapper.CreateMap<User, UsersTbl>()
               .ForMember(a => a.RoleID, b => b.MapFrom(c => (int)c.RoleID));


            UsersTbl UpdateUser = Mapper.Map<User, UsersTbl>(userToUpdate);
            return _usersRepository.Update(UpdateUser);
        }

        public List<User> GetAllUsers(int ManagerId)
        {
            Mapper.CreateMap<UsersTbl, User>()
                .ForMember(a => a.RoleID, b => b.MapFrom(c => (UserRoles.userRoles)c.RoleID));

            List<UsersTbl> allUsers = _usersRepository.FindBy(x => x.ManagerID == ManagerId).ToList();
            return Mapper.Map<List<UsersTbl>, List<User>>(allUsers);

        }

        public User GetUserById(int UserID)
        {
            Mapper.CreateMap<UsersTbl, User>()
                .ForMember(a => a.RoleID, b => b.MapFrom(c => (UserRoles.userRoles)c.RoleID));

            UsersTbl currentUser = _usersRepository.FindBy(x => x.UserID == UserID).FirstOrDefault();
            return Mapper.Map<UsersTbl, User>(currentUser);
        }
    }
}
