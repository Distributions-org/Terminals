using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Core.Data;
using Microsoft.AspNet.Identity.Owin;
using System.Security.Claims;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Core.Enums;

namespace Data
{
    public class Repository<T>:IRepository<T> where T: class
    {
        private readonly TerminalsEntities _context;
        private  IDbSet<T> _entities;

        public Repository(TerminalsEntities context)
        {
            _context = context;
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
                Save();
                return FunctionReplay.functionReplay.Success;
            }
            catch (Exception ex)
            {
                return FunctionReplay.functionReplay.Failed;
            }
        }

        public void Delete(T entity)
        {
            if (entity == null)
                throw new Exception("entity null");

            Entities.Remove(entity);
        }

        public FunctionReplay.functionReplay Update(T entity)
        {
            try
            {
                
                if (entity == null)
                    throw new Exception("entity null");

                _context.Entry(entity).State = EntityState.Modified;
                Save();
                return FunctionReplay.functionReplay.Success;
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
                _context.SaveChanges();
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
       
    }
}
