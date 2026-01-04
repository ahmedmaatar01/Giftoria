@php($d = $data)
<x-mail::message>
# New Contact Message

**Name:** {{ $d['name'] ?? 'N/A' }}  
**Email:** {{ $d['email'] ?? 'N/A' }}  

**Message:**

{{ $d['message'] ?? 'No message provided.' }}

---
This message was submitted via the website contact form.
</x-mail::message>
