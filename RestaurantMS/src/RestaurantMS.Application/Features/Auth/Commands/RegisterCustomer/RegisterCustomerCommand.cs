using MediatR;

namespace RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

public record RegisterCustomerCommand(
    string FullName,
    string Phone,
    string Password,
    string? Email,
    string? Address,
    string? Gender
) : IRequest<CustomerAuthDto>;
