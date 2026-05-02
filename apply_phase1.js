const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n');
    console.log(`Wrote ${filePath}`);
}

const basePath = 'RestaurantMS/src';

// 1. DiscountCodeController
writeFile(`${basePath}/RestaurantMS.API/Controllers/DiscountCodeController.cs`, `
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.DiscountCode.Commands;
using RestaurantMS.Application.Features.DiscountCode.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/discount-codes")]
[ApiController]
public class DiscountCodeController : ControllerBase
{
    private readonly IMediator _m;
    public DiscountCodeController(IMediator m) => _m = m;

    [HttpPost]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<IActionResult> Create([FromBody] CreateDiscountCodeCommand cmd, CancellationToken ct)
        => Ok(await _m.Send(cmd, ct));

    [HttpPut("{id}/toggle")]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<IActionResult> Toggle(long id, CancellationToken ct)
        => Ok(await _m.Send(new ToggleDiscountCodeCommand(id), ct));

    [HttpGet("validate/{code}")]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> Validate(string code, CancellationToken ct)
        => Ok(await _m.Send(new ValidateDiscountCodeQuery(code), ct));

    [HttpGet]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _m.Send(new GetDiscountCodesQuery(), ct));
}
`);

// 2. DiscountCode Features
writeFile(`${basePath}/RestaurantMS.Application/Features/DiscountCode/Queries/ValidateDiscountCodeQuery.cs`, `
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
`);

writeFile(`${basePath}/RestaurantMS.Application/Features/DiscountCode/Queries/GetDiscountCodesQuery.cs`, `
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
`);

writeFile(`${basePath}/RestaurantMS.Application/Features/DiscountCode/Commands/CreateDiscountCodeCommand.cs`, `
using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.DiscountCode.Queries;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.DiscountCode.Commands;

public record CreateDiscountCodeCommand(
    string Code, string DiscountType, decimal Value,
    decimal? MinOrderAmount, decimal? MaxDiscountAmount,
    DateTime ValidFrom, DateTime ValidTo, int? UsageLimit) : IRequest<DiscountCodeDto>;

public class CreateDiscountCodeCommandHandler : IRequestHandler<CreateDiscountCodeCommand, DiscountCodeDto>
{
    private readonly IUnitOfWork _uow;
    public CreateDiscountCodeCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<DiscountCodeDto> Handle(CreateDiscountCodeCommand cmd, CancellationToken ct)
    {
        var code = new Domain.Entities.DiscountCode {
            Code = cmd.Code,
            DiscountType = cmd.DiscountType,
            DiscountValue = cmd.Value,
            MinOrderAmount = cmd.MinOrderAmount,
            MaxDiscountAmount = cmd.MaxDiscountAmount,
            ValidFrom = cmd.ValidFrom,
            ValidTo = cmd.ValidTo,
            UsageLimit = cmd.UsageLimit,
            UsedCount = 0,
            IsActive = true
        };
        await _uow.DiscountCodes.AddAsync(code);
        return new DiscountCodeDto(code.DiscountCodeId, code.Code, code.DiscountType, code.DiscountValue, code.MinOrderAmount, code.MaxDiscountAmount, code.IsActive, code.ValidTo, code.UsedCount, code.UsageLimit);
    }
}
`);

writeFile(`${basePath}/RestaurantMS.Application/Features/DiscountCode/Commands/ToggleDiscountCodeCommand.cs`, `
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
`);
