using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Data
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        IQueryable<T> FindBy(Expression<Func<T, bool>> predicate);
        FunctionReplay.functionReplay Add(T entity);
        void Delete(T entity);
        FunctionReplay.functionReplay Update(T entity);
        FunctionReplay.functionReplay Save();
    }
}
