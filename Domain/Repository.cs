using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Remoting.Messaging;
using System.Threading.Tasks;
using Core.Data;
using Core.Enums;

namespace Data
{
    public class Repository<T>:IRepository<T>,IDisposable where T: class
    {
        private readonly TerminalsEntities _context;
        private  IDbSet<T> _entities;

        public Repository(TerminalsEntities context)
        {
            _context = context;
        }

        //When you expect a model back (async)
        public async Task<IList<T>> ExecWithStoreProcedureAsync<T>(string query, params object[] parameters)
        {
            try
            {
                return await _context.Database.SqlQuery<T>(query, parameters).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
           
        }

        //When you expect a model back
        public IEnumerable<T> ExecWithStoreProcedure<T>(string query)
        {
            return _context.Database.SqlQuery<T>(query);
        }

        // Fire and forget (async)
        public async Task ExecuteWithStoreProcedureAsync(string query, params object[] parameters)
        {
            await _context.Database.ExecuteSqlCommandAsync(query, parameters);
        }

        // Fire and forget
        public void ExecuteWithStoreProcedure(string query, params object[] parameters)
        {
            _context.Database.ExecuteSqlCommand(query, parameters);
        }

        public DbRawSqlQuery<T> ExecWithStoreProcedure(string query, params object[] parameters)
        {
            return _context.Database.SqlQuery<T>(query, parameters);
        }

        public IQueryable<T> GetAll()
        {
            return Entities;
        }

        public IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            return Entities.Where(predicate);
        }

        public FunctionReplay.functionReplay Add(T entity)
        {
            try
            {
                if (entity == null)
                    throw new Exception("entity null");
            
                Entities.Add(entity);

                return Save();
            }
            catch (Exception ex)
            {
                return FunctionReplay.functionReplay.Failed;
            }
        }

        public FunctionReplay.functionReplay Delete(T entity)
        {
            try
            {
                if (entity == null)
                    throw new Exception("entity null");

                Entities.Remove(entity);

                return Save();
            }
            catch (Exception)
            {

                return FunctionReplay.functionReplay.Failed;
            }
        }

        public FunctionReplay.functionReplay Update(T entity)
        {
            try
            {
                if (entity == null)
                    throw new Exception("entity null");
                _context.Entry(entity).State = EntityState.Modified;

                return Save();
            }
            catch (Exception)
            {
                return FunctionReplay.functionReplay.Failed;
            }
        }

        public FunctionReplay.functionReplay Save()
        {
            try
            {
              int x =  _context.SaveChanges();
                return FunctionReplay.functionReplay.Success;
            }
            catch (Exception)
            {
                return FunctionReplay.functionReplay.Failed;
            }
        }

        private IDbSet<T> Entities
        {
            get
            {
                if (_entities == null)
                    _entities = _context.Set<T>();
                return _entities;
            }
        }

        public void Dispose()
        {
            if (this._context != null)
            {
                this._context.Dispose();
            }
        }
    }
}
