export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Super Admin access required'
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

export const isEditor = (req, res, next) => {
  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Editor access required'
    });
  }
  next();
};