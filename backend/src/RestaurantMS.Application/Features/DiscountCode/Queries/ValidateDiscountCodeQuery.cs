using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Domain.Exceptions;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.DiscountCode.Queries;

public record ValidateDiscountCodeQuery(string Code) : IRequest<DiscountCodeDto>;
public record DiscountCodeDto(
    long Id, string Code, string DiscountType, decimal Value,
    decimal? MinOrderAmount, decimal? MaxDiscountAmount,
    bool IsActive, DateTime ValidTo, int UsedCount, int? UsageLimit);

public class ValidateDiscountCodeQueryHandler : IRequestHandler<ValidateDiscountCodeQuery, DiscountCodeDto>
{
    private readonly IUnitOfWork _uow;
    public ValidateDiscountCodeQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<DiscountCodeDto> Handle(ValidateDiscountCodeQuery req, CancellationToken ct)
    {
        var code = await _uow.DiscountCodes.GetByCodeAsync(req.Code)
            ?? throw new NotFoundException("DiscountCode", req.Code);

        if (!code.IsActive) throw new DomainException("Discount code is not active.");
        if (code.ValidTo < DateTime.UtcNow) throw new DomainException("Discount code has expired.");
        if (code.UsageLimit > 0 && code.UsedCount >= code.UsageLimit) throw new DomainException("Discount code usage limit reached.");

        return new DiscountCodeDto(
            code.DiscountCodeId, code.Code, code.DiscountType, code.DiscountValue,
            code.MinOrderAmount, code.MaxDiscountAmount,
            code.IsActive, code.ValidTo, code.UsedCount, code.UsageLimit);
    }
}
