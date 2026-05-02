using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Application.Common.Exceptions;

namespace RestaurantMS.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try { await _next(ctx); }
        catch (Exception ex) { await HandleAsync(ctx, ex); }
    }

    private async Task HandleAsync(HttpContext ctx, Exception ex)
    {
        _logger.LogError(ex, "Unhandled: {Message}", ex.Message);

        var (status, code, message) = ex switch
        {
            FreshRawCannotBeSoldException e    => (422, "FRESH_RAW_CANNOT_BE_SOLD",          e.Message),
            StockCannotGoNegativeException e   => (422, "INSUFFICIENT_STOCK",                e.Message),
            InhouseCannotBeImportedException e => (422, "INHOUSE_IMPORT_FORBIDDEN",          e.Message),
            ReviewRequiresPaidInvoiceException e => (422, "REVIEW_REQUIRES_PAID_INVOICE",    e.Message),
            InvoiceRequiresCompletedOrderException e => (422, "INVOICE_REQUIRES_COMPLETED",  e.Message),
            TableNotAvailableException e       => (422, "TABLE_NOT_AVAILABLE",               e.Message),
            NotFoundException e   => (404, "NOT_FOUND", e.Message),
            ValidationException e => (400, "VALIDATION_ERROR", string.Join("; ", e.Errors)),
            ForbiddenException e  => (403, "FORBIDDEN",  e.Message),
            DomainException e                  => (422, "DOMAIN_RULE_VIOLATION",             e.Message),
            UnauthorizedAccessException e => (401, "UNAUTHORIZED", e.Message),

            _ => (500, "INTERNAL_ERROR", "An unexpected error occurred.")
        };

        ctx.Response.StatusCode  = status;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsJsonAsync(new
        {
            success = false,
            error   = new { code, message }
        });
    }
}
