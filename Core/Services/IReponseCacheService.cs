using System;
using System.Threading.Tasks;

namespace Core.Services
{
    public interface IReponseCacheService
    {
        void CacheResponseAsync(string cachekey, object response, DateTimeOffset absoluteExpiration);
        string GetCachedResponseAsync(string cachekey);
    }
}
