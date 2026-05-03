using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Review.Queries;
public record GetAllReviewsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReviewsQueryHandler : IRequestHandler<GetAllReviewsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReviewsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReviewsQuery req, CancellationToken ct) {
        var items = await _uow.Reviews.GetAllAsync();
        return items;
    }
}