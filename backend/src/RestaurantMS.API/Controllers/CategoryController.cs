using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Category.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/categories")]
[ApiController]
[Authorize(Policy = "ManagerOnly")]
public class CategoryController : ControllerBase
{
    private readonly IMediator _m;
    public CategoryController(IMediator m) => _m = m;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllCategoriesQuery(), ct)); // Mock list
}
