using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using RestaurantMS.Domain.Exceptions;

namespace RestaurantMS.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ExceptionHandlingMiddleware(RequestDelegate next) { _next = next; }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = ex switch
            {
                NotFoundDomainException => 404,
                UnauthorizedDomainException => 401,
                InvalidOperationDomainException => 400,
                _ => 500
            };
            await context.Response.WriteAsJsonAsync(new { Error = ex.Message });
        }
    }
}

