using backend.Application.Common.Interfaces;

namespace backend.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    public Task DeleteAsync(string path, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("File storage is scaffolded but not wired yet.");
    }

    public Task<string> SaveAsync(Stream content, string fileName, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("File storage is scaffolded but not wired yet.");
    }
}
