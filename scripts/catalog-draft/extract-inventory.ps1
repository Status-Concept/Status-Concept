param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,
  [string]$OutputRoot
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
  $repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
  $OutputRoot = Join-Path $repoRoot '.catalog-private'
}

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$sourceInfo = Get-Item -LiteralPath $resolvedInput
$sourceHash = (Get-FileHash -LiteralPath $resolvedInput -Algorithm SHA256).Hash.ToLowerInvariant()
$sourceFileId = 'inventory-' + $sourceHash.Substring(0, 16)
$inventoryRoot = Join-Path $OutputRoot 'sources\inventory'
$originalRoot = Join-Path $inventoryRoot 'original'
$rawRoot = Join-Path $OutputRoot 'raw'
$reportRoot = Join-Path $OutputRoot 'reports'

foreach ($directory in @($inventoryRoot, $originalRoot, $rawRoot, $reportRoot)) {
  New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

function Convert-ExcelValueToString([object]$value) {
  if ($null -eq $value) { return '' }
  if ($value -is [double] -or $value -is [decimal] -or $value -is [int] -or $value -is [long]) {
    return [string]::Format([Globalization.CultureInfo]::InvariantCulture, '{0}', $value)
  }
  return [string]$value
}

function Get-Sha256Text([string]$value) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($value)
  $hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
  return ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
}

$excel = $null
$workbook = $null
$rows = New-Object System.Collections.Generic.List[object]
$csvRows = New-Object System.Collections.Generic.List[object]
$headers = New-Object System.Collections.Generic.List[object]
$sheetName = ''
$usedRowCount = 0
$usedColumnCount = 0
$usedStartRow = 1

try {
  $excel = New-Object -ComObject Excel.Application
  $excel.Visible = $false
  $excel.DisplayAlerts = $false
  $workbook = $excel.Workbooks.Open($resolvedInput, 0, $true)
  $sheet = $workbook.Worksheets.Item(1)
  $sheetName = [string]$sheet.Name
  $used = $sheet.UsedRange
  $usedRowCount = [int]$used.Rows.Count
  $usedColumnCount = [int]$used.Columns.Count
  $usedStartRow = [int]$used.Row
  $rawMatrix = $used.Value2

  for ($column = 1; $column -le $usedColumnCount; $column++) {
    $headerValue = Convert-ExcelValueToString $rawMatrix.GetValue(1, $column)
    if ([string]::IsNullOrWhiteSpace($headerValue)) {
      $headerValue = 'Column ' + $column
    }
    $headers.Add([ordered]@{
      columnIndex = $column
      header = $headerValue
      key = 'column' + $column
    })
  }

  for ($relativeRow = 2; $relativeRow -le $usedRowCount; $relativeRow++) {
    $sourceColumns = New-Object System.Collections.Generic.List[object]
    $values = [ordered]@{}
    $displayValues = [ordered]@{}

    for ($column = 1; $column -le $usedColumnCount; $column++) {
      $value = Convert-ExcelValueToString $rawMatrix.GetValue($relativeRow, $column)
      $display = $value
      $sourceColumns.Add([ordered]@{
        columnIndex = $column
        header = $headers[$column - 1].header
        value = $value
        displayValue = $display
      })
      $values['column' + $column] = $value
      $displayValues['column' + $column] = $display
    }

    $reference = [string]$values.column2
    if ([string]::IsNullOrWhiteSpace($reference)) {
      $reference = [string]$displayValues.column2
    }
    $reference = $reference.Trim()
    $sourceRow = $usedStartRow + $relativeRow - 1
    $canonicalForHash = [ordered]@{
      sourceFileId = $sourceFileId
      sourceSheet = $sheetName
      sourceRow = $sourceRow
      sourceReference = $reference
      originalValues = $sourceColumns.ToArray()
    }
    $rowJson = $canonicalForHash | ConvertTo-Json -Depth 20 -Compress
    $rowHash = Get-Sha256Text $rowJson
    $record = [ordered]@{
      sourceFileId = $sourceFileId
      sourceSheet = $sheetName
      sourceRow = $sourceRow
      sourceReference = $reference
      originalValues = $sourceColumns.ToArray()
      values = $values
      displayValues = $displayValues
      rowHash = $rowHash
    }
    $rows.Add($record)

    $csvRow = [ordered]@{
      sourceFileId = $sourceFileId
      sourceSheet = $sheetName
      sourceRow = $sourceRow
      sourceReference = $reference
      rowHash = $rowHash
    }
    for ($column = 1; $column -le $usedColumnCount; $column++) {
      $csvRow['column' + $column] = $values['column' + $column]
    }
    $csvRows.Add([pscustomobject]$csvRow)
  }
}
finally {
  if ($null -ne $workbook) {
    $workbook.Close($false)
    [Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
  }
  if ($null -ne $excel) {
    $excel.Quit()
    [Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

$references = @($rows | ForEach-Object { $_.sourceReference } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
$uniqueReferences = @($references | Sort-Object -Unique)
if ($rows.Count -ne 2651) {
  throw ('Expected 2651 data rows, imported ' + $rows.Count + '.')
}
if ($references.Count -ne 2651) {
  throw ('Expected 2651 non-empty references, imported ' + $references.Count + '.')
}
if ($uniqueReferences.Count -ne 2651) {
  throw ('Expected 2651 unique references, imported ' + $uniqueReferences.Count + '.')
}

$copyPath = Join-Path $originalRoot $sourceInfo.Name
Copy-Item -LiteralPath $resolvedInput -Destination $copyPath -Force
$jsonlPath = Join-Path $rawRoot 'inventory-rows.jsonl'
$csvPath = Join-Path $rawRoot 'inventory-rows.csv'
$manifestPath = Join-Path $inventoryRoot 'source-manifest.json'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$jsonLines = @($rows | ForEach-Object { $_ | ConvertTo-Json -Depth 20 -Compress })
[IO.File]::WriteAllLines($jsonlPath, $jsonLines, $utf8NoBom)
$csvLines = @($csvRows | ConvertTo-Csv -NoTypeInformation)
[IO.File]::WriteAllLines($csvPath, $csvLines, $utf8NoBom)

$manifest = [ordered]@{
  version = 1
  sourceFileId = $sourceFileId
  originalFileName = $sourceInfo.Name
  originalSizeBytes = [int64]$sourceInfo.Length
  originalLastWriteTimeUtc = $sourceInfo.LastWriteTimeUtc.ToString('o')
  sha256 = $sourceHash
  sourceSheet = $sheetName
  usedRange = [ordered]@{
    rowsIncludingHeader = $usedRowCount
    columns = $usedColumnCount
  }
  columns = $headers.ToArray()
  storedOriginalPath = '.catalog-private/sources/inventory/original/' + $sourceInfo.Name
  generatedFiles = @(
    '.catalog-private/raw/inventory-rows.jsonl',
    '.catalog-private/raw/inventory-rows.csv'
  )
  validation = [ordered]@{
    dataRows = $rows.Count
    nonEmptyReferences = $references.Count
    uniqueReferences = $uniqueReferences.Count
    stockUsedForSelection = $false
  }
  generatedAt = [DateTime]::UtcNow.ToString('o')
}
[IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 20), $utf8NoBom)
Write-Host ('Imported ' + $rows.Count + ' rows and ' + $uniqueReferences.Count + ' unique references.')
