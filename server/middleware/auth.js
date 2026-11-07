import jwt from 'jsonwebtoken';

export function authenticateAdmin(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Autenticação necessária.'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({
                error: 'Acesso não autorizado.'
            });
        }

        req.admin = decoded;
        next();

    } catch {
        return res.status(401).json({
            error: 'Sessão inválida ou expirada.'
        });
    }
}