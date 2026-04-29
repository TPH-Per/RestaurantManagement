$services = @(
    "auth", "customer", "order", "orderItem", "menuItem", 
    "category", "table", "reservation", "invoice", "inventoryItem", 
    "supplier", "purchaseOrder", "payment", "shift"
)

$template = @"
import apiClient from './apiClient';

export interface {0}DTO {
    id?: number | string;
    [key: string]: any;
}

export const {1}Service = {
    getAll: () => apiClient.get<{0}DTO[]>('/{1}'),
    getById: (id: number | string) => apiClient.get<{0}DTO>(`/{1}/${id}`),
    create: (data: {0}DTO) => apiClient.post<{0}DTO>('/{1}', data),
    update: (id: number | string, data: {0}DTO) => apiClient.put<{0}DTO>(`/{1}/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/{1}/${id}`)
};
"@

foreach ($service in $services) {
    $className = (Get-Culture).TextInfo.ToTitleCase($service)
    $endpointName = $service
    if ($service -eq "auth") {
        $endpointName = "user"
    }
    $content = $template -f $className, $endpointName
    Set-Content -Path "C:\Users\Per\Downloads\project1day\frontend\src\services\${service}Service.ts" -Value $content
}

# Refactor all Vue files to use <script setup lang="ts">
$vueFiles = Get-ChildItem -Path "C:\Users\Per\Downloads\project1day\frontend\src" -Filter *.vue -Recurse
foreach ($file in $vueFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "<script setup>") {
        $content = $content -replace "<script setup>", "<script setup lang=`"ts`">"
        Set-Content -Path $file.FullName -Value $content
    }
}
