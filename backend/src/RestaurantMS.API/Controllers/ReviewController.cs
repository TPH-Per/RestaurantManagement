using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Review.Queries;
using RestaurantMS.Application.Features.Review.Commands.CreateReview;

namespace RestaurantMS.API.Controllers;

[Route("api/reviews")]
[ApiController]
[Authorize(Policy = "CustomerOnly")]
public class ReviewController : ControllerBase
{

    private readonly IMediator _m;
    public ReviewController(IMediator m) => _m = m;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewCommand cmd, CancellationToken ct) 
        => Ok(await _m.Send(cmd, ct));

    [HttpGet]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllReviewsQuery(), ct));
}