import { Role } from '@prisma/client';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    // user must be authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    // admin bypass
    if (req.user.role === Role.ADMIN) {
      return next();
    }

    // check allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission',
      });
    }

    return next();
  };
};
