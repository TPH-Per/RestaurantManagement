using backend.DTOs;

namespace backend.Application.Interfaces
{
    public interface IAuthService
    {
        Task<CustomerAuthResponse> RegisterCustomerAsync(CustomerRegisterRequest request);
        Task<CustomerAuthResponse> LoginCustomerAsync(CustomerLoginRequest request);
        Task<AuthResponse> LoginStaffAsync(LoginRequest request);
    }
}
