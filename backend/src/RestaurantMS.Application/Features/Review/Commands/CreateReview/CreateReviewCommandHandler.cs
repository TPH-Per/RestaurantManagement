using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Review.Commands.CreateReview
{
    public record CreateReviewCommand(long InvoiceId, int Stars, string Content) : IRequest<ReviewDto>;
    public record ReviewDto(long ReviewId, long InvoiceId, int Stars, string Content);

    public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public CreateReviewCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _uow = uow;
            _currentUser = currentUser;
        }

        public async Task<ReviewDto> Handle(CreateReviewCommand cmd, CancellationToken ct)
        {
            var invoice = await _uow.Invoices.GetByIdAsync(cmd.InvoiceId)
                ?? throw new NotFoundException(nameof(RestaurantMS.Domain.Entities.Invoice), cmd.InvoiceId);

            // Enforce 1 review per invoice
            if (await _uow.Reviews.ExistsByInvoiceIdAsync(cmd.InvoiceId))
                throw new DomainException("This invoice already has a review.");

            // Domain factory: throws ReviewRequiresPaidInvoiceException if not PAID
            var review = RestaurantMS.Domain.Entities.Review.Create(invoice, _currentUser.UserId ?? 0, cmd.Stars, cmd.Content);

            review.ReviewId = await _uow.Reviews.InsertAndReturnIdAsync(review);
            return new ReviewDto(review.ReviewId, cmd.InvoiceId, review.Stars, review.Content ?? string.Empty);
        }
    }
}