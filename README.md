# YouTube Transcript Downloader

A production-ready Next.js application for extracting and downloading YouTube video transcripts with comprehensive error handling, security features, and performance optimizations.

## 🚀 Features

- **Universal Video Support**: Extract transcripts from any YouTube video with available captions
- **Multiple Formats**: Download transcripts as TXT or SRT files
- **Real-time Processing**: Fast transcript extraction using YouTube's internal APIs
- **Security First**: Rate limiting, input validation, and security headers
- **Production Ready**: Comprehensive error handling, logging, and monitoring
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Testing**: Comprehensive unit test coverage

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **UI Components**: Radix UI + shadcn/ui

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-transcript-downloader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   # Optional: YouTube Data API key for enhanced features
   YOUTUBE_API_KEY=your_api_key_here
   
   # Rate limiting configuration
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=900000
   
   # Logging level
   LOG_LEVEL=INFO
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── transcript/           # Transcript extraction API
│   │   └── video-info/           # Video information API
│   ├── transcript/[videoId]/     # Dynamic transcript pages
│   └── youtube-tools/            # Tool pages
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Core utilities and configurations
│   ├── youtube-api.ts           # YouTube API utilities
│   ├── rate-limiter.ts          # Rate limiting implementation
│   ├── logger.ts                # Structured logging
│   └── config.ts                # Environment configuration
├── utils/                        # Client-side utilities
└── middleware.ts                 # Next.js middleware for security

__tests__/                        # Unit tests
├── lib/                          # Library tests
├── utils/                        # Utility tests
└── hooks/                        # Hook tests
```

## 🔧 API Endpoints

### GET `/api/transcript`

Extracts transcript from a YouTube video.

**Parameters:**
- `videoId` (string, required): YouTube video ID

**Response:**
```json
{
  "transcript": "Formatted transcript text...",
  "language": "auto-detected",
  "trackName": "YouTube Auto-generated",
  "wordCount": 1234
}
```

**Error Codes:**
- `INVALID_VIDEO_ID`: Invalid video ID format
- `VIDEO_NOT_FOUND`: Video not found or private
- `NO_TRANSCRIPT`: No transcript available
- `RATE_LIMITED`: Too many requests
- `FETCH_ERROR`: Network or API error

### GET `/api/video-info`

Fetches video metadata.

**Parameters:**
- `videoId` (string, required): YouTube video ID

**Response:**
```json
{
  "title": "Video Title",
  "author": "Channel Name",
  "thumbnail": "https://img.youtube.com/vi/..."
}
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schema validation for all inputs
- **Security Headers**: CSP, XSS protection, frame options
- **CORS Configuration**: Controlled cross-origin access
- **Error Sanitization**: No sensitive data in error responses
- **Request Timeouts**: Prevent hanging requests

## 📊 Performance Optimizations

- **Caching**: HTTP caching headers for API responses
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Optimized bundle size
- **Memory Management**: Efficient data structures and cleanup

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Docker

```bash
# Build the Docker image
docker build -t youtube-transcript-downloader .

# Run the container
docker run -p 3000:3000 youtube-transcript-downloader
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔍 Monitoring and Logging

- **Structured Logging**: JSON logs in production
- **Error Tracking**: Comprehensive error logging with context
- **Performance Metrics**: Request duration and success rates
- **Rate Limit Monitoring**: Track API usage patterns

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes and add tests**
4. **Ensure all tests pass**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📝 Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Jest**: Unit testing with 80%+ coverage

## 🐛 Troubleshooting

### Common Issues

1. **"No transcript available"**
   - Video may not have captions enabled
   - Video may be private or restricted
   - Try a different video with known captions

2. **Rate limit exceeded**
   - Wait 15 minutes before making more requests
   - Consider implementing user authentication for higher limits

3. **Network timeouts**
   - Check internet connection
   - YouTube services may be temporarily unavailable

### Debug Mode

Set `LOG_LEVEL=DEBUG` in your environment to enable detailed logging.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube for providing the transcript APIs
- Next.js team for the excellent framework
- Vercel for hosting and deployment platform
- Open source community for the amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js and TypeScript**