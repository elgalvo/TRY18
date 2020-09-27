function makePostForgotPassword({
    User,
    crypto,
    nodemailer
}){
    return async(req,res) => {
        const  { email } = req.body;

        // cria um token com carateres randomicos
        const token = crypto.randomBytes(20).toString('hex');

        try {
            // busca da db o usuário pelo email
            const user = await User.findOne({ email });

            // Se não existir
            if(!user){
                console.log(user, email)
                req.flash(
                    'error',
                    'Nenhum usuário encontrado com esse e-mail. Verifique o email digitado.'
                );
                return res.redirect('/auth/forgot');
            }

            // Atualiza as informções de resetar a password do usuário
            await User.update(
                {
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now()+3600000
                }, {
                    where: { id: user.id }
                }
            );
              
            // Emailing stuffs here!!

            const transOptions = {
                host: 'mail.brindel.com.br',
                port: 465,
                secure: true,
                auth: {
                    user:'contato@brindel.com.br',
                    pass: 'Brindel2019'
                },
                tls: {
                    rejectUnauthorized: false
                }
            };

            const smtpTransport = nodemailer.createTransport(transOptions);
    
            const mailOptions = {
                from: 'contato@brindel.com.br',
                to: user.email,
                subject: 'Sua recuperação de senha',
                text:`Olá,  ${user.name}. Você está recebendo esse e-mail porquê solicitou uma recuperação de senha.
                    Clique no link para poder redefinir sua senha. https://${req.headers.host}/auth/reset/${token}`
            };

            // Envia email para o usuário com link pra resetar password!
            smtpTransport.sendMail(mailOptions, (err, info) => {
                if(err){
                    console.log(err);
                } else {
                    //console.log('Mail sent');
                    req.flash('success', 'Email enviado! Cheque sua caixa de entrada');
                    return res.redirect('/auth/login');
                }
            });

        } catch (e) {
            // TODO: Melhorar exceptions handling
            console.log(e.message);
        }
    }
}

module.exports = makePostForgotPassword;
