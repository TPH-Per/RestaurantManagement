using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Category.Queries;
public record GetAllCategoriesQuery() : IRequest<IEnumerable<object>>;
public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllCategoriesQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllCategoriesQuery req, CancellationToken ct) {
        var items = await _uow.Categories.GetAllAsync();
        return items;
    }
}