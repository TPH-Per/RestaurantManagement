namespace backend.Application.Common.Models;

public class PaginatedList<T>
{
    public PaginatedList(IReadOnlyCollection<T> items, int pageNumber, int totalCount, int pageSize)
    {
        Items = items;
        PageNumber = pageNumber;
        TotalCount = totalCount;
        PageSize = pageSize;
    }

    public IReadOnlyCollection<T> Items { get; }
    public int PageNumber { get; }
    public int TotalCount { get; }
    public int PageSize { get; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
