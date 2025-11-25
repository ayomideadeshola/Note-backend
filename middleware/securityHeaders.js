const helmet = require("helmet");

const sanitizeMongoInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      sanitized[key] = sanitize(obj[key]);
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    const sanitized = sanitize(req.query);
    Object.keys(req.query).forEach(key => delete req.query[key]);
    Object.assign(req.query, sanitized);
  }
  
  next();
};

const sanitizeXSS = (req, res, next) => {
  const clean = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<embed/gi, '')
        .replace(/<object/gi, '');
    }
    
    if (Array.isArray(value)) {
      return value.map(item => clean(item));
    }
    
    if (value !== null && typeof value === 'object') {
      const cleaned = {};
      for (const key in value) {
        cleaned[key] = clean(value[key]);
      }
      return cleaned;
    }
    
    return value;
  };

  if (req.body) {
    req.body = clean(req.body);
  }
  
  if (req.params) {
    req.params = clean(req.params);
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    const cleaned = clean(req.query);
    Object.keys(req.query).forEach(key => delete req.query[key]);
    Object.assign(req.query, cleaned);
  }
  
  next();
};

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: "no-referrer" },
});

const customSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
};

const securityHeaders = [
  helmetMiddleware,
  sanitizeMongoInput,
  sanitizeXSS,
  customSecurityHeaders,
];

module.exports = securityHeaders;