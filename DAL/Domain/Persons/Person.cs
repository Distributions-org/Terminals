using System;

namespace Core.Domain.Persons
{
    public class Person:BaseEntity
    {
        public string FristName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime BirthDate { get; set; }
        public int ManagerId { get; set; }
    }
}
