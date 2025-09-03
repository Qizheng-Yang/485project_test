@@ .. @@
 # CSE 485 Project Connect Studio

+## Project Structure

+This is a full-stack tribute video application with:
+- **Frontend**: React + TypeScript + Vite
+- **Backend**: Node.js + Express + JWT Authentication
+- **Database**: JSON file-based storage (easily replaceable with SQL/NoSQL)

+## Getting Started

+### Frontend Development
+```bash
+npm run dev
+```

+### Backend Development
+```bash
+cd server
+npm run dev
+```

+## Features Implemented

+### Backend (Sprint 1-2 Complete)
+- ✅ User authentication (register/login with JWT)
+- ✅ Project creation and management
+- ✅ File upload system (images, videos, music)
+- ✅ Secure API endpoints with authentication middleware
+- ✅ Rate limiting and security headers
+- ✅ Error handling and validation

+### Frontend Integration
+- ✅ Authentication context and protected routes
+- ✅ API service layer for backend communication
+- ✅ Project management integration
+- ✅ File upload integration with backend

+## Next Steps (Sprint 3-6)

+### Sprint 3: Video Generation Engine
+- Integrate ffmpeg for actual video processing
+- Implement slideshow generation with transitions
+- Add text overlay capabilities

+### Sprint 4: Templates & Customization
+- Create template system
+- Implement advanced effects and styling
+- Add music integration to video generation

+### Sprint 5: Real-time Preview
+- Optimize preview generation
+- Add project state persistence
+- Implement drag-and-drop reordering

+### Sprint 6: Sharing & Deployment
+- Generate shareable links
+- Add download functionality
+- Deploy to production environment

+## API Endpoints

+### Authentication
+- `POST /api/auth/register` - User registration
+- `POST /api/auth/login` - User login
+- `GET /api/auth/me` - Get current user

+### Projects
+- `GET /api/projects` - Get user's projects
+- `POST /api/projects` - Create new project
+- `GET /api/projects/:id` - Get specific project
+- `PUT /api/projects/:id` - Update project
+- `DELETE /api/projects/:id` - Delete project

+### File Upload
+- `POST /api/upload/main-image` - Upload main image
+- `POST /api/upload/gallery` - Upload gallery files
+- `POST /api/upload/music` - Upload music file
+- `DELETE /api/upload/file/:filename` - Delete uploaded file

+### Video Processing
+- `POST /api/video/preview/:projectId` - Generate preview
+- `POST /api/video/final/:projectId` - Generate final video
+- `GET /api/video/status/:projectId` - Get processing status