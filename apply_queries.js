const fs = require('fs');
const path = require('path');

const featDir = 'RestaurantMS/src/RestaurantMS.Application/Features';
const ctlDir = 'RestaurantMS/src/RestaurantMS.API/Controllers';

// Queries to create
const queries = {
    'Category/Queries/GetAllCategoriesQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Category.Queries;
public record GetAllCategoriesQuery() : IRequest<IEnumerable<object>>;
public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllCategoriesQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllCategoriesQuery req, CancellationToken ct) {
        var items = await _uow.Categories.GetAllAsync();
        return items;
    }
}`,
    'Manufacturer/Queries/GetManufacturersQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Manufacturer.Queries;
public record GetManufacturersQuery() : IRequest<IEnumerable<object>>;
public class GetManufacturersQueryHandler : IRequestHandler<GetManufacturersQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetManufacturersQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetManufacturersQuery req, CancellationToken ct) {
        var items = await _uow.Manufacturers.GetAllAsync();
        return items;
    }
}`,
    'Customer/Queries/GetAllCustomersQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Customer.Queries;
public record GetAllCustomersQuery() : IRequest<IEnumerable<object>>;
public class GetAllCustomersQueryHandler : IRequestHandler<GetAllCustomersQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllCustomersQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllCustomersQuery req, CancellationToken ct) {
        var items = await _uow.Customers.GetAllAsync();
        return items;
    }
}`,
    'Receipt/Queries/GetAllReceiptsQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Receipt.Queries;
public record GetAllReceiptsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReceiptsQueryHandler : IRequestHandler<GetAllReceiptsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReceiptsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReceiptsQuery req, CancellationToken ct) {
        var items = await _uow.Receipts.GetAllAsync();
        return items;
    }
}`,
    'Review/Queries/GetAllReviewsQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Review.Queries;
public record GetAllReviewsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReviewsQueryHandler : IRequestHandler<GetAllReviewsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReviewsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReviewsQuery req, CancellationToken ct) {
        var items = await _uow.Reviews.GetAllAsync();
        return items;
    }
}`,
    'Reservation/Queries/GetAllReservationsQuery.cs': `
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Application.Features.Reservation.Queries;
public record GetAllReservationsQuery() : IRequest<IEnumerable<object>>;
public class GetAllReservationsQueryHandler : IRequestHandler<GetAllReservationsQuery, IEnumerable<object>> {
    private readonly IUnitOfWork _uow;
    public GetAllReservationsQueryHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<IEnumerable<object>> Handle(GetAllReservationsQuery req, CancellationToken ct) {
        var items = await _uow.TableReservations.GetAllAsync();
        return items;
    }
}`
};

for (const [file, code] of Object.entries(queries)) {
    const fullPath = path.join(featDir, file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, code.trim());
}

// Update controllers to use the new queries
const controllers = {
    'CategoryController.cs': [
        /using System.Threading.Tasks;/g, 
        'using System.Threading.Tasks;\nusing RestaurantMS.Application.Features.Category.Queries;'
    ],
    'ManufacturerController.cs': [
        /using System.Threading.Tasks;/g, 
        'using System.Threading.Tasks;\nusing RestaurantMS.Application.Features.Manufacturer.Queries;'
    ],
    'CustomerController.cs': [
        /using System.Threading.Tasks;/g, 
        'using System.Threading.Tasks;\nusing RestaurantMS.Application.Features.Customer.Queries;'
    ],
    'ReceiptController.cs': [
        /using System.Threading.Tasks;/g, 
        'using System.Threading.Tasks;\nusing RestaurantMS.Application.Features.Receipt.Queries;'
    ],
    'ReviewController.cs': [
        /using System.Threading.Tasks;/g, 
        'using System.Threading.Tasks;\nusing RestaurantMS.Application.Features.Review.Queries;'
    ]
};

for (const [file, replacements] of Object.entries(controllers)) {
    const fullPath = path.join(ctlDir, file);
    if (fs.existsSync(fullPath)) {
        let code = fs.readFileSync(fullPath, 'utf8');
        code = code.replace(replacements[0], replacements[1]);
        
        if (file === 'CategoryController.cs') {
            code = code.replace(/Ok\(new List<object>\(\)\)/, 'Ok(await _m.Send(new GetAllCategoriesQuery(), ct))');
        } else if (file === 'ManufacturerController.cs') {
            code = code.replace(/Ok\(new List<object>\(\)\)/, 'Ok(await _m.Send(new GetManufacturersQuery(), ct))');
        } else if (file === 'CustomerController.cs') {
            if (!code.includes('GetAll')) {
                code = code.replace(/public class CustomerController : ControllerBase\s*\{([^}]*)\}/, 
                    'public class CustomerController : ControllerBase\n{\n$1\n    [HttpGet]\n    [Authorize(Policy = "StaffOnly")]\n    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllCustomersQuery(), ct));\n}');
            }
        } else if (file === 'ReceiptController.cs') {
            if (!code.includes('GetAll')) {
                code = code.replace(/public class ReceiptController : ControllerBase\s*\{([^}]*)\}/, 
                    'public class ReceiptController : ControllerBase\n{\n$1\n    [HttpGet]\n    [Authorize(Policy = "StaffOnly")]\n    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllReceiptsQuery(), ct));\n}');
            }
        } else if (file === 'ReviewController.cs') {
            if (!code.includes('GetAll')) {
                code = code.replace(/public class ReviewController : ControllerBase\s*\{([^}]*)\}/, 
                    'public class ReviewController : ControllerBase\n{\n$1\n    [HttpGet]\n    [Authorize(Policy = "StaffOnly")]\n    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllReviewsQuery(), ct));\n}');
            }
        }
        fs.writeFileSync(fullPath, code);
    }
}

// Update TableReservationController.cs separately as it needs [HttpGet("all")]
const tableResPath = path.join(ctlDir, 'TableReservationController.cs');
let trCode = fs.readFileSync(tableResPath, 'utf8');
if (!trCode.includes('GetAll')) {
    trCode = trCode.replace('public class TableReservationController : ControllerBase\n{', 
        'public class TableReservationController : ControllerBase\n{\n    [HttpGet("all")]\n    [Authorize(Policy = "StaffOnly")]\n    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllReservationsQuery(), ct));\n');
    fs.writeFileSync(tableResPath, trCode);
}
