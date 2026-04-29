namespace RestaurantMS.API.Common;

public class ApiResponse<T>
{
    public T Data { get; set; }
    public string Message { get; set; }
    public bool Success { get; set; } = true;

    public static ApiResponse<T> Ok(T data, string message = null)
    {
        return new ApiResponse<T> { Data = data, Message = message };
    }
}

