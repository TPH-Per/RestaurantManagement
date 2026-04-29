namespace backend.Application.Common.Interfaces;

public interface ICurrentUserService
{
    long? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}
