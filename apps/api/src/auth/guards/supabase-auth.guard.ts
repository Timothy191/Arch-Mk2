import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import * as jwt from "jsonwebtoken";
import type { FastifyRequest } from "fastify";

/**
 * Global auth guard that validates JWT tokens.
 *
 * Reads the `Authorization: Bearer <token>` header or
 * `auth-token` cookie and validates the JWT.
 *
 * Routes that should skip auth (e.g., /auth/login, /health)
 * use the @Public() decorator.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly jwtSecret = process.env.JWT_SECRET || "fallback-secret";

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // Check for @Public() decorator metadata
    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    // Extract token from Authorization header or cookie
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : this.extractCookieToken(request);

    if (!token) return false;

    try {
      const payload = jwt.verify(token, this.jwtSecret) as {
        sub: string;
        email: string;
        role: string | null;
        departmentId: string | null;
      };

      if (!payload.sub) return false;

      // Attach user to request for @CurrentUser() decorator
      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        user_metadata: {
          role: payload.role,
        },
      };

      return true;
    } catch {
      return false;
    }
  }

  private extractCookieToken(request: FastifyRequest): string | null {
    const cookies = request.headers.cookie;
    if (!cookies) return null;

    const match = cookies.match(/auth-token=([^;]+)/);
    return match?.[1] ?? null;
  }
}