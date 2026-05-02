using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.DiscountCode.Queries;

public record GetDiscountCodesQuery() : IRequest<IEnumerable<DiscountCodeDto>>;

public class GetDiscountCodesQueryHandler : IRequestHandler<GetDiscountCodesQuery, IEnumerable<DiscountCodeDto>>
{
    private readonly IUnitOfWork _uow;
    public GetDiscountCodesQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<DiscountCodeDto>> Handle(GetDiscountCodesQuery req, CancellationToken ct)
    {
        var codes = await _uow.DiscountCodes.GetAllAsync();
        return codes.Select(c => new DiscountCodeDto(c.DiscountCodeId, c.Code, c.DiscountType,
            c.DiscountValue, c.MinOrderAmount, c.MaxDiscountAmount,
            c.IsActive, c.ValidTo, c.UsedCount, c.UsageLimit));
    }
}
