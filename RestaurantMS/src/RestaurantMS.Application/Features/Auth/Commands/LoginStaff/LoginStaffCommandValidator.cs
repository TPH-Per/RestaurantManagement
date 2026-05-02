using FluentValidation;

namespace RestaurantMS.Application.Features.Auth.Commands.LoginStaff
{
    public class LoginStaffCommandValidator : AbstractValidator<LoginStaffCommand>
    {
        public LoginStaffCommandValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        }
    }
}