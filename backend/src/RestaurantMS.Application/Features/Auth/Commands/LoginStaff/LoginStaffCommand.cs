using MediatR;

namespace RestaurantMS.Application.Features.Auth.Commands.LoginStaff
{
    public record LoginStaffCommand(string Email, string Password) : IRequest<StaffAuthDto>;
    public record StaffAuthDto(long StaffId, string FullName, string Role, string Token);
}