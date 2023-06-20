using Core.Entities;
using Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace Core.Services
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : BaseEntity;
        Task<int> Complete();
    }
}
