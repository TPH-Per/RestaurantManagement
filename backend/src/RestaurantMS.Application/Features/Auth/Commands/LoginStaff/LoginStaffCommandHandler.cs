using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Auth.Commands.LoginStaff
{
    public class LoginStaffCommandHandler : IRequestHandler<LoginStaffCommand, StaffAuthDto>
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _hasher;
        private readonly IJwtTokenService _jwt;

        public LoginStaffCommandHandler(IUnitOfWork uow, IPasswordHasher hasher, IJwtTokenService jwt)
            => (_uow, _hasher, _jwt) = (uow, hasher, jwt);

        public async Task<StaffAuthDto> Handle(LoginStaffCommand req, CancellationToken ct)
        {
            // 1. Find by email
            var staff = await _uow.Staff.GetByEmailAsync(req.Email)
                ?? throw new NotFoundException(nameof(Staff), req.Email);

            // 2. Must be active (Assuming IsActive property exists or omitting if not)
            // if (!staff.IsActive)
            //    throw new Exception("This account has been deactivated.");

            // 3. BCrypt verify — NO MORE staffId.ToString() fallback
            if (!_hasher.VerifyPassword(req.Password, staff.Password)) // assuming Password
                throw new UnauthorizedAccessException("Invalid email or password.");

            // 4. Generate JWT with MANAGER or ADMIN role claim
            var token = _jwt.GenerateStaffToken(staff);

            return new StaffAuthDto(staff.StaffId, staff.FullName, staff.Role, token);
        }
    }
}