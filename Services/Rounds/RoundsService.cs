﻿using System.CodeDom;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
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
using System;
using Services.Users;
using Core.Domain.Managers;

namespace Services
{
    public class RoundsService : IRoundsService
    {
        private readonly IRepository<Data.UsersTbl> _UsersRepository;
        private readonly IRepository<Data.RoundsTbl> _RoundsRepository;
        private readonly IRepository<Data.Product> _ProductsRepository;
        private readonly IRepository<Data.Customer> _CustomersRepository;
        private readonly IRepository<ProductCustomerTbl> _ProductCustomerRepository;
        private readonly IRepository<RoundsUserTbl> _RoundsUserRepository;
        private readonly IRepository<RoundsCustomerTbl> _RoundsCustomerRepository;
        private readonly IRepository<RoundsCustomerProductTbl> _RoundsCustomerProductRepository;
        private readonly IRepository<ManagersTbl> _managersRepository;
        private readonly IUserService _userService;
        private readonly ICustomerService _customerService;

        public RoundsService(IRepository<Data.RoundsTbl> RoundsRepository, IRepository<Data.Customer> CustomersRepository,
            IRepository<ProductCustomerTbl> ProductCustomerRepository, IRepository<Data.Product> ProductsRepository
            , IRepository<Data.RoundsUserTbl> RoundsUserRepository,
            IRepository<Data.RoundsCustomerTbl> RoundsCustomerRepository, IRepository<RoundsCustomerProductTbl> RoundsCustomerProductRepository,
            IUserService userService, ICustomerService customerService, IRepository<ManagersTbl> managersRepository)
        {
            _RoundsRepository = RoundsRepository;
            _CustomersRepository = CustomersRepository;
            _ProductCustomerRepository = ProductCustomerRepository;
            _ProductsRepository = ProductsRepository;
            _RoundsUserRepository = RoundsUserRepository;
            _RoundsCustomerRepository = RoundsCustomerRepository;
            _RoundsCustomerProductRepository = RoundsCustomerProductRepository;
            _userService = userService;
            _customerService = customerService;
            _managersRepository = managersRepository;
        }

        public int CreateNewRound(Rounds NewRound)
        {
            MappingToDB();
            RoundsTbl newDBRound = Mapper.Map<Rounds, RoundsTbl>(NewRound);
            _RoundsRepository.Add(newDBRound);
            return _RoundsRepository.FindBy(x => x.ManagerID == NewRound.ManagerId).OrderByDescending(x => x.RoundsID).Select(x => x.RoundsID).FirstOrDefault();
        }

        public List<Rounds> GetRoundsByDate(DateTime startdate, DateTime enddate,int ManagerId)
        {
            MapDBToRound();
            List<RoundsTbl> allDbRounds = _RoundsRepository.FindBy(x => x.RoundDate >= startdate && x.RoundDate <= enddate && x.ManagerID == ManagerId).ToList();
            return Mapper.Map<List<RoundsTbl>, List<Rounds>>(allDbRounds);
        }

        public FunctionReplay.functionReplay AddRoundUsersToRound(List<User> RoundUsers, int RoundID)
        {
            try
            {
                Mapper.Reset();
                Mapper.CreateMap<User, RoundsUserTbl>()
                    .ForMember(a => a.RoundsID, b => b.MapFrom(c => RoundID));

                List<RoundsUserTbl> newRoundUsers = Mapper.Map<List<User>, List<RoundsUserTbl>>(RoundUsers);

                foreach (var RoundUser in newRoundUsers)
                {
                    _RoundsUserRepository.Add(RoundUser);
                }
                return FunctionReplay.functionReplay.Success;
            }
            catch (System.Exception ex)
            {
                return FunctionReplay.functionReplay.Failed;
            }

                
        }

        public FunctionReplay.functionReplay AddCustomersToRound(List<CustomerRound> RoundCustomers, int RoundID)
        {
            try
            {
                Mapper.Reset();
                Mapper.CreateMap<CustomerRound, RoundsCustomerTbl>()
                 .ForMember(a => a.RoundsID, b => b.MapFrom(c => RoundID))
                 .ForMember(a => a.CustomerID, b => b.MapFrom(c => c.customerRound.CustomerID));
                List<RoundsCustomerTbl> newRoundCust = Mapper.Map<List<CustomerRound>, List<RoundsCustomerTbl>>(RoundCustomers);
                foreach (var roundCust in newRoundCust)
                {
                    roundCust.RoundCustomerStatus = false;
                    _RoundsCustomerRepository.Add(roundCust);
                }
                return FunctionReplay.functionReplay.Success;
            }
            catch (System.Exception)
            {
                
                return FunctionReplay.functionReplay.Failed;
            }
            
        }

