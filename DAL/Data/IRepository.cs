using System.Data.Entity.Infrastructure;
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
        FunctionReplay.functionReplay Delete(T entity);
        FunctionReplay.functionReplay Update(T entity);
        FunctionReplay.functionReplay Save();

        Task<IList<T>> ExecWithStoreProcedureAsync<T>(string query, params object[] parameters);
        IEnumerable<T> ExecWithStoreProcedure<T>(string query);
        Task ExecuteWithStoreProcedureAsync(string query, params object[] parameters);
        void ExecuteWithStoreProcedure(string query, params object[] parameters);
        DbRawSqlQuery<T> ExecWithStoreProcedure(string query, params object[] parameters);
    }
}
