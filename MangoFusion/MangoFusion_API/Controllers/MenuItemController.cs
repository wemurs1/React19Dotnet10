using System.Net;
using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangoFusion_API.Controllers;

[ApiController]
[Route("api/MenuItem")]
public class MenuItemController(ApplicationDbContext db, IWebHostEnvironment env) : Controller
{
    private readonly ApiResponse _response = new ApiResponse();

    [HttpGet]
    public async Task<IActionResult> GetMenuItems()
    {
        _response.Result = await db.MenuItems.ToListAsync();
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpGet("{id:int}", Name = "GetMenuItem")]
    public async Task<IActionResult> GetMenuItem(int id)
    {
        if (id == 0)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }

        var menuItem = await db.MenuItems.FirstOrDefaultAsync(m => m.Id == id);
        if (menuItem is null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            return NotFound(_response);
        }

        _response.Result = menuItem;
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (menuItemCreateDTO.File == null || menuItemCreateDTO.File.Length == 0)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages = ["File is required"];
                    return BadRequest(_response);
                }

                var imagesPath = Path.Combine(env.WebRootPath, "images");
                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }
                var filePath = Path.Combine(imagesPath, menuItemCreateDTO.File.FileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await menuItemCreateDTO.File.CopyToAsync(stream);
                }

                MenuItem menuItem = new()
                {
                    Name = menuItemCreateDTO.Name,
                    Description = menuItemCreateDTO.Description,
                    Price = menuItemCreateDTO.Price,
                    Category = menuItemCreateDTO.Category,
                    SpecialTag = menuItemCreateDTO.SpecialTag,
                    Image = "images/" + menuItemCreateDTO.File.FileName
                };
                db.MenuItems.Add(menuItem);
                await db.SaveChangesAsync();

                _response.Result = menuItem;
                _response.StatusCode = HttpStatusCode.Created;
                return CreatedAtRoute("GetMenuItem", new { id = menuItem.Id }, _response);
            }
            else
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(_response);
            }
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = [ex.ToString()];
            return BadRequest(_response);
        }
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse>> UpdateMenuItem(int id, [FromForm] MenuItemUpdateDTO menuItemUpdateDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (menuItemUpdateDTO == null || menuItemUpdateDTO.Id != id)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }

                MenuItem? menuItemFromDb = await db.MenuItems.FirstOrDefaultAsync(m => m.Id == menuItemUpdateDTO.Id);
                if (menuItemFromDb is null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                menuItemFromDb.Name = menuItemUpdateDTO.Name;
                menuItemFromDb.Description = menuItemUpdateDTO.Description;
                menuItemFromDb.Price = menuItemUpdateDTO.Price;
                menuItemFromDb.Category = menuItemUpdateDTO.Category;
                menuItemFromDb.SpecialTag = menuItemUpdateDTO.SpecialTag;

                if (menuItemUpdateDTO.File != null && menuItemUpdateDTO.File.Length > 0)
                {
                    var imagesPath = Path.Combine(env.WebRootPath, "images");
                    if (!Directory.Exists(imagesPath))
                    {
                        Directory.CreateDirectory(imagesPath);
                    }
                    var filePath = Path.Combine(imagesPath, menuItemUpdateDTO.File.FileName);
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                    var filePathOldFile = Path.Combine(env.WebRootPath, menuItemFromDb.Image);
                    if (System.IO.File.Exists(filePathOldFile))
                    {
                        System.IO.File.Delete(filePathOldFile);
                    }
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await menuItemUpdateDTO.File.CopyToAsync(stream);
                    }
                    menuItemFromDb.Image = "images/" + menuItemUpdateDTO.File.FileName;
                }

                db.MenuItems.Update(menuItemFromDb);
                await db.SaveChangesAsync();

                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            else
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(_response);
            }
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = [ex.ToString()];
            return BadRequest(_response);
        }
    }
}
