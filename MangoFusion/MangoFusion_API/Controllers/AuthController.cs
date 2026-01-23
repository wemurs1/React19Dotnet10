using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using MangoFusion_API.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;

namespace MangoFusion_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration) : Controller
{
    private readonly string _secretKey = configuration.GetValue<string>("ApiSettings:Secret") ?? "";
    private readonly ApiResponse _response = new ApiResponse();
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
    {
        if (ModelState.IsValid)
        {
            ApplicationUser newUser = new()
            {
                Email = model.Email,
                UserName = model.Email,
                NormalizedEmail = model.Email.ToUpper(),
                Name = model.Name
            };

            var result = await _userManager.CreateAsync(newUser, model.Password);
            if (result.Succeeded)
            {
                if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
                {
                    await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                    await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                }

                if (model.Role.Equals(SD.Role_Admin, StringComparison.CurrentCultureIgnoreCase))
                {
                    await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);
                }
                else
                {
                    await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    _response.ErrorMessages.Add(error.Description);
                }
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest(_response);
            }
        }
        else
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            foreach (var error in ModelState.Values)
            {
                foreach (var item in error.Errors)
                {
                    _response.ErrorMessages.Add(item.ErrorMessage);
                }
            }
            return BadRequest(_response);
        }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
    {
        if (ModelState.IsValid)
        {
            var userFromDb = await _userManager.FindByEmailAsync(model.Email);
            if (userFromDb is not null)
            {
                bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);
                if (!isValid)
                {
                    _response.Result = new LoginResponseDTO();
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    _response.ErrorMessages.Add("Invalid Credentials");
                    return BadRequest(_response);
                }

                JwtSecurityTokenHandler tokenHandler = new();
                byte[] key = Encoding.ASCII.GetBytes(_secretKey);

                SecurityTokenDescriptor tokenDescriptor = new()
                {
                    Subject = new ClaimsIdentity([
                        new ("fullname", userFromDb.Name),
                        new ("id", userFromDb.Id),
                        new (ClaimTypes.Email,userFromDb.Email!.ToString()),
                        new (ClaimTypes.Role, _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault()!)
                    ]),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

                LoginResponseDTO loginResponse = new()
                {
                    Email = userFromDb.Email,
                    Token = tokenHandler.WriteToken(token),
                    Role = _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault()!
                };

                _response.Result = loginResponse;
                _response.IsSuccess = true;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            _response.Result = new LoginResponseDTO();
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Invalid Credentials");
            return BadRequest(_response);
        }
        else
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            foreach (var error in ModelState.Values)
            {
                foreach (var item in error.Errors)
                {
                    _response.ErrorMessages.Add(item.ErrorMessage);
                }
            }
            return BadRequest(_response);
        }
    }
}
