using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Reservation.Queries;
public record GetAllReservationsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReservationsQueryHandler : IRequestHandler<GetAllReservationsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReservationsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReservationsQuery req, CancellationToken ct) {
        var items = await _uow.Reservations.GetAllAsync();
        return items;
    }
}