        public List<ProductToCustomer> GetCustomerProducts(int CustomerID, DaysType.DayType currentDayType)
        {
            Mapper.CreateMap<ProductCustomerTbl, ProductToCustomer>()
                .ForMember(a => a.dayType, b => b.MapFrom(c => (DaysType.DayType)c.DayTypeID))
                .ForMember(a => a.CustomerName, b => b.MapFrom(c => _CustomersRepository.FindBy(x => x.CustomerID == c.CustomerID).FirstOrDefault().CustomerName))
                .ForMember(a => a.ProductName, b => b.MapFrom(c => _ProductsRepository.FindBy(x => x.ProductID == c.ProductID).FirstOrDefault().ProductName));

            List<ProductCustomerTbl> currentProductToCustomerTbl = _ProductCustomerRepository.FindBy(x => x.CustomerID == CustomerID && x.DayTypeID == (int)currentDayType).ToList();
            List<ProductToCustomer> currentProductToCustomer = Mapper.Map<List<ProductCustomerTbl>, List<ProductToCustomer>>
                (currentProductToCustomerTbl);

            return currentProductToCustomer;
        }

        public FunctionReplay.functionReplay AddRoundProductCustomer(List<RoundProductCustomer> addedProductToCustomerRound, int RoundID)
        {
            try
            {
                Mapper.Reset();
                Mapper.CreateMap<RoundProductCustomer, RoundsCustomerProductTbl>()
                    .ForMember(a => a.RoundsCustomersID, b => b.MapFrom(c => _RoundsCustomerRepository.FindBy(x => x.RoundsID == RoundID && x.CustomerID == c.CustomerRoundProduct.CustomerID).FirstOrDefault().RoundsCustomersID))
                    .ForMember(a => a.ProductID, b => b.MapFrom(c => c.CustomerRoundProduct.ProductID))
                    .ForMember(a => a.Amount, b => b.MapFrom(c => c.Amount))
                    .ForMember(a => a.DelieveredAmount, b => b.MapFrom(c => c.DeliveredAmount));

                List<RoundsCustomerProductTbl> NewRoundsCustomerProductTbl = Mapper.Map<List<RoundProductCustomer>, List<RoundsCustomerProductTbl>>(addedProductToCustomerRound);
                 
                foreach (var item in NewRoundsCustomerProductTbl)
                {
                    _RoundsCustomerProductRepository.Add(item);
                }

                return FunctionReplay.functionReplay.Success;
            
            }
            catch (System.Exception ex)
            {
                return FunctionReplay.functionReplay.Failed;
            }

        }

        public IList<RoundProductCustomer> GetRoundCustomerProducts(int CustomerID, int RoundID)
        {
            int RoundCustomerID = _RoundsCustomerRepository.FindBy(x => x.CustomerID == CustomerID && x.RoundsID == RoundID).FirstOrDefault().RoundsCustomersID;
            var allRoundCustomerProducts = _RoundsCustomerProductRepository.FindBy(x => x.RoundsCustomersID == RoundCustomerID).ToListAsync();
            IList<RoundProductCustomer> allroundProducts = new List<RoundProductCustomer>();

            foreach (var item in allRoundCustomerProducts.Result)
            {
                RoundProductCustomer currentRound = new RoundProductCustomer();
                ProductToCustomer currentCustomer = new ProductToCustomer();
                currentCustomer.ProductID = item.ProductID.Value;

                currentCustomer.ProductName = _ProductsRepository.FindBy(x => x.ProductID == item.ProductID).FirstOrDefault().ProductName;
                currentCustomer.CustomerID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == item.RoundsCustomersID.Value).FirstOrDefault().CustomerID.Value;
                currentCustomer.CustomerName = _CustomersRepository.FindBy(x => x.CustomerID == currentCustomer.CustomerID).FirstOrDefault().CustomerName;
                ProductCustomerTbl PCT = new ProductCustomerTbl();
                PCT = _ProductCustomerRepository.FindBy(x => x.CustomerID == currentCustomer.CustomerID && x.ProductID == item.ProductID).FirstOrDefault();
                if (PCT == null)
                    continue;
                currentCustomer.ProductCustomerID = PCT.ProductCustomerID;
                currentCustomer.Cost = PCT.Cost.Value;
               
                currentRound.CustomerRoundProduct = currentCustomer;
                currentRound.Amount = item.Amount.Value;
                currentRound.RoundsCustomerProductID = item.RoundsCustomerProductID;
                if (item.DelieveredAmount != null) currentRound.DeliveredAmount = item.DelieveredAmount.Value;
                allroundProducts.Add(currentRound);
            }
            
