using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateCustomerToken(Customer customer);
    string GenerateStaffToken(Staff staff);
}
