I want to build a SaaS application called ImmoBoost for real estate agencies and independent agents.  
The application should be modern, elegant, and user-friendly, with a clean UI using **shadcn/ui, TailwindCSS, and other modern frameworks** for styling.  

This app will called ImmoBoost
### Core Features

1. Authentication & Roles
   - Sign up, login, logout, forgot password.
   - Roles:
     - Admin (agency manager): manages all data.
     - Agent: manages their own properties and prospects.
     - Visitor: can browse properties and request visits.

2. Property Management
   - Add, edit, delete properties.
   - Property fields: title, description, price, address, type (rent/sale), surface area, number of rooms, photos.
   - Property listing with advanced filters (price, location, type, size).
   - Modern card/grid design with TailwindCSS + shadcn components.

3. Visit Management
   - Agents can schedule property visits.
   - Visitors can request/book a visit via form.
   - Dashboard calendar with scheduled visits.

4. Prospect Tracking
   - Store information about interested visitors (name, email, phone).
   - Track interactions and notes per prospect.
   - Status: New, Contacted, Interested, Closed.

5. Contract Generation
   - Generate rental or sales contracts in PDF format.
   - Fields: tenant/buyer name, price, property address, date.
   - Store and allow download of contracts.

6. Image Enhancement with Google Nano Banana AI SDK
   - Agents can upload property images.
   - Integration with **Google Nano Banana AI SDK** for professional photo enhancement and retouching.
   - After enhancement, agents can preview and download the improved image.
   - Store both original and enhanced images in the database or storage bucket.

7. Notifications
   - Automatic email confirmations for visits and contracts (using SendGrid).
   - (Optional) SMS notifications with Twilio.

8. Dashboard & Analytics
   - Agent dashboard: number of properties, visits, prospects.
   - Admin dashboard: overall statistics (active properties, visits booked, conversions).
   - Export reports to Excel and PDF.
