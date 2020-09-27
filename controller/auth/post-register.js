// uma factory function que retorna outra function para registar novos usuários
function makePostRegister({
    User,
    bcrypt,
}) {
    return async (req, res) => {
        try {
            const {
                name,
                email,
                password1,
                password2,
                salary
            } = req.body;

            // Se o usuário não preencher algum campo
            if (!name || !email || !password1 || !password2 || !salary) {
                req.flash("error", "Os dados que você digitou são inválidos");
                return res.redirect('/auth/register');
            }
            // Caso as passwords não forem iguais
            if (password1 != password2) {
                req.flash('error', "As senhas não são iguais");
                return res.redirect('/auth/register');
            }

            // falha se o email já se encontra em uso!
            const user = await User.findOne({ email });
            if (user) {
                req.flash("error", "Já existe um usuário com esse e-mail");
                return res.redirect('/auth/register');
            }

            const newUser = new User({
                name: name,
                email: email,
                salary: salary,
                password: bcrypt.hashSync(password1, 10)
            });

            await newUser.save();
            req.flash("success", "Usuário criado com sucesso");
            res.redirect('/');

        } catch (error) {
            // melhore a forma como lida com erros
            console.log(error);
            return;
        }

    }
}

module.exports = makePostRegister;
