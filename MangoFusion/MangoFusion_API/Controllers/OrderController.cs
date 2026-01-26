using System.Net;
using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using MangoFusion_API.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangoFusion_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController(ApplicationDbContext db) : Controller
{
    private readonly ApplicationDbContext _db = db;
    private readonly ApiResponse _response = new ApiResponse();

    [HttpGet]
    public ActionResult<ApiResponse> GetOrders(string userId = "")
    {
        IEnumerable<OrderHeader> orderHeaderList = _db.OrderHeaders.Include(d => d.OrderDetails).ThenInclude(m => m.MenuItem).OrderByDescending(o => o.OrderHeaderId);
        if (!string.IsNullOrEmpty(userId))
        {
            orderHeaderList = orderHeaderList.Where(u => u.ApplicationUserId == userId);
        }
        _response.Result = orderHeaderList;
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpGet("{orderId:int}")]
    public ActionResult<ApiResponse> GetOrder(int orderId)
    {
        if (orderId == 0)
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.ErrorMessages.Add("Invalid order id");
            return BadRequest(_response);
        }

        OrderHeader? orderHeader = _db.OrderHeaders.Include(d => d.OrderDetails).ThenInclude(m => m.MenuItem).FirstOrDefault(o => o.OrderHeaderId == orderId);

        if (orderHeader is null)
        {
            _response.IsSuccess = false;
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.ErrorMessages.Add("Order not found");
            return NotFound(_response);
        }

        _response.Result = orderHeader;
        _response.StatusCode = HttpStatusCode.OK;
        _response.IsSuccess = true;
        return Ok(_response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> CreateOrder([FromBody] OrderHeaderCreateDTO orderHeaderDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                OrderHeader orderHeader = new()
                {
                    PickUpName = orderHeaderDTO.PickUpName,
                    PickUpPhoneNumber = orderHeaderDTO.PickUpPhoneNumber,
                    PickUpEmail = orderHeaderDTO.PickUpEmail,
                    OrderDate = DateTime.UtcNow,
                    OrderTotal = orderHeaderDTO.OrderTotal,
                    Status = SD.Status_Confirmed,
                    TotalItems = orderHeaderDTO.TotalItems,
                    ApplicationUserId = orderHeaderDTO.ApplicationUserId
                };
                _db.OrderHeaders.Add(orderHeader);
                await _db.SaveChangesAsync();

                foreach (var orderDetailDto in orderHeaderDTO.OrderDetailsDTO)
                {
                    OrderDetail orderDetail = new()
                    {
                        OrderHeaderId = orderHeader.OrderHeaderId,
                        MenuItemId = orderDetailDto.MenuItemId,
                        Quantity = orderDetailDto.Quantity,
                        ItemName = orderDetailDto.ItemName,
                        Price = orderDetailDto.Price
                    };
                    _db.OrderDetails.Add(orderDetail);
                }
                await _db.SaveChangesAsync();
                _response.Result = orderHeader;
                orderHeader.OrderDetails = [];
                _response.StatusCode = HttpStatusCode.Created;
                return CreatedAtAction(nameof(GetOrder), new { orderId = orderHeader.OrderHeaderId }, _response);
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

    [HttpPut("{orderId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateOrder(int orderId, [FromBody] OrderHeaderUpdateDTO orderHeaderDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (orderId != orderHeaderDTO.OrderHeaderId)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages.Add("Invalid Id");
                    return BadRequest(_response);
                }
                OrderHeader? orderHeaderFromDb = await _db.OrderHeaders.FirstOrDefaultAsync(o => o.OrderHeaderId == orderId);
                if (orderHeaderFromDb is null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    _response.ErrorMessages.Add("Order not found");
                    return NotFound(_response);
                }

                if (!string.IsNullOrEmpty(orderHeaderDTO.PickUpPhoneNumber))
                {
                    orderHeaderFromDb.PickUpPhoneNumber = orderHeaderDTO.PickUpPhoneNumber;
                }
                if (!string.IsNullOrEmpty(orderHeaderDTO.PickUpName))
                {
                    orderHeaderFromDb.PickUpName = orderHeaderDTO.PickUpName;
                }
                if (!string.IsNullOrEmpty(orderHeaderDTO.PickUpEmail))
                {
                    orderHeaderFromDb.PickUpEmail = orderHeaderDTO.PickUpEmail;
                }
                if (!string.IsNullOrEmpty(orderHeaderDTO.Status))
                {
                    if (orderHeaderFromDb.Status.Equals(SD.Status_Confirmed, StringComparison.InvariantCultureIgnoreCase)
                        && orderHeaderDTO.Status.Equals(SD.Status_ReadyForPickUp, StringComparison.InvariantCultureIgnoreCase))
                    {
                        orderHeaderFromDb.Status = SD.Status_ReadyForPickUp;
                    }
                    if (orderHeaderFromDb.Status.Equals(SD.Status_ReadyForPickUp, StringComparison.InvariantCultureIgnoreCase)
                        && orderHeaderDTO.Status.Equals(SD.Status_Completed, StringComparison.InvariantCultureIgnoreCase))
                    {
                        orderHeaderFromDb.Status = SD.Status_Completed;
                    }
                    if (orderHeaderFromDb.Status.Equals(SD.Status_Cancelled, StringComparison.InvariantCultureIgnoreCase))
                    {
                        orderHeaderFromDb.Status = SD.Status_Cancelled;
                    }
                }

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
