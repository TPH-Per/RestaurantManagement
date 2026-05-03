using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.DiscountCode.Commands;

public record ToggleDiscountCodeCommand(long Id) : IRequest<Unit>;

public class ToggleDiscountCodeCommandHandler : IRequestHandler<ToggleDiscountCodeCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    public ToggleDiscountCodeCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(ToggleDiscountCodeCommand cmd, CancellationToken ct)
    {
        var code = await _uow.DiscountCodes.GetByIdAsync(cmd.Id)
            ?? throw new NotFoundException("DiscountCode", cmd.Id);
        code.IsActive = !code.IsActive;
        await _uow.DiscountCodes.UpdateAsync(code);
        return Unit.Value;
    }
}
