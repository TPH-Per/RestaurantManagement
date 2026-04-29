namespace RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

public record CustomerAuthDto(
    long CustomerId,
    string FullName,
    string Phone,
    string? Email,
    string Token
);
