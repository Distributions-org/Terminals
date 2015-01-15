using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Domain.Persons;

namespace Data.Maping.Persons
{
    public class PersoneMap : EntityTypeConfiguration<Person>
    {
        public PersoneMap()
        {
            this.ToTable("Person")
                .HasKey(x => x.Id);
        }
    }
}
