namespace RestaurantMS.API.Models;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string Message { get; init; } = "OK";

    public static ApiResponse<T> SuccessResponse(T data, string message = "OK")
        => new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> FailResponse(string message)
        => new() { Success = false, Message = message };
}
