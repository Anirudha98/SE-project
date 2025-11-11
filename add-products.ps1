# Wait for server to be ready
Write-Host "Waiting for backend to be ready..."
Start-Sleep -Seconds 2

$products = @(
    @{
        name = "Handwoven Ceramic Bowl"
        description = "Beautiful oceanic-toned ceramic bowl with natural glazes. Perfect for serving or as a decorative centerpiece."
        price = 45.00
        stock = 12
        imageUrl = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500"
        artisanName = "Priya Desai"
    },
    @{
        name = "Sterling Silver Pendant"
        description = "Elegant handcrafted sterling silver pendant with intricate latticework and oxidized detailing."
        price = 89.00
        stock = 8
        imageUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500"
        artisanName = "Sachin Patel"
    },
    @{
        name = "Wooden Serving Tray"
        description = "Hand-carved teak wood serving tray with elegant brass handles. Perfect for entertaining guests."
        price = 65.00
        stock = 15
        imageUrl = "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500"
        artisanName = "Ramesh Kumar"
    },
    @{
        name = "Macrame Wall Hanging"
        description = "Bohemian-style macrame wall art handcrafted in natural cotton. Adds warmth to any space."
        price = 38.00
        stock = 20
        imageUrl = "https://images.unsplash.com/photo-1602932327237-2f3c2c7a0c3e?w=500"
        artisanName = "Anita Sharma"
    },
    @{
        name = "Leather Journal"
        description = "Hand-stitched leather journal with handmade paper. Perfect for writers and artists."
        price = 52.00
        stock = 10
        imageUrl = "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500"
        artisanName = "Vikram Singh"
    },
    @{
        name = "Clay Pottery Vase"
        description = "Rustic handmade vase with earthy terracotta finish. Each piece is unique."
        price = 42.00
        stock = 18
        imageUrl = "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500"
        artisanName = "Meera Joshi"
    },
    @{
        name = "Woven Basket Set"
        description = "Set of 3 handwoven baskets made from natural jute. Great for storage or decoration."
        price = 55.00
        stock = 14
        imageUrl = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500"
        artisanName = "Lakshmi Reddy"
    },
    @{
        name = "Hand-Painted Silk Scarf"
        description = "Luxurious silk scarf with hand-painted floral design. Each scarf is one-of-a-kind."
        price = 78.00
        stock = 6
        imageUrl = "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500"
        artisanName = "Kavita Nair"
    }
)

$successCount = 0
$failCount = 0

foreach ($product in $products) {
    try {
        $json = $product | ConvertTo-Json -Compress
        $response = Invoke-WebRequest `
            -Uri "http://localhost:5000/api/products" `
            -Method POST `
            -ContentType "application/json" `
            -Body $json `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Write-Host "✓ Added: $($product.name)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "✗ Failed to add: $($product.name)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $failCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Successfully added: $successCount products" -ForegroundColor Green
Write-Host "  Failed: $failCount products" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Cyan
