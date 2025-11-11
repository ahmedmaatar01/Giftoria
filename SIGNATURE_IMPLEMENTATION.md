# Gift Card Signature Implementation

## Overview
This document explains how gift card signatures (both text and drawn) are handled and stored in the database.

## Database Structure

### Commands Table
The `commands` table has the following gift card-related fields:

| Field | Type | Description |
|-------|------|-------------|
| `gift_card_signature` | TEXT | Stores either the signature text OR the file path to the signature image |
| `gift_card_signature_type` | ENUM('text', 'image') | Indicates whether the signature is text or an image |
| `gift_card_message` | TEXT | The gift card message/description |
| `gift_card_template_id` | INT | Foreign key to gift_cards table (NULL for custom designs) |

## How It Works

### Frontend (Checkout.jsx)
1. User can choose between two signature input modes:
   - **Text**: Simple text input field
   - **Draw**: Signature pad using the `signature_pad` library

2. When the user draws a signature:
   - The signature pad generates a **base64-encoded PNG image** (e.g., `data:image/png;base64,iVBORw0KG...`)
   - This base64 string is sent to the backend in the `gift_card.custom_signing` field

3. When the user types a signature:
   - The plain text is sent directly in the `gift_card.custom_signing` field

### Backend Processing (CommandController.php)

#### 1. Signature Detection
The `processSignature()` method automatically detects the signature type:

```php
private function processSignature($signature)
{
    if (empty($signature)) {
        return ['signature' => null, 'type' => null];
    }

    // Check if it's a base64 image (drawn signature)
    if (Str::startsWith($signature, 'data:image')) {
        // Process as image...
    }
    
    // Otherwise, it's text
    return ['signature' => $signature, 'type' => 'text'];
}
```

#### 2. Image Signature Processing
When a base64 image is detected:

1. **Extract** the image type (png, jpg, etc.) from the data URL
2. **Decode** the base64 data
3. **Generate** a unique filename: `signature_{uniqid}_{timestamp}.{ext}`
4. **Save** to `storage/app/public/signatures/`
5. **Return** the relative path: `signatures/signature_xyz.png`

#### 3. Database Storage
The processed signature is stored in the database:

```php
$command = Command::create([
    // ...other fields...
    'gift_card_signature' => $signatureData['signature'], // Path or text
    'gift_card_signature_type' => $signatureData['type'], // 'image' or 'text'
]);
```

### Example Database Entries

**Text Signature:**
```
gift_card_signature: "John Doe"
gift_card_signature_type: "text"
```

**Drawn Signature:**
```
gift_card_signature: "signatures/signature_6789abcd_1736509876.png"
gift_card_signature_type: "image"
```

## Retrieving Signatures

### API Response
When you fetch a command via the API, the response includes:

```json
{
  "id": 1,
  "gift_card_signature": "signatures/signature_xyz.png",
  "gift_card_signature_type": "image",
  "gift_card_signature_url": "http://localhost:8000/storage/signatures/signature_xyz.png"
}
```

### Accessor Method (Command.php)
The `gift_card_signature_url` accessor automatically generates the full URL:

```php
public function getGiftCardSignatureUrlAttribute()
{
    if (!$this->gift_card_signature) {
        return null;
    }

    // If it's a file path (image), return the full URL
    if ($this->gift_card_signature_type === 'image' || 
        str_starts_with($this->gift_card_signature, 'signatures/')) {
        return url('storage/' . $this->gift_card_signature);
    }

    // Otherwise it's text, return as-is
    return $this->gift_card_signature;
}
```

## Frontend Display

To display the signature in your frontend:

```jsx
// Check the signature type
if (order.gift_card_signature_type === 'image') {
  // Display as an image
  <img src={order.gift_card_signature_url} alt="Signature" />
} else {
  // Display as text
  <p>From: {order.gift_card_signature}</p>
}
```

## File Storage

### Directory Structure
```
backend/
  storage/
    app/
      public/
        signatures/
          signature_6789abcd_1736509876.png
          signature_1234efgh_1736509999.png
          ...
  public/
    storage/ (symlink to storage/app/public)
```

### Public Access
Signature images are publicly accessible via:
```
http://localhost:8000/storage/signatures/signature_xyz.png
```

## Security Considerations

1. **File Type Validation**: Only image data URLs are accepted (png, jpg, gif, etc.)
2. **Unique Filenames**: Each signature gets a unique filename to prevent conflicts
3. **Storage Location**: Files are stored in a dedicated `signatures/` directory
4. **Public Access**: Images are accessible via the `storage` symlink

## Error Handling

If signature processing fails:
- Error is logged to Laravel logs
- `gift_card_signature` and `gift_card_signature_type` are set to `null`
- Order creation continues (signature is optional)

## Maintenance

### Cleaning Up Old Signatures
To remove signatures from deleted orders, you can create a scheduled task:

```php
// In app/Console/Kernel.php
$schedule->command('signatures:cleanup')->daily();
```

### Storage Limits
Monitor the `storage/app/public/signatures/` directory size. Each signature is typically 5-50KB.

## Testing

### Test Text Signature
```bash
curl -X POST http://localhost:8000/api/commands \
  -H "Content-Type: application/json" \
  -d '{
    "gift_card": {
      "custom_signing": "John Doe"
    }
  }'
```

### Test Drawn Signature
Send a base64-encoded image in the `custom_signing` field:
```json
{
  "gift_card": {
    "custom_signing": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
}
```

## Summary

✅ **Text signatures** are stored directly in the database  
✅ **Drawn signatures** are saved as PNG files in `storage/app/public/signatures/`  
✅ **Automatic detection** of signature type (text vs. image)  
✅ **Unique filenames** prevent conflicts  
✅ **Public access** via storage symlink  
✅ **Accessor method** provides full URLs in API responses  

The system is fully functional and ready to use!
