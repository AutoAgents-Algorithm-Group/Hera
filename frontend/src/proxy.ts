/**
 * Next.js 16 Proxy (替代 middleware)
 * 
 * 处理：
 * - 国际化路由 (next-intl)
 * - Better Auth 认证检查
 * - 路由保护
 */

import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { locales } from './i18n/request'

// 创建 i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'zh',
  localePrefix: 'always'
})

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // API 路由和静态资源不需要认证检查
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/brand') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // 首先处理 i18n
  const response = intlMiddleware(req)
  
  // 提取语言前缀，如果为空则使用默认语言 'zh'
  const pathSegments = pathname.split('/').filter(Boolean)
  const locale = pathSegments[0] && locales.includes(pathSegments[0] as any) ? pathSegments[0] : 'zh'
  
  // 检查是否是认证页面
  const isSignInPage = pathname.includes('/sign-in')
  const isSignUpPage = pathname.includes('/sign-up')
  const isAuthCallback = pathname.includes('/auth/callback')
  
  // 检查是否是需要保护的路由（只保护dashboard路由）
  const isProtectedRoute = pathname.includes('/dashboard')
  
  // 检查 Better Auth session cookie
  // 注意：生产环境使用 __Secure- 前缀，开发环境不使用
  // cookiePrefix: 'hera' + useSecureCookies: true -> __Secure-hera.session_token
  const sessionToken = req.cookies.get('__Secure-hera.session_token') || 
                       req.cookies.get('hera.session_token')
  const hasSession = !!sessionToken
  
  // Debug logging (生产环境也启用，用于调试登录问题)
  // console.log('[Proxy]', {
  //   pathname,
  //   hasSession,
  //   isProtectedRoute,
  //   locale,
  //   cookies: req.cookies.getAll().map(c => c.name)
  // })
  
  // 只有访问受保护路由（dashboard）时才检查登录状态
  if (!hasSession && isProtectedRoute) {
    console.log('[Proxy] Protected route, redirecting to sign-in:', pathname)
    const signInUrl = new URL(`/${locale}/sign-in`, req.url)
    // 保存原始访问路径，登录后跳转回来
    signInUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // 如果已登录且访问认证页面，重定向到dashboard
  if (hasSession && (isSignInPage || isSignUpPage)) {
    console.log('[Proxy] Already logged in, redirecting to dashboard')
    const dashboardUrl = new URL(`/${locale}/dashboard`, req.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  return response
}

export const config = {
  matcher: [
    // 匹配所有路径，除了 API、静态文件等
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // 明确匹配国际化路由
    '/(en|zh)/:path*'
  ]
}

