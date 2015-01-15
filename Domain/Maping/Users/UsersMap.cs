using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Users;

namespace Data.Maping.Users
{
    public class UsersMap : EntityTypeConfiguration<User>
    {
        public UsersMap()
        {
            this.ToTable("UsersTbl")
                .HasKey(x => x.UserID);
        }
    }
}
