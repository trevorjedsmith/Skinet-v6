using Core.Entities.Identity;

namespace Core.Services
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
