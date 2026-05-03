using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;

namespace RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

public class RegisterCustomerCommandHandler : IRequestHandler<RegisterCustomerCommand, CustomerAuthDto>
{
    private readonly IUnitOfWork _uow;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public RegisterCustomerCommandHandler(
        IUnitOfWork uow,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _uow = uow;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<CustomerAuthDto> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        // Check if phone already exists
        if (await _uow.Customers.GetByPhoneAsync(request.Phone) != null)
        {
            throw new DomainException("Phone number is already registered.");
        }

        var customer = new RestaurantMS.Domain.Entities.Customer
        {
            FullName = request.FullName,
            Phone = request.Phone,
            Password = _passwordHasher.HashPassword(request.Password),
            Email = request.Email,
            Address = request.Address,
            Gender = request.Gender,
            MembershipLevel = "NORMAL",
            LoyaltyPoints = 0,
            CreatedAt = DateTime.UtcNow
        };

        customer.CustomerId = await _uow.Customers.InsertAndReturnIdAsync(customer);

        var token = _jwtTokenService.GenerateCustomerToken(customer);

        return new CustomerAuthDto(
            customer.CustomerId,
            customer.FullName,
            customer.Phone,
            customer.Email,
            token
        );
    }
}
