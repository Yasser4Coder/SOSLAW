# Environment Configuration

## API Configuration

The frontend now uses environment variables for API configuration instead of hardcoded URLs.

### Setup

1. **Create a `.env.local` file** in the `soslaw-client` directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

2. **For production**, update the URL to your actual API domain:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

**⚠️ Important:** Do NOT include a trailing slash (`/`) in the URL. The configuration automatically handles this to prevent double slashes in API calls.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

### Files Updated

All API calls now use the centralized configuration from `src/config/api.js`:

- ✅ `src/services/api.js` - Main API instance
- ✅ `src/services/roleService.js` - Role management
- ✅ `src/services/joinTeamApplicationService.js` - Job applications
- ✅ `src/services/categoryService.js` - Categories
- ✅ `src/services/faqService.js` - FAQs
- ✅ `src/services/testimonialService.js` - Testimonials
- ✅ `src/services/publicConsultantService.js` - Public consultants
- ✅ `src/services/publicFaqService.js` - Public FAQs
- ✅ `src/services/publicRoleService.js` - Public roles
- ✅ `src/pages/RequestService.jsx` - Service request page
- ✅ `src/pages/ServiceRequests.jsx` - User service requests

### Benefits

- 🔧 **Easy configuration** - Change API URL in one place
- 🚀 **Environment-specific** - Different URLs for dev/staging/production
- 🔒 **Secure** - No hardcoded URLs in source code
- 📦 **Deployable** - Works with any hosting platform
