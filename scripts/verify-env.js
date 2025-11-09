/**
 * Script to verify all required environment variables are set
 * 
 * Usage:
 *   node scripts/verify-env.js
 * 
 * This will check if all required environment variables are present
 * and provide helpful error messages if any are missing.
 */

const requiredVars = {
  // Database
  DATABASE_URL: {
    required: true,
    description: 'Database connection string (SQLite for dev, MySQL for production)',
    example: 'file:./prisma/dev.db or mysql://user:password@host:3306/database'
  },
  
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
    required: true,
    description: 'Clerk publishable key',
    example: 'pk_test_... or pk_live_...',
    url: 'https://dashboard.clerk.com'
  },
  CLERK_SECRET_KEY: {
    required: true,
    description: 'Clerk secret key',
    example: 'sk_test_... or sk_live_...',
    url: 'https://dashboard.clerk.com'
  },
  CLERK_WEBHOOK_SECRET: {
    required: false,
    description: 'Clerk webhook signing secret (set after first deployment)',
    example: 'whsec_...',
    url: 'https://dashboard.clerk.com'
  },
  
  // Stripe
  STRIPE_SECRET_KEY: {
    required: true,
    description: 'Stripe secret key',
    example: 'sk_test_... or sk_live_...',
    url: 'https://dashboard.stripe.com'
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    required: true,
    description: 'Stripe publishable key',
    example: 'pk_test_... or pk_live_...',
    url: 'https://dashboard.stripe.com'
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    description: 'Stripe webhook signing secret (set after first deployment)',
    example: 'whsec_...',
    url: 'https://dashboard.stripe.com'
  },
  
  // Mux
  MUX_TOKEN_ID: {
    required: true,
    description: 'Mux API token ID',
    example: '...',
    url: 'https://dashboard.mux.com'
  },
  MUX_TOKEN_SECRET: {
    required: true,
    description: 'Mux API token secret',
    example: '...',
    url: 'https://dashboard.mux.com'
  },
  
  // Resend (optional)
  RESEND_API_KEY: {
    required: false,
    description: 'Resend API key for email sending',
    example: 're_...',
    url: 'https://resend.com'
  },
  
  // App config
  NEXT_PUBLIC_APP_URL: {
    required: true,
    description: 'Your application URL',
    example: 'http://localhost:3000 or https://your-app.vercel.app'
  },
  
  // Platform fee
  PLATFORM_FEE_BPS: {
    required: false,
    description: 'Platform fee in basis points (1500 = 15%)',
    example: '1500',
    default: '1500'
  }
}

function verifyEnv() {
  console.log('🔍 Verifying Environment Variables\n')
  console.log('=' .repeat(50))
  console.log('')
  
  const missing = []
  const optional = []
  const present = []
  
  for (const [key, config] of Object.entries(requiredVars)) {
    const value = process.env[key]
    
    if (!value || value.includes('...') || value.trim() === '') {
      if (config.required) {
        missing.push({ key, ...config })
      } else {
        optional.push({ key, ...config })
      }
    } else {
      present.push(key)
    }
  }
  
  // Report results
  if (present.length > 0) {
    console.log('✅ Set Variables:')
    present.forEach(key => {
      const value = process.env[key]
      const masked = value.length > 20 
        ? value.substring(0, 10) + '...' + value.substring(value.length - 4)
        : value
      console.log(`   ${key}: ${masked}`)
    })
    console.log('')
  }
  
  if (missing.length > 0) {
    console.log('❌ Missing Required Variables:')
    missing.forEach(({ key, description, example, url }) => {
      console.log(`\n   ${key}`)
      console.log(`   Description: ${description}`)
      if (example) console.log(`   Example: ${example}`)
      if (url) console.log(`   Get it from: ${url}`)
    })
    console.log('')
  }
  
  if (optional.length > 0) {
    console.log('⚠️  Optional Variables (not set):')
    optional.forEach(({ key, description, example, url, default: defaultValue }) => {
      console.log(`\n   ${key}`)
      console.log(`   Description: ${description}`)
      if (example) console.log(`   Example: ${example}`)
      if (defaultValue) console.log(`   Default: ${defaultValue}`)
      if (url) console.log(`   Get it from: ${url}`)
    })
    console.log('')
  }
  
  console.log('=' .repeat(50))
  console.log('')
  
  if (missing.length === 0) {
    console.log('✅ All required environment variables are set!')
    console.log('')
    if (optional.length > 0) {
      console.log('💡 Tip: Some optional variables are not set. Consider setting them for full functionality.')
    }
    return 0
  } else {
    console.log(`❌ ${missing.length} required variable(s) missing. Please set them in your .env file.`)
    console.log('')
    console.log('To fix:')
    console.log('1. Copy env.template to .env: cp env.template .env')
    console.log('2. Edit .env and fill in the missing values')
    console.log('')
    return 1
  }
}

const exitCode = verifyEnv()
process.exit(exitCode)

