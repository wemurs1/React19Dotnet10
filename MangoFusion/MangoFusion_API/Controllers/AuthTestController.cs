using MangoFusion_API.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangoFusion_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthTestController : Controller
{
    [HttpGet]
    [Authorize]
    public ActionResult<string> GetSomething()
    {
        return "You are an authorized user";
    }

    [HttpGet("{someValue:int}")]
    [Authorize(Roles = SD.Role_Admin)]
    public ActionResult<string> GetSomething(int someValue)
    {
        return "You are an authorized user, with Role of Admin";
    }
}
