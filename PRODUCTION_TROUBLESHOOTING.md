# Production Troubleshooting Guide

## Common Production Issues and Solutions

### 1. "Request failed. Please try again." Error

This generic error can have several causes in production:

#### **Solution 1: Environment Variables**
Ensure these environment variables are set in your production environment:

```env
# Required for production
NODE_ENV=production
VERCEL_URL=your-app.vercel.app  # Auto-set by Vercel
CUSTOM_DOMAIN=your-domain.com   # If using custom domain

# Optional optimizations
RATE_LIMIT_MAX_REQUESTS=200     # Increase for production
RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
YOUTUBE_TIMEOUT=25000           # 25 seconds
TRANSCRIPT_TIMEOUT=30000        # 30 seconds
ENABLE_DETAILED_LOGGING=true    # For debugging
```

#### **Solution 2: CORS Issues**
The middleware now automatically allows requests from:
- Your Vercel deployment URL
- Custom domain (if set)
- Localhost (for development)

#### **Solution 3: YouTube Rate Limiting**
If YouTube is blocking your requests:

1. **Check logs** for specific error codes
2. **Implement retry logic** (already included)
3. **Use different User-Agent strings** (updated)
4. **Consider using a proxy service** for high-volume usage

#### **Solution 4: Hosting Provider Issues**
Some hosting providers block external requests:

1. **Vercel**: Should work out of the box
2. **Netlify**: May need function timeout adjustments
3. **Railway/Render**: Check firewall settings
4. **Self-hosted**: Ensure outbound HTTPS is allowed

### 2. Debugging Production Issues

#### **Enable Detailed Logging**
Set `ENABLE_DETAILED_LOGGING=true` in production to get more information:

```bash
# View logs in Vercel
vercel logs your-deployment-url

# View logs in other platforms
# Check your platform's logging documentation
```

#### **Test API Directly**
Test the API endpoint directly:

```bash
curl "https://your-domain.com/api/transcript?videoId=dQw4w9WgXcQ" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

#### **Check Network Connectivity**
Ensure your hosting provider can reach YouTube:

```bash
# Test from your server
curl -I https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### 3. Performance Optimizations

#### **Increase Timeouts**
For slower networks or high-traffic periods:

```env
YOUTUBE_TIMEOUT=30000      # 30 seconds
TRANSCRIPT_TIMEOUT=35000   # 35 seconds
```

#### **Adjust Rate Limits**
For production traffic:

```env
RATE_LIMIT_MAX_REQUESTS=500    # 500 requests
RATE_LIMIT_WINDOW_MS=900000    # per 15 minutes
```

#### **Enable Caching**
Ensure caching is enabled (default):

```env
ENABLE_CACHING=true
```

### 4. Monitoring and Alerts

#### **Set up Error Tracking**
Add error tracking service (Sentry, LogRocket, etc.):

```typescript
// In your error handler
if (process.env.SENTRY_DSN) {
  Sentry.captureException(error);
}
```

#### **Monitor API Usage**
Track API usage patterns:

```typescript
// Add to your analytics
analytics.track('transcript_request', {
  videoId: videoId.substring(0, 8),
  success: true,
  duration: responseTime,
});
```

### 5. Fallback Strategies

#### **Multiple API Endpoints**
Implement fallback to different YouTube endpoints:

```typescript
const endpoints = [
  'https://www.youtube.com/youtubei/v1/get_transcript',
  'https://youtubei.googleapis.com/youtubei/v1/get_transcript',
];
```

#### **Retry with Different Headers**
Rotate User-Agent strings:

```typescript
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
];
```

### 6. Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `RATE_LIMITED` | Too many requests | Wait or increase limits |
| `VIDEO_NOT_FOUND` | Invalid video ID | Check video exists and is public |
| `NO_TRANSCRIPT` | No captions available | Video has no auto-generated captions |
| `FETCH_ERROR` | Network/API error | Check connectivity and retry |
| `TIMEOUT` | Request timed out | Increase timeout values |

### 7. Testing in Production

#### **Health Check Endpoint**
Create a health check:

```typescript
// /api/health
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
}
```

#### **Test with Known Videos**
Use these video IDs for testing:
- `dQw4w9WgXcQ` - Rick Roll (has captions)
- `jNQXAC9IVRw` - Me at the zoo (first YouTube video)
- `9bZkp7q19f0` - Gangnam Style

### 8. Contact Support

If issues persist:

1. **Check GitHub Issues**: Look for similar problems
2. **Create Issue**: Include logs, environment, and steps to reproduce
3. **Discord/Slack**: Join community channels for real-time help

### 9. Emergency Fixes

#### **Quick Disable Rate Limiting**
```env
ENABLE_RATE_LIMIT=false
```

#### **Increase All Timeouts**
```env
YOUTUBE_TIMEOUT=60000
TRANSCRIPT_TIMEOUT=60000
```

#### **Enable Debug Mode**
```env
LOG_LEVEL=DEBUG
ENABLE_DETAILED_LOGGING=true
```

---

**Remember**: Always test changes in a staging environment before deploying to production.