﻿

//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


namespace Data
{

using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;


public partial class TerminalsEntities : DbContext
{
    public TerminalsEntities()
        : base("name=TerminalsEntities")
    {

    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        throw new UnintentionalCodeFirstException();
    }


    public DbSet<AspNetRole> AspNetRoles { get; set; }

    public DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    public DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    public DbSet<AspNetUser> AspNetUsers { get; set; }

    public DbSet<Customer> Customers { get; set; }

    public DbSet<ManagersTbl> ManagersTbls { get; set; }

    public DbSet<ProductCustomerTbl> ProductCustomerTbls { get; set; }

    public DbSet<Product> Products { get; set; }

    public DbSet<RoundsCustomerProductTbl> RoundsCustomerProductTbls { get; set; }

    public DbSet<RoundsCustomerTbl> RoundsCustomerTbls { get; set; }

    public DbSet<RoundsTbl> RoundsTbls { get; set; }

    public DbSet<RoundsUserTbl> RoundsUserTbls { get; set; }

    public DbSet<UsersTbl> UsersTbls { get; set; }

    public DbSet<ProductCustomerPriceTbl> ProductCustomerPriceTbls { get; set; }

    public DbSet<VitTbl> VitTbls { get; set; }

}

}

