using System.Collections.Generic;
using System.Linq;
using Core.Data;
using Core.Domain.Persons;

namespace Services.Users
{
    public partial class PersoneService : IPersoneService
    {
        private readonly IRepository<Person> _persoRepository;

        public PersoneService(IRepository<Person> persoRepository)
        {
            _persoRepository = persoRepository;
        }
        public virtual void AddPersone(Person person)
        {
            _persoRepository.Add(person);
        }

        public IList<Person> GetPersons()
        {
            return _persoRepository.GetAll().ToList();
        }
    }
}
