using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Staff.Queries;

public record GetStaffQuery() : IRequest<IEnumerable<StaffDto>>;
public record StaffDto(long StaffId, string FullName, string Email, string Role, bool IsActive);

public class GetStaffQueryHandler : IRequestHandler<GetStaffQuery, IEnumerable<StaffDto>>
{
    private readonly IUnitOfWork _uow;
    public GetStaffQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<StaffDto>> Handle(GetStaffQuery req, CancellationToken ct)
    {
        var staff = await _uow.Staff.GetAllAsync();
        return staff.Select(s => new StaffDto(s.StaffId, s.FullName, s.Email, s.Role, s.IsActive));
    }
}