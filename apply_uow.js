const fs = require('fs');
const path = require('path');

const dir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

const baseRepoCode = `
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public abstract class BaseRepository
{
    protected readonly SqlConnectionFactory _factory;
    protected readonly UnitOfWork _uow;

    protected BaseRepository(SqlConnectionFactory factory, UnitOfWork uow)
    {
        _factory = factory;
        _uow = uow;
    }

    protected async Task<(SqlConnection conn, SqlTransaction? tx, bool owned)> GetConnAsync()
    {
        if (_uow.ActiveConnection != null)
            return (_uow.ActiveConnection, _uow.ActiveTransaction, false);

        var conn = await _factory.CreateConnectionAsync();
        return (conn, null, true);
    }
}
`;

fs.writeFileSync(path.join(dir, 'BaseRepository.cs'), baseRepoCode.trim());

let uowCode = fs.readFileSync(path.join(dir, 'UnitOfWork.cs'), 'utf8');
if (!uowCode.includes('internal SqlConnection?')) {
    uowCode = uowCode.replace('public class UnitOfWork : IUnitOfWork\n{', 'public class UnitOfWork : IUnitOfWork\n{\n    internal SqlConnection? ActiveConnection => _connection;\n    internal SqlTransaction? ActiveTransaction => _transaction;');
    uowCode = uowCode.replace(/new (\w+)Repository\(_factory\)/g, 'new $1Repository(_factory, this)');
    fs.writeFileSync(path.join(dir, 'UnitOfWork.cs'), uowCode);
}

const files = fs.readdirSync(dir);
for (const file of files) {
    if (file.endsWith('Repository.cs') && file !== 'UnitOfWork.cs' && file !== 'BaseRepository.cs') {
        let code = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Inherit BaseRepository
        if (code.includes('public class ') && !code.includes('BaseRepository')) {
            code = code.replace(/public class (\w+Repository) : (I\w+Repository)/, 'public class $1 : BaseRepository, $2');
        }
        
        // Fix constructor
        code = code.replace(/public \w+Repository\(SqlConnectionFactory factory\)\s*(?:=>\s*_factory\s*=\s*factory;|\s*\{\s*.*\s*\})/, function(match, p1) {
            const name = match.match(/public (\w+Repository)/)[1];
            return `public ${name}(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}`;
        });
        
        // Remove private _factory if it exists
        code = code.replace(/private readonly SqlConnectionFactory _factory;\n?/, '');

        // Replace connection logic
        code = code.replace(/await using var conn = await _factory\.CreateConnectionAsync\(\);\s*await using var cmd = conn\.CreateCommand\(\);/g, `var (conn, tx, owned) = await GetConnAsync();
        try
        {
            await using var cmd = conn.CreateCommand();
            cmd.Transaction = tx;`);
            
        // Because of the 'try', we need to close the block before the method ends.
        // It's risky to do this via regex for all files. 
    }
}
