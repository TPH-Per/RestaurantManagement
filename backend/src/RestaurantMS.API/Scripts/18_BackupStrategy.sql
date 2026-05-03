-- 18_BackupStrategy.sql
-- Note: This script assumes SQL Server Agent is enabled.
-- In Docker, ensure environment variable MSSQL_AGENT_ENABLED=Y is set.

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_BackupRestaurantDb]') AND type in (N'P', N'PC'))
BEGIN
EXEC('
CREATE PROCEDURE [dbo].[sp_BackupRestaurantDb]
AS
BEGIN
    DECLARE @FileName NVARCHAR(255);
    DECLARE @Date NVARCHAR(20);
    SET @Date = REPLACE(REPLACE(REPLACE(CONVERT(NVARCHAR, GETDATE(), 120), ''-'', ''''), '' '', ''_''), '':'', '''');
    SET @FileName = ''/var/opt/mssql/data/RestaurantDb_'' + @Date + ''.bak'';

    BACKUP DATABASE [RestaurantDb]
    TO DISK = @FileName
    WITH FORMAT, MEDIANAME = ''RestaurantDbBackup'', NAME = ''Full Backup of RestaurantDb'';
END
')
END
GO
