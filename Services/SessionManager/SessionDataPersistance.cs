using System.Web;

namespace Services.SessionManager
{
    public class SessionDataPersistance<T> : IDataPersistance<T>
      where T : class
    {
        private static readonly string Key = typeof(T).FullName;

        public T ObjectValue
        {
            get
            {
                return HttpContext.Current.Session[Key] as T;
            }
            set
            {
                HttpContext.Current.Session[Key] = value;
            }
        }
    }
}
