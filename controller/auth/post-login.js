function makePostLogin({
    User,
    bcrypt
}) {
    return async (req, res) => {
        const {
            email,
            password
        } = req.body;

        try {
            if (!email || !password) {
                req.flash("error", "Verifique os dados digitados.");
                return res.redirect('/auth/login');
            }

            const user = await User.findOne({ email });
            // Se não existir usuário registado com o email recebido
            if (!user) {
                req.flash("error", "Senha ou e-mail incorretos");
                return res.redirect('/auth/login');
            }

            // Se a password for incorreta!
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                req.flash("error", "Senha ou e-mail incorretos");
                return res.redirect('/auth/login');
            }
            
            req.session.user = {
                id: user.id,
                email: user.email,
                admin: user.admin,
                salary: user.salary,
                name: user.name,
            };
            return res.redirect('/financeiro');
            
        } catch (e) {
            return res.redirect('/auth/login');
        }
    }
}

module.exports = makePostLogin;
