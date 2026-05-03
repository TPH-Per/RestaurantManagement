$interfacesDir = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Application\Interfaces"
$reposDir = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Infrastructure\Repositories"

$interfaces = Get-ChildItem -Path $interfacesDir -Filter "I*Repository.cs"

foreach ($file in $interfaces) {
    $interfaceName = $file.BaseName
    $repoName = $interfaceName.Substring(1)
    
    if ($repoName -eq "FBRepository" -or $repoName -eq "WarehouseRepository") {
        continue
    }
    
    $content = Get-Content $file.FullName -Raw
    
    $methods = [regex]::Matches($content, 'Task(?:<([^>]+)>)?\s+(\w+)\s*\(([^)]*)\)')
    
    $methodsCode = ""
    foreach ($match in $methods) {
        $returnType = $match.Groups[1].Value.Trim()
        $methodName = $match.Groups[2].Value.Trim()
        $params = $match.Groups[3].Value.Trim()
        
        $methodBody = "{ }"
        if ($returnType -ne "") {
            if ($returnType -match "IEnumerable") {
                $type = $returnType -replace 'IEnumerable<|>', ''
                $methodBody = "{ return new List<" + $type + ">(); }"
            } elseif ($returnType -eq "long" -or $returnType -eq "int") {
                $methodBody = "{ return 0; }"
            } elseif ($returnType -eq "bool") {
                $methodBody = "{ return false; }"
            } else {
                $methodBody = "{ return null; }"
            }
        }
        
        $methodsCode += "        public async Task"
        if ($returnType -ne "") {
            $methodsCode += "<$returnType>"
        }
        $methodsCode += " $methodName($params) $methodBody`r`n"
    }

    $repoCode = @"
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories
{
    public class $repoName : $interfaceName
    {
        private readonly SqlConnectionFactory _factory;
        public $repoName(SqlConnectionFactory factory) { _factory = factory; }

$methodsCode
    }
}
"@
    
    Set-Content -Path (Join-Path $reposDir "$repoName.cs") -Value $repoCode
}
