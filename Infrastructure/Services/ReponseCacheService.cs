using Core.Services;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class ReponseCacheService : IReponseCacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly JsonSerializerOptions _jsonOptions;

        public ReponseCacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public void CacheResponseAsync(string cachekey, object response, DateTimeOffset absoluteExpiration)
        {
            if (response == null)
                return;

            var serializedResponse = JsonSerializer.Serialize(response, _jsonOptions);
            _memoryCache.Set(cachekey, serializedResponse, absoluteExpiration);
        }

        public string GetCachedResponseAsync(string cachekey)
        {
            if (_memoryCache.TryGetValue(cachekey, out string cachedData))
                return cachedData;

            return null;
        }
    }
}
