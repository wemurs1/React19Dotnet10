using System.Net;

namespace MangoFusion_API.Models;

public class ApiResponse<T> where T : class
{
    public HttpStatusCode StatusCode { get; set; }
    public bool IsSuccess { get; set; } = true;
    public List<string> ErrorMessages { get; set; } = [];
    public T? Result { get; set; }
}
