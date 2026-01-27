using System.Net;
using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangoFusion_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderDetailsController(ApplicationDbContext db) : Controller
{
    private readonly ApplicationDbContext _db = db;
    private readonly ApiResponse<OrderDetailsUpdateDTO> _response = new();

    [HttpPut("{orderDetailsId:int}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsUpdateDTO>>> UpdateOrder(int orderDetailsId, [FromBody] OrderDetailsUpdateDTO orderDetailsDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (orderDetailsId != orderDetailsDTO.OrderDetailId)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages.Add("Invalid Id");
                    return BadRequest(_response);
                }

                OrderDetail? orderDetailFromDb = await _db.OrderDetails.FirstOrDefaultAsync(o => o.OrderDetailId == orderDetailsId);
                if (orderDetailFromDb is null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.ErrorMessages.Add("Order not found");
                    return NotFound(_response);
                }

                orderDetailFromDb.Rating = orderDetailsDTO.Rating;

                await _db.SaveChangesAsync();

                _response.StatusCode = HttpStatusCode.NoContent;
                _response.IsSuccess = true;
                return Ok(_response);
            }
            else
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages = ModelState.Values.SelectMany(u => u.Errors).Select(u => u.ErrorMessage).ToList();
                return BadRequest(_response);
            }
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.InternalServerError;
            _response.ErrorMessages.Add(ex.Message);
            return StatusCode((int)HttpStatusCode.InternalServerError, _response);
        }
    }
}
