module.exports = {

    isLoggedIn(req, res,  next){
        if(req.isAuthenticated()  && req.user.fk_Rol_Persona === '2'){
            return next();
        }
        return res.redirect('/signin');
    },
    isNotLoggedIn2(req, res, next) {
        if (!req.isAuthenticated() ){
            return next();
        }
        return res.redirect('/profile');
    }
};