            return allroundProducts;

        }


        public async Task<IList<Rounds>> GetAllRounds(bool today,DateTime? startDate,DateTime? endDate,string email,int managerId)
        {
            IList<Rounds> rounds = new List<Rounds>();
            var roundsDb = await RoundsDbModels(today, startDate, endDate, managerId);
            rounds = MappingToRound(roundsDb.GroupBy(x => x.RoundsID)).ToList();
            if (!string.IsNullOrWhiteSpace(email))
            {
                return rounds.Where(x => x.RoundUser.First().Email == email).ToList();
            }

            return rounds;
        }

        private async Task<IList<RoundsDbModel>> RoundsDbModels(bool today, DateTime? startDate, DateTime? endDate, int managerId)
        {
            startDate = startDate.HasValue ? startDate.Value : DateTime.Now;
            endDate = endDate.HasValue ? endDate.Value : DateTime.Now;

            IList<RoundsDbModel> roundsDb;
            roundsDb =
                await
                    _RoundsRepository.ExecWithStoreProcedureAsync<RoundsDbModel>(
                        "sp_get_rounds_by_manager_id @startDate, @endtDate, @today, @managerId",
                        new SqlParameter("startDate", startDate), new SqlParameter("endtDate", endDate),
                        new SqlParameter("today", today), new SqlParameter("managerId", managerId));
            return roundsDb;
        }


        public List<RoundProductCustomer> CheckProductAmountPerRound(int ProductID, int RoundID, int TotalAmount)
        {
            List<int> RoundCustomerIDs = _RoundsCustomerRepository.FindBy(x => x.RoundsID == RoundID).Select(x => x.RoundsCustomersID).ToList();
            List<RoundsCustomerProductTbl> productRoundPerCustomer = _RoundsCustomerProductRepository.FindBy(x => x.ProductID == ProductID && RoundCustomerIDs.Any(y => y == x.RoundsCustomersID)).ToList();

            List<RoundProductCustomer> allroundProducts = new List<RoundProductCustomer>();

            foreach (var item in productRoundPerCustomer)
            {
                RoundProductCustomer currentRound = new RoundProductCustomer();
                ProductToCustomer currentCustomer = new ProductToCustomer();
                currentCustomer.ProductID = item.ProductID.Value;
                
                currentCustomer.ProductName = _ProductsRepository.FindBy(x => x.ProductID == item.ProductID).FirstOrDefault().ProductName;
                currentCustomer.CustomerID = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == item.RoundsCustomersID.Value).FirstOrDefault().CustomerID.Value;
                currentCustomer.CustomerName = _CustomersRepository.FindBy(x => x.CustomerID == currentCustomer.CustomerID).FirstOrDefault().CustomerName;
                ProductCustomerTbl PCT = new ProductCustomerTbl();
                PCT = _ProductCustomerRepository.FindBy(x => x.CustomerID == currentCustomer.CustomerID && x.ProductID == item.ProductID).FirstOrDefault();
                if (PCT == null)
                    continue;
                currentCustomer.ProductCustomerID = PCT.ProductCustomerID;
                currentCustomer.Cost = PCT.Cost.Value;
                
                currentRound.CustomerRoundProduct = currentCustomer;
                currentRound.RoundsCustomerProductID = item.RoundsCustomerProductID;
                currentRound.Amount = item.Amount.Value;
                currentRound.DeliveredAmount = item.DelieveredAmount.HasValue ? item.DelieveredAmount.Value : 0;
                allroundProducts.Add(currentRound);
            }

