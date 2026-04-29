using MediatR;
using Microsoft.EntityFrameworkCore;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;

namespace RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

public class RegisterCustomerCommandHandler : IRequestHandler<RegisterCustomerCommand, CustomerAuthDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public RegisterCustomerCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<CustomerAuthDto> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        // Check if phone already exists
        if (await _context.Customers.AnyAsync(c => c.Phone == request.Phone, cancellationToken))
        {
            throw new DomainException("Phone number is already registered.");
        }

        var customer = new Customer
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

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

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
