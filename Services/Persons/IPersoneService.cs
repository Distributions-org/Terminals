using System.Collections;
using System.Collections.Generic;
using Core.Domain.Persons;

namespace Services.Users
{
    public interface IPersoneService
    {
        void AddPersone(Person person);
        IList<Person> GetPersons();
    }
}