            return allroundProducts;

        }

        public FunctionReplay.functionReplay UpdateRoundProductCustomerDeliveredAmount(int RoundProductCustomerID, int DeliveredAmount)
        {
            RoundsCustomerProductTbl currentRoundCustomerProducts = _RoundsCustomerProductRepository.FindBy(x => x.RoundsCustomerProductID == RoundProductCustomerID).FirstOrDefault();
            currentRoundCustomerProducts.DelieveredAmount = DeliveredAmount;

            return _RoundsCustomerProductRepository.Update(currentRoundCustomerProducts);

        }

        public FunctionReplay.functionReplay UpdateRoundStatus(int roundId, int roundStatus)
        {
            var round = _RoundsRepository.FindBy(x => x.RoundsID == roundId).FirstOrDefault();
            if (round == null) return FunctionReplay.functionReplay.Failed;
            round.RoundStatus = roundStatus;
            var result = _RoundsRepository.Update(round);
            if (result.ToString() == "Success")
                return FunctionReplay.functionReplay.Success;

            return FunctionReplay.functionReplay.Failed;
        }

        public FunctionReplay.functionReplay UpdateCustomersToRound(List<CustomerRound> roundCustomers, int roundId)
        {
             try
            {
                Mapper.Reset();
                Mapper.CreateMap<CustomerRound, RoundsCustomerTbl>()
                    .ForMember(a => a.RoundsCustomersID, b => b.MapFrom(c => _RoundsCustomerRepository.FindBy(x => x.RoundsID == roundId && x.CustomerID == c.customerRound.CustomerID).FirstOrDefault().RoundsCustomersID))
                 .ForMember(a => a.RoundsID, b => b.MapFrom(c => roundId))
                 .ForMember(a => a.CustomerID, b => b.MapFrom(c => c.customerRound.CustomerID))
                 .ForMember(a => a.RoundCustomerStatus, b => b.MapFrom(c => c.customerRound.RoundCustomerStatus));
                List<RoundsCustomerTbl> newRoundCust = Mapper.Map<List<CustomerRound>, List<RoundsCustomerTbl>>(roundCustomers);
             
                foreach (var entity in newRoundCust)
                {
                    if (entity.RoundsCustomersID != 0)
                    {
                        RoundsCustomerTbl entity1 = entity;
                        var cast = _RoundsCustomerRepository.FindBy(x => x.RoundsCustomersID == entity1.RoundsCustomersID).First();
                        cast.RoundCustomerStatus = entity1.RoundCustomerStatus;
                        _RoundsCustomerRepository.Update(cast);
                    }
                    else
                    {
                        _RoundsCustomerRepository.Add(entity);
                    }
                }
                return FunctionReplay.functionReplay.Success;
            }
            catch (System.Exception)
            {   
                return FunctionReplay.functionReplay.Failed;
            }
        }

        public Manager GetManagerDetails(int ManagerID)
        {
            Mapper.Reset();
            Mapper.CreateMap<ManagersTbl, Manager>();
            Manager currentManager = Mapper.Map<ManagersTbl, Manager>(_managersRepository.FindBy(x => x.ManagerID == ManagerID).FirstOrDefault());

            return currentManager;
        }

        public FunctionReplay.functionReplay UpdateRoundProductCustomer(List<RoundProductCustomer> updateProductToCustomerRound, int roundId)
        {
             try
            {
                Mapper.Reset();
                Mapper.CreateMap<RoundProductCustomer, RoundsCustomerProductTbl>()
                    .ForMember(a => a.RoundsCustomersID, b => b.MapFrom(c => _RoundsCustomerRepository.FindBy(x => x.RoundsID == roundId  && x.CustomerID == c.CustomerRoundProduct.CustomerID).FirstOrDefault().RoundsCustomersID))
                    .ForMember(a => a.ProductID, b => b.MapFrom(c => c.CustomerRoundProduct.ProductID))
                    .ForMember(a => a.Amount, b => b.MapFrom(c => c.Amount))
                    .ForMember(a => a.DelieveredAmount, b => b.MapFrom(c => c.DeliveredAmount));

                var updateRoundsCustomerProductTbl = Mapper.Map<List<RoundProductCustomer>, List<RoundsCustomerProductTbl>>(updateProductToCustomerRound);
                foreach (var item in updateRoundsCustomerProductTbl)
                {
                    if (item.RoundsCustomerProductID != 0)
                    {
                        _RoundsCustomerProductRepository.Update(item);
                        //if (item.Amount == 0)
                        //{
                        //    _RoundsCustomerProductRepository.Delete(item);
                        //}
                        //else
                        //{
                        //    _RoundsCustomerProductRepository.Update(item);
                        //}
                    }
                    else
                    {
                        _RoundsCustomerProductRepository.Add(item);
                    }
                }
                return FunctionReplay.functionReplay.Success;
            
            }
            catch (System.Exception ex)
            {
                return FunctionReplay.functionReplay.Failed;
            }

        }
        
        public bool CheckIfUserCanUseRound(int UserID)
        {
            RoundsUserTbl currentUser = _RoundsUserRepository.FindBy(x => x.UserID == UserID).FirstOrDefault();
            if (currentUser != null)
            {
                return true;
            }
            return false;
        }

        public FunctionReplay.functionReplay DeleteProductFromRound(ProductToCustomer product, int roundId)
        {
            try
            {
                var rcId =
                    _RoundsCustomerRepository.FindBy(x => x.CustomerID == product.CustomerID && x.RoundsID == roundId).Single();
                var rcp =
                    _RoundsCustomerProductRepository.FindBy(
                        x =>
                            x.ProductID == product.ProductID && x.RoundsCustomersID == rcId.RoundsCustomersID).OfType<RoundsCustomerProductTbl>().FirstOrDefault();
                return _RoundsCustomerProductRepository.Delete(rcp);
            }
            catch (Exception)
            {
                return FunctionReplay.functionReplay.Failed;
            }
           
        }


        private void MappingToDB()
        {
            Mapper.CreateMap<Rounds, RoundsTbl>()
                .ForMember(a => a.RoundStatus, b => b.MapFrom(c => (int)c.roundStatus));
        }

        private void MapDBToRound()
        {
            Mapper.CreateMap<RoundsTbl, Rounds>()
                .ForMember(a => a.roundStatus, b => b.MapFrom(c => (RoundStatus.roundStatus)c.RoundStatus))
                .ForMember(a => a.RoundID, b => b.MapFrom(c => c.RoundsID));
        }

        private void MappingToClass()
        {
            
        }

        private void MapRoundProductCustomer()
        {

            Mapper.CreateMap<ProductCustomerTbl, RoundProductCustomer>()
                .ForMember(a => a.CustomerRoundProduct, b => b.MapFrom(c => Mapper.Map<ProductCustomerTbl, ProductToCustomer>(_ProductCustomerRepository.FindBy(x => x.ProductCustomerID == c.ProductCustomerID).FirstOrDefault())));
        }
        private void MapProductCustomer()
        {
            Mapper.CreateMap<ProductCustomerTbl, ProductToCustomer>()
                .ForMember(a => a.ProductName, b => b.MapFrom(z => _ProductsRepository.FindBy(x => x.ProductID == z.ProductID).FirstOrDefault().ProductName))
                .ForMember(p => p.dayType, b => b.MapFrom(z => (Core.Enums.DaysType.DayType)z.DayTypeID.Value))
                .ForMember(a => a.CustomerName, b => b.MapFrom(z => _CustomersRepository.FindBy(x => x.CustomerID == z.CustomerID).FirstOrDefault().CustomerName));

        }

        private void MapCustomer()
        {
            Mapper.CreateMap<Core.Domain.Customers.Customers, Data.Customer>()
                .ForMember(a => a.Status, b => b.MapFrom(z => (int)z.custStatus));
        }

        private async Task<IEnumerable<CustomerRound>> MapRoundCustomer(IQueryable<RoundsCustomerTbl> roundsCustomerTbl)
        {
            IList<CustomerRound> customerRoundTmp = new List<CustomerRound>();
            if (roundsCustomerTbl.Any())
            {
                await roundsCustomerTbl.ForEachAsync(roundsCustomer =>
                {
                    var firstOrDefault = _CustomersRepository.FindBy(x => x.CustomerID == roundsCustomer.CustomerID)
                        .FirstOrDefault();
                    if (firstOrDefault != null)
                        customerRoundTmp.Add(new CustomerRound
                        {
                            customerRound =
                                _customerService.GetValidCustomers(roundsCustomer.RoundsCustomersID,
                                    firstOrDefault
                                        .ManagerId).FirstOrDefault(x => x.CustomerID == roundsCustomer.CustomerID),
                            roundcustomerProducts =
                                GetRoundCustomerProducts(roundsCustomer.CustomerID.GetValueOrDefault(),
                                    roundsCustomer.RoundsID.GetValueOrDefault())
                        });
                });
            }

            return customerRoundTmp;
        }


        public FunctionReplay.functionReplay UpdateRound(Rounds round)
        {
            var map = Mapper.FindTypeMapFor<Rounds, RoundsTbl>();
            Mapper.CreateMap<Rounds, RoundsTbl>().ForMember(a => a.RoundsID, b => b.MapFrom(c => c.RoundID))
                .ForMember(a => a.RoundStatus, b => b.MapFrom(c => (int)c.roundStatus));
            var mapRoundTbl = Mapper.Map<Rounds, RoundsTbl>(round);
            return _RoundsRepository.Update(mapRoundTbl);
        }


        #region Private Method To Mapping Rounds

        private static IEnumerable<Rounds> MappingToRound(IEnumerable<IGrouping<int, RoundsDbModel>> roundsDb)
        {
            IList<Rounds> rounds = new List<Rounds>();
            if (roundsDb.Any())
            {
                roundsDb.Each(round =>
                {
                    if (round.Any())
                    {
                        rounds.Add(new Rounds
                        {
                            RoundID = round.First().RoundsID,
                            roundStatus = round.First().RoundStatus,
                            RoundDate = round.First().RoundDate,
                            RoundName = round.First().RoundName,
                            RoundUser = MapToUser(round.First()),
                            custRound = MapToRoundCustomer(round.ToList())
                        });

                    }
                }
                    );
            }
            return rounds;
        }

        private static IEnumerable<CustomerRound> MapToRoundCustomer(List<RoundsDbModel> rounds)
        {
            var cr = new List<CustomerRound>();
            var cusromerInround = rounds.Select(x => x.CustomerID).Distinct();
            cusromerInround.Each(r =>
            {
                var roundsTemp = rounds.Where(x => x.CustomerID == r).ToList();
                if (roundsTemp.Any())
                {
                    cr.Add(new CustomerRound
                    {
                        customerRound = new Core.Domain.Customers.Customers
                        {
                            CustomerName = roundsTemp.First().CustomerName,
                            CustomerHP = roundsTemp.First().CustomerHP,
                            CustomerID = roundsTemp.First().CustomerID,
                            custStatus = roundsTemp.First().Status,
                            ManagerId = roundsTemp.First().ManagerID.HasValue ? roundsTemp.First().ManagerID.Value : 0,
                            RoundCustomerStatus = roundsTemp.First().RoundCustomerStatus
                        },
                        roundcustomerProducts = MapToRoundcustomerProducts(roundsTemp)
                    });
                }
            });
            return cr.AsEnumerable();
        }

        private static IEnumerable<RoundProductCustomer> MapToRoundcustomerProducts(IEnumerable<RoundsDbModel> roundsDbModels)
        {
            var rpc = new List<RoundProductCustomer>();
            roundsDbModels.Each(x => rpc.Add(new RoundProductCustomer
            {
                Amount = x.Amount,
                CustomerRoundProduct = new ProductToCustomer
                {
                    Cost = x.Cost,
                    CustomerID = x.CustomerID,
                    CustomerName = x.CustomerName,
                    ProductCustomerID = x.ProductCustomerID,
                    ProductID = x.ProductID,
                    dayType = (DaysType.DayType)x.DayTypeID,
                    ProductName = x.ProductName
                },
                DeliveredAmount = x.DelieveredAmount,
                RoundsCustomerProductID = x.RoundsCustomerProductID
            }));
            return rpc.AsEnumerable();
        }

        private static IEnumerable<User> MapToUser(RoundsDbModel round)
        {
            Mapper.CreateMap<ManagersTbl, Manager>();
            return new List<User>
            {
                new User
                {
                    Email = round.Email,
                    FirstName = round.FirstName,
                    LastName = round.LastName,
                    ManagerId = round.UserID,
                    Password = "",
                    RoleID = round.RoleID,
                    UserID = round.UserID
                }
            }.AsEnumerable();
        }
        #endregion
       
    }